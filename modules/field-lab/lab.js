/* No dependencies. Particle positions are integrated in the transform-feedback shader. */
(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('field');
let gl=canvas.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'high-performance'});
let alive=true,paused=ExploreVisuals.reduced(),raf=0,last=0,samples=[],read=0,count=65536,yaw=.35,pitch=.08,zoom=1,drag=null,simTime=0;
const resources={buffers:[],vaos:[],programs:[],shaders:[],feedback:[]};
function fail(message){alive=false;cancelAnimationFrame(raf);$('error').hidden=false;$('error').textContent=message;$('status').textContent='Stopped · GPU unavailable';$('pause').disabled=true;$('renderer').textContent='WebGL 2 unavailable or stopped';$('gpuNote').textContent='No particle simulation is running.';}
if(!gl){fail('WebGL 2 is unavailable. Try a current desktop browser with hardware acceleration enabled. This lab does not substitute a CPU animation.');return;}
const updateVS=`#version 300 es
precision highp float;
layout(location=0) in vec4 state;
uniform float dt, parameter;uniform int system;
out vec4 nextState;
vec3 field(vec3 p){
 if(system==0) return vec3(10.*(p.y-p.x), p.x*(parameter-p.z)-p.y, p.x*p.y-(8./3.)*p.z);
 if(system==1) return vec3(sin(p.y)-parameter*p.x,sin(p.z)-parameter*p.y,sin(p.x)-parameter*p.z);
 float x=p.x,y=p.y,z=p.z;return vec3((z-.7)*x-3.5*y,3.5*x+(z-.7)*y,.6+parameter*z-z*z*z/3.-(x*x+y*y)*(1.+.25*z)+.1*z*x*x*x);
}
void main(){vec3 p=state.xyz;for(int i=0;i<4;i++){vec3 k=field(p);p+=dt*field(p+.5*dt*k);}if(any(isnan(p))||any(isinf(p))||length(p)>150.)p=vec3(.1+state.w,.1,.1);nextState=vec4(p,state.w);}
`;
const dummyFS=`#version 300 es
precision highp float;out vec4 color;void main(){color=vec4(0.);}`;
const drawVS=`#version 300 es
precision highp float;layout(location=0)in vec4 state;uniform int system;uniform float yaw,pitch,zoom,aspect,pixelScale,look;uniform int palette;out vec3 tint;out float depth;
void main(){vec3 p=state.xyz;if(system==0)p=vec3(p.x,p.z-24.,p.y)*.052;else if(system==1)p*=.55;else p=vec3(p.x,p.z-.6,p.y)*1.4;
float cy=cos(yaw),sy=sin(yaw),cx=cos(pitch),sx=sin(pitch);p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);p=vec3(p.x,cx*p.y-sx*p.z,sx*p.y+cx*p.z);float z=5.5-p.z;gl_Position=vec4((p.x*2.5*zoom/aspect-.07*z),p.y*2.5*zoom,.5*z,z);gl_PointSize=clamp((2.1+1.5/max(z,.3))*pixelScale*sqrt(look),1.,7.);depth=clamp(1.1-z*.09,.3,1.);float t=clamp(state.w*.45+state.z*(system==0?.012:.14),0.,1.);tint=mix(vec3(.13,.48,.8),vec3(.29,1.,.7),t);if(state.w>.83)tint=mix(tint,vec3(1.,.5,.22),.65);if(look>1.){if(palette==1)tint=mix(vec3(.72,.18,1.),vec3(.25,.93,1.),t);else if(palette==2)tint=mix(vec3(1.,.18,.27),vec3(1.,.76,.24),t);else tint=mix(vec3(.24,.22,.9),vec3(.18,1.,.72),t);tint=mix(tint,vec3(1.),pow(state.w,12.)*.65);}}
`;
const drawFS=`#version 300 es
precision highp float;in vec3 tint;in float depth;uniform float intensity,look;out vec4 color;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float core=pow(1.-r,1.8);float halo=exp(-5.*r*r)*.18*(1.-r);float a=(core+(look-1.)*halo)*intensity*depth;color=vec4(tint*a,a);}`;
function shader(type,source){const s=gl.createShader(type);resources.shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
function program(vs,fs,feedback){const p=gl.createProgram();resources.programs.push(p);gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));if(feedback)gl.transformFeedbackVaryings(p,['nextState'],gl.INTERLEAVED_ATTRIBS);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
let update,draw,tf,visuals;const u={};
try{update=program(updateVS,dummyFS,true);draw=program(drawVS,drawFS);tf=gl.createTransformFeedback();resources.feedback.push(tf);for(const [key,p,names]of[['update',update,['dt','parameter','system']],['draw',draw,['system','yaw','pitch','zoom','aspect','pixelScale','intensity','look','palette']]]){u[key]={};for(const n of names)u[key][n]=gl.getUniformLocation(p,n);}}catch(e){fail('GPU shader initialization failed: '+e.message);return;}
function seeded(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function allocate(){for(const b of resources.buffers)gl.deleteBuffer(b);for(const v of resources.vaos)gl.deleteVertexArray(v);resources.buffers=[];resources.vaos=[];
 count=Number($('quality').value);$('countLabel').textContent=count.toLocaleString();$('particles').textContent=Math.round(count/1024)+'k';const seed=Math.min(999999,Math.max(1,Math.floor(Number($('seed').value)||3070)));$('seed').value=seed;const rand=seeded(seed),data=new Float32Array(count*4),system=Number($('system').value);
 for(let i=0;i<count;i++){let j=i*4;data[j]=(rand()-.5)*(system===0?36:system===1?6:2);data[j+1]=(rand()-.5)*(system===0?40:system===1?6:2);data[j+2]=system===0?rand()*44:system===1?(rand()-.5)*6:rand()*2;data[j+3]=rand();}
 for(let i=0;i<2;i++){const b=gl.createBuffer(),v=gl.createVertexArray();resources.buffers.push(b);resources.vaos.push(v);gl.bindVertexArray(v);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_COPY);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);}gl.bindVertexArray(null);gl.bindBuffer(gl.ARRAY_BUFFER,null);read=0;simTime=0;
 // A bounded GPU warm-up reveals each field immediately; no CPU integration.
 for(let i=0;i<100;i++)step(.006);resize();render();status();}
