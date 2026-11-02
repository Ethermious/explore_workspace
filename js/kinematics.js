/* Pure five-bar geometry. Units: millimetres and radians. No dynamics or motor commands. */
(function(root){
'use strict';
const eps=1e-8, hypot=Math.hypot;
function elbow(base,target,a,c,sign){
 const dx=target.x-base.x,dy=target.y-base.y,d=hypot(dx,dy);
 if(!Number.isFinite(d)||d<eps||d>a+c+eps||d<Math.abs(a-c)-eps)return null;
 const cos=(a*a+d*d-c*c)/(2*a*d);
 const angle=Math.atan2(dy,dx)+sign*Math.acos(Math.max(-1,Math.min(1,cos)));
 return {x:base.x+a*Math.cos(angle),y:base.y+a*Math.sin(angle),angle};
}
function cross(a,b,c){return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)}
function intersects(a,b,c,d){return cross(a,b,c)*cross(a,b,d)<-eps&&cross(c,d,a)*cross(c,d,b)<-eps}
function solve(p,t,branch=[1,-1]){
 if(![p.base,p.upper,p.lower,t.x,t.y].every(Number.isFinite)||p.base<=0||p.upper<=0||p.lower<=0)return null;
 const A={x:-p.base/2,y:0},B={x:p.base/2,y:0},L=elbow(A,t,p.upper,p.lower,branch[0]),R=elbow(B,t,p.upper,p.lower,branch[1]);
 if(!L||!R)return null;
 const sine=(u,v)=>Math.abs((u.x*v.y-u.y*v.x)/(hypot(u.x,u.y)*hypot(v.x,v.y)));
 const distal=sine({x:L.x-t.x,y:L.y-t.y},{x:R.x-t.x,y:R.y-t.y});
 const sl=sine({x:L.x-A.x,y:L.y-A.y},{x:t.x-L.x,y:t.y-L.y});
 const sr=sine({x:R.x-B.x,y:R.y-B.y},{x:t.x-R.x,y:t.y-R.y});
 const collision=intersects(A,L,B,R)||intersects(A,L,R,t)||intersects(B,R,L,t);
 return {A,B,L,R,T:{...t},angles:[L.angle,R.angle],margin:Math.min(distal,sl,sr),collision,residual:Math.max(Math.abs(hypot(t.x-L.x,t.y-L.y)-p.lower),Math.abs(hypot(t.x-R.x,t.y-R.y)-p.lower))};
}
const api={elbow,solve,intersects}; root.FiveBar=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
