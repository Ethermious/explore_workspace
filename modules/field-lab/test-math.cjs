// CPU reference check of the shader's RK2 formulas, not the production integrator.
const assert=require('node:assert/strict');
function f(p,s,a){const[x,y,z]=p;if(s===0)return[10*(y-x),x*(a-z)-y,x*y-8/3*z];if(s===1)return[Math.sin(y)-a*x,Math.sin(z)-a*y,Math.sin(x)-a*z];return[(z-.7)*x-3.5*y,3.5*x+(z-.7)*y,.6+a*z-z*z*z/3-(x*x+y*y)*(1+.25*z)+.1*z*x*x*x];}
function step(p,s,a,dt){const k=f(p,s,a),mid=p.map((v,i)=>v+dt*.5*k[i]),k2=f(mid,s,a);return p.map((v,i)=>v+dt*k2[i]);}
let cases=0,resets=0;
for(const [s,parameters]of [[0,[18,28,40]],[1,[.12,.208,.3]],[2,[.3,.7,.85]]])for(const a of parameters)for(let seed=1;seed<=20;seed++){let p=s===0?[seed-10,seed/2,seed*2]:s===1?[seed/7-1,seed/8-1,seed/9-1]:[seed/20-.5,seed/22-.5,seed/15];for(let i=0;i<4000;i++){p=step(p,s,a,s===0?.016:.048);if(!p.every(Number.isFinite)||Math.hypot(...p)>150){p=[.3,.1,.1];resets++;}assert(p.every(Number.isFinite));cases++;}}
assert.deepEqual(f([0,0,0],0,28),[0,0,0]);assert.deepEqual(f([0,0,0],1,.208),[0,0,0]);console.log(JSON.stringify({passed:true,referenceSteps:cases,guardResets:resets,note:'CPU formula stability checks; not a GPU shader compilation or hardware benchmark.'}));