function step(dt){gl.useProgram(update);gl.uniform1f(u.update.dt,dt);gl.uniform1f(u.update.parameter,Number($('shape').value));gl.uniform1i(u.update.system,Number($('system').value));gl.bindVertexArray(resources.vaos[read]);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,tf);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,resources.buffers[1-read]);gl.enable(gl.RASTERIZER_DISCARD);gl.beginTransformFeedback(gl.POINTS);gl.drawArrays(gl.POINTS,0,count);gl.endTransformFeedback();gl.disable(gl.RASTERIZER_DISCARD);gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,null);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);gl.bindVertexArray(null);read=1-read;simTime+=4*dt;}
let scale=1,lastRenderKey='';
function renderKey(){return [yaw,pitch,zoom,canvas.width,canvas.height,$('glow').value,$('look').value,$('palette').value,$('ambience').checked,$('system').value,count,simTime].join('|');}
function resize(){const rect=canvas.getBoundingClientRect(),q=Number($('quality').value);scale=Math.min(devicePixelRatio||1,q>=524288?1.5:q>=262144?1.25:1,Math.sqrt(3686400/(rect.width*rect.height)));const w=Math.max(1,Math.floor(rect.width*scale)),h=Math.max(1,Math.floor(rect.height*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
function render(){if(!alive)return;lastRenderKey=renderKey();gl.clearColor(.0235,.047,.086,1);gl.clear(gl.COLOR_BUFFER_BIT);visuals.background();const look=visuals.settings();gl.useProgram(draw);gl.uniform1f(u.draw.look,look.intensity);gl.uniform1i(u.draw.palette,look.palette);gl.uniform1i(u.draw.system,Number($('system').value));gl.uniform1f(u.draw.yaw,yaw);gl.uniform1f(u.draw.pitch,pitch);gl.uniform1f(u.draw.zoom,zoom);gl.uniform1f(u.draw.aspect,canvas.width/canvas.height);gl.uniform1f(u.draw.pixelScale,scale);gl.uniform1f(u.draw.intensity,Number($('glow').value)*Math.sqrt(65536/count)*.26*look.intensity);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.bindVertexArray(resources.vaos[read]);gl.drawArrays(gl.POINTS,0,count);gl.bindVertexArray(null);gl.disable(gl.BLEND);}
function status(){if(alive)$('status').textContent=document.hidden?'Hidden · GPU paused':paused?'Paused · GPU redraws only on interaction':visuals.renderer.classification==='software'?'Software WebGL · CPU execution':'WebGL integration active · bounded budget';}
function tick(t){raf=0;if(!alive||document.hidden)return;const elapsed=last?t-last:16.667;last=t;if(!paused){const dt=Math.min(elapsed,33.334)/1000;step(dt*.24*Number($('speed').value)*(Number($('system').value)===0?1:3));if($('rotate').checked&&!drag)yaw+=dt*.075;}
 if(!paused||lastRenderKey!==renderKey())render();samples.push(elapsed);if(samples.length>=30){const avg=samples.reduce((a,b)=>a+b,0)/samples.length;$('fps').textContent=paused?'—':(1000/avg).toFixed(0);$('frame').textContent=paused?'—':avg.toFixed(1);samples=[];}raf=requestAnimationFrame(tick);}
function start(){if(alive&&!document.hidden&&!raf){last=0;raf=requestAnimationFrame(tick);}}
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume':'Pause';status();};$('reset').onclick=()=>{if(alive)allocate();};$('quality').onchange=()=>{if(alive)allocate();};
const systems=[{min:18,max:40,step:.1,value:28,symbol:'ρ',desc:'Two unstable wings. A classic demonstration of deterministic chaos.'},{min:.12,max:.3,step:.001,value:.208,symbol:'b',desc:'Cyclic symmetry, sinuous pathways. Damping controls how the field folds.'},{min:.3,max:.85,step:.01,value:.7,symbol:'b',desc:'A delicate orbit around a central stem. A sculptural nonlinear flow.'}];
function labels(){const cfg=systems[Number($('system').value)];$('shapeLabel').textContent=cfg.symbol+' = '+Number($('shape').value).toFixed(Number($('system').value)===1?3:1);$('speedLabel').textContent=Number($('speed').value).toFixed(1)+'×';$('glowLabel').textContent=Number($('glow').value).toFixed(1)+'×';}
$('system').onchange=()=>{const cfg=systems[Number($('system').value)];for(const k of ['min','max','step','value'])$('shape')[k]=cfg[k];$('description').textContent=cfg.desc;labels();if(alive)allocate();};for(const id of ['shape','speed','glow'])$(id).oninput=labels;
$('camera').onclick=()=>{yaw=.35;pitch=.08;zoom=1;};$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(e){$('status').textContent='Full screen unavailable · lab still running';}};
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.08;if(e.key==='ArrowRight')yaw+=.08;if(e.key==='ArrowUp')pitch=Math.max(-1.4,pitch-.08);if(e.key==='ArrowDown')pitch=Math.min(1.4,pitch+.08);if(e.key==='+'||e.key==='=')zoom=Math.min(2.5,zoom*1.08);if(e.key==='-')zoom=Math.max(.4,zoom/1.08);});
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.006;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY};});for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.4,Math.min(2.5,zoom*Math.exp(-e.deltaY*.001)));},{passive:false});window.addEventListener('resize',()=>{if(alive)resize();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;samples=[];$('fps').textContent='—';$('frame').textContent='—';}else start();status();});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('The graphics context was lost. The lab has stopped safely. Close other GPU-heavy apps, then reload this page.');});
function cleanup(){alive=false;cancelAnimationFrame(raf);if(gl.isContextLost())return;visuals.dispose();for(const v of resources.vaos)gl.deleteVertexArray(v);for(const b of resources.buffers)gl.deleteBuffer(b);for(const p of resources.programs)gl.deleteProgram(p);for(const s of resources.shaders)gl.deleteShader(s);for(const f of resources.feedback)gl.deleteTransformFeedback(f);}
window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();else{cancelAnimationFrame(raf);raf=0;}});window.addEventListener('pageshow',e=>{if(e.persisted)start();});
// Read-only diagnostics for local QA; does not estimate utilization or VRAM.
window.fieldLabDiagnostics=()=>({alive,paused,count,simTime,width:canvas.width,height:canvas.height,renderer:visuals.renderer,visuals:visuals.settings(),glError:gl.getError()});
try{visuals=ExploreVisuals.create(gl,canvas,'field',()=>{lastRenderKey='';resize();});if(paused){$('pause').textContent='Resume';$('rotate').checked=false;}allocate();start();}catch(e){fail('The GPU lab could not start: '+e.message);}
})();

