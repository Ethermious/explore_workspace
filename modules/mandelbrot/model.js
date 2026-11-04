/* Mandelbrot Atlas: deterministic binary64 mathematics, shared by UI, worker and tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FractalMath=api;})(typeof self!=='undefined'?self:globalThis,function(){
'use strict';
const DEFAULT_VIEW={x:-.5,y:0,span:3.6};
const MIN_SPAN=1e-9,MAX_SPAN=12;
const finite=(n,f=0)=>Number.isFinite(Number(n))?Number(n):f;
function power(x,y,p){if(p===2)return [x*x-y*y,2*x*y];let a=x,b=y;for(let k=1;k<p;k++){const t=a*x-b*y;b=a*y+b*x;a=t;}return [a,b];}
function escapeRadius(cr,ci,mode='mandelbrot'){return mode==='julia'?Math.max(2,Math.hypot(cr,ci)):2;}
function analyticInterior(x,y){
 // Strict conservative margin: never use this shortcut on the boundary.
 const q=(x-.25)*(x-.25)+y*y, lhs=q*(q+x-.25),rhs=.25*y*y;
 const eps=64*Number.EPSILON*Math.max(1,Math.abs(lhs),Math.abs(rhs));
 return lhs<rhs-eps || (x+1)*(x+1)+y*y<.0625-64*Number.EPSILON;
}
function iterate(cr,ci,zr=0,zi=0,max=600,p=2,radius=2,shortcut=false){
 max=Math.max(1,Math.floor(max));let x=zr,y=zi,n=0,r2=radius*radius;
 if(shortcut&&p===2&&zr===0&&zi===0&&analyticInterior(cr,ci))return {escaped:false,n:max,x,y,analytic:true,smooth:0};
 // Julia seeds outside R have escaped at n=0; the Mandelbrot seed is 0.
 if(x*x+y*y>r2){const smooth=1-Math.log(Math.log(Math.hypot(x,y)))/Math.log(p);return {escaped:true,n:0,x,y,analytic:false,smooth:Number.isFinite(smooth)?smooth:0};}
 for(n=1;n<=max;n++){
  if(p===2){const xx=x*x-y*y+cr;y=2*x*y+ci;x=xx;}else{const z=power(x,y,p);x=z[0]+cr;y=z[1]+ci;}
  const mag2=x*x+y*y;
  if(mag2>r2){const smooth=n+1-Math.log(Math.log(Math.sqrt(mag2)))/Math.log(p);return {escaped:true,n,x,y,analytic:false,smooth:Number.isFinite(smooth)?smooth:n};}
 }
 return {escaped:false,n:max,x,y,analytic:false,smooth:0};
}
function orbit(cr,ci,zr=0,zi=0,max=64,p=2,radius=2){
 const points=[{x:zr,y:zi,n:0}];let x=zr,y=zi,escaped=x*x+y*y>radius*radius;
 for(let n=1;n<=max&&!escaped;n++){const z=power(x,y,p);x=z[0]+cr;y=z[1]+ci;points.push({x,y,n});escaped=x*x+y*y>radius*radius;}
 return {points,escaped};
}
function pixelToComplex(px,py,w,h,view){return {x:view.x+(px/w-.5)*view.span,y:view.y+(.5-py/h)*view.span*h/w};}
function complexToPixel(x,y,w,h,view){return {x:(.5+(x-view.x)/view.span)*w,y:(.5-(y-view.y)/(view.span*h/w))*h};}
function minSpan(view,w=1000){return Math.max(MIN_SPAN,w*32*Number.EPSILON*Math.max(1,Math.abs(view.x),Math.abs(view.y)));}
function clampView(view,w=1000){const v={x:Math.max(-8,Math.min(8,finite(view.x,-.5))),y:Math.max(-8,Math.min(8,finite(view.y,0))),span:finite(view.span,3.6)};v.span=Math.max(minSpan(v,w),Math.min(MAX_SPAN,v.span));return v;}
function zoomAt(view,factor,px,py,w,h){const before=pixelToComplex(px,py,w,h,view);const span=Math.max(minSpan(view,w),Math.min(MAX_SPAN,view.span*factor));return clampView({x:before.x-(px/w-.5)*span,y:before.y-(.5-py/h)*span*h/w,span},w);}
function normalize(input={}){const mode=input.mode==='julia'?'julia':'mandelbrot';return {mode,p:Math.max(2,Math.min(6,Math.round(finite(input.p,2)))),max:Math.max(32,Math.min(3000,Math.round(finite(input.max,600)))),cr:Math.max(-32,Math.min(32,finite(input.cr,-.75))),ci:Math.max(-32,Math.min(32,finite(input.ci,.1))),zr:Math.max(-32,Math.min(32,finite(input.zr,0))),zi:Math.max(-32,Math.min(32,finite(input.zi,0))),view:clampView(input.view||DEFAULT_VIEW),palette:['lagoon','ember','violet','mono'].includes(input.palette)?input.palette:'lagoon'};}
function color(value,palette='lagoon',bands=false){
 // Palette values encode escape time only, not physical quantities.
 const t=(bands?Math.floor(value):value)*.035;
 const palettes={lagoon:[[8,17,35],[39,87,134],[64,191,182],[227,244,188],[247,174,116],[28,50,81]],ember:[[19,13,37],[102,43,111],[226,96,99],[255,201,137],[255,246,207],[91,29,53]],violet:[[19,18,38],[66,51,127],[163,117,214],[224,191,249],[139,213,219],[33,49,91]],mono:[[13,17,28],[103,121,145],[243,245,244],[80,94,117]]};
 const a=palettes[palette]||palettes.lagoon;const u=((t%a.length)+a.length)%a.length;const i=Math.floor(u),f=u-i,b=a[(i+1)%a.length];return a[i].map((v,k)=>Math.round(v+(b[k]-v)*f));
}
function renderRows(config,width,height,start,rows){const out=new Uint8ClampedArray(width*rows*4);const {view,mode,p,max,cr,ci,palette,bands}=config;const radius=escapeRadius(cr,ci,mode);let k=0;
 for(let y=start;y<start+rows;y++)for(let x=0;x<width;x++){
  const z=pixelToComplex(x+.5,y+.5,width,height,view);const r=mode==='julia'?iterate(cr,ci,z.x,z.y,max,p,radius):iterate(z.x,z.y,0,0,max,p,2,p===2);
  const rgb=r.escaped?color(bands?r.n:r.smooth,palette,bands):[7,12,22];out[k++]=rgb[0];out[k++]=rgb[1];out[k++]=rgb[2];out[k++]=255;
 }return out;}
return {DEFAULT_VIEW,MIN_SPAN,MAX_SPAN,power,escapeRadius,analyticInterior,iterate,orbit,pixelToComplex,complexToPixel,minSpan,clampView,zoomAt,normalize,color,renderRows};
});
