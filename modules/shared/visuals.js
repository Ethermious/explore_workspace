/* Presentation only. No simulation state, integration, telemetry or network access. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function rendererInfo(gl){
 if(!gl)return {renderer:'WebGL 2 unavailable',classification:'unavailable'};
 const ext=gl.getExtension('WEBGL_debug_renderer_info');
 const renderer=String(gl.getParameter(ext?ext.UNMASKED_RENDERER_WEBGL:gl.RENDERER)||'Not exposed');
 const software=/swiftshader|llvmpipe|softpipe|software|lavapipe/i.test(renderer);
 return {renderer,classification:software?'software':ext?'reported-device':'unconfirmed'};
}
function create(gl,canvas,kind,onChange){
 const resources={program:null,shaders:[],vao:null};
 const info=rendererInfo(gl);
 $('renderer').textContent=info.renderer;
 $('gpuNote').textContent=info.classification==='software'?'Software renderer detected. WebGL is running on the CPU; this is not RTX execution.':info.classification==='reported-device'?'Browser-reported renderer. Check your browser GPU page and Task Manager to verify hardware acceleration; this is not utilization telemetry.':'Browser did not expose its device. WebGL availability alone does not prove hardware acceleration.';
 $('gpuNote').classList.toggle('software-warning',info.classification==='software');
 const vs=`#version 300 es
 precision highp float;out vec2 uv;
 void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
 const fs=`#version 300 es
 precision highp float;in vec2 uv;out vec4 color;uniform float aspect;uniform int kind,palette;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
 void main(){vec2 p=(uv-.5)*vec2(aspect,1.);float n=noise(p*3.2)+.5*noise(p*7.1)+.25*noise(p*15.3);float cloud=pow(max(0.,1.-abs(p.y+.2*sin(p.x*2.8+n))*.95),4.)*.24;
 vec3 a=palette==1?vec3(.21,.055,.35):palette==2?vec3(.24,.095,.025):vec3(.035,.16,.22);
 vec3 b=palette==1?vec3(.015,.18,.25):palette==2?vec3(.18,.025,.055):vec3(.095,.035,.23);
 vec3 c=vec3(.003,.007,.017)+mix(a,b,smoothstep(-.6,.7,p.x))*cloud*n*.55;
 if(kind==1){vec2 grid=uv*vec2(430.*aspect,430.);vec2 cell=floor(grid);float r=hash(cell);float star=step(.996,r)*pow(max(0.,1.-length(fract(grid)-.5)*2.),5.);c+=star*mix(vec3(.27,.44,.65),vec3(.85,.7,.45),hash(cell+7.))*.6;}
 c*=1.-.45*smoothstep(.25,1.15,length(p));color=vec4(c,1.);}`;
 try{
  resources.program=gl.createProgram();
  for(const[type,source]of[[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const s=gl.createShader(type);resources.shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(resources.program,s);}
  gl.linkProgram(resources.program);if(!gl.getProgramParameter(resources.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(resources.program));resources.vao=gl.createVertexArray();
 }catch(e){dispose();$('ambience').checked=false;$('ambience').disabled=true;$('visualNote').textContent='Atmosphere unavailable. Particle simulation remains unchanged.';}
 const uniforms={};if(resources.program)for(const n of ['aspect','kind','palette'])uniforms[n]=gl.getUniformLocation(resources.program,n);
 function settings(){return{intensity:Number($('look').value),palette:Number($('palette').value),ambience:$('ambience').checked,focus:document.body.classList.contains('focus-mode')};}
 function updateLegend(){if(kind!=='galaxy')return;const colors=Number($('look').value)===1?['#ffd49a','#8fbdff']:[['#ffd49a','#8fbdff'],['#d14fff','#3ddcff'],['#ffbf47','#ff406e']][Number($('palette').value)];document.querySelector('.gold').style.color=colors[0];document.querySelector('.blue').style.color=colors[1];}
 function redraw(){document.body.dataset.look=$('look').value;updateLegend();onChange();}
 for(const id of ['look','palette','ambience'])$(id).addEventListener('change',redraw);
 $('focus').onclick=()=>{document.body.classList.toggle('focus-mode');const active=document.body.classList.contains('focus-mode');$('focus').textContent=active?'Show controls':'Focus view';$('focus').setAttribute('aria-expanded',String(!active));onChange();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('focus-mode'))$('focus').click();});
 function background(){const s=settings();if(!resources.program||!s.ambience||s.intensity===1)return;gl.useProgram(resources.program);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);gl.uniform1i(uniforms.kind,kind==='galaxy'?1:0);gl.uniform1i(uniforms.palette,s.palette);gl.bindVertexArray(resources.vao);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindVertexArray(null);}
 function dispose(){if(resources.program)gl.deleteProgram(resources.program);for(const s of resources.shaders)gl.deleteShader(s);if(resources.vao)gl.deleteVertexArray(resources.vao);resources.program=null;resources.shaders=[];resources.vao=null;}
 document.body.dataset.look=$('look').value;updateLegend();
 return {settings,background,dispose,renderer:info};
}
window.ExploreVisuals={create,reduced,rendererInfo};
})();
