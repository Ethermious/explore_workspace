'use strict';const assert=require('node:assert/strict'),P=require('./physics.js');const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// Symmetric pair force conserves total linear momentum, including unequal masses.
for(const ratio of [.5,1,1.3,2]){const s=P.makeEncounter({ratio}),a=P.centerAccelerations(s);for(let k=0;k<3;k++){near(s.m[0]*a[0][k]+s.m[1]*a[1][k],0);near(s.m[0]*s.p[0][k]+s.m[1]*s.p[1][k],0);near(s.m[0]*s.v[0][k]+s.m[1]*s.v[1][k],0);}}
// Exact circular-speed formula balances radial Plummer acceleration.
for(const r of [.04,.3,1,3,10]){const v=P.circularSpeed(r,1,.6),a=P.acceleration([r,0,0],[[0,0,0],[0,0,0]],[1,0],[.6,.6]);near(v*v/r,-a[0]);}
// Seed determinism, finite stars, and render count do not alter center mass.
const s=P.makeEncounter(),first=P.stars(s,1024,35,false),second=P.stars(s,1024,35,false);assert.deepEqual(first,second);assert.ok(first.every(Number.isFinite));assert.equal(first.length,8192);assert.equal(first[3],0);assert.equal(first[512*8+3],1);
function trajectory(h){const s=P.makeEncounter(),e0=P.energy(s),L=P.angularMomentum(s);let maxE=0;for(let i=0;i<Math.round(50/h);i++){P.advance(s,h);maxE=Math.max(maxE,Math.abs(P.energy(s)-e0));}const L2=P.angularMomentum(s);for(let k=0;k<3;k++)near(L[k],L2[k],1e-10);for(let k=0;k<3;k++)near(s.m[0]*s.p[0][k]+s.m[1]*s.p[1][k],0,1e-9);return{s,maxE};}
const a=trajectory(.02),b=trajectory(.01),c=trajectory(.005),ref=trajectory(.00125);const err=s=>Math.hypot(...s.p.flat().map((v,k)=>v-ref.s.p.flat()[k]));assert.ok(err(a.s)>3*err(b.s));assert.ok(err(b.s)>3*err(c.s));assert.ok(c.maxE<1e-5);
// Reversibility of the coupled force schedule: forward centers then reverse with -h.
const original=P.makeEncounter(),state=JSON.parse(JSON.stringify(original));let p=[-4,1,0],v=[.2,.3,0],p0=p.slice(),v0=v.slice();for(let i=0;i<100;i++){const old=state.p.map(v=>v.slice());P.advance(state,.005);({p,v}=P.tracerStep(p,v,.005,old,state.p,state.m,state.scales));}for(let i=0;i<100;i++){const old=state.p.map(v=>v.slice());P.advance(state,-.005);({p,v}=P.tracerStep(p,v,-.005,old,state.p,state.m,state.scales));}for(let k=0;k<3;k++){near(p[k],p0[k],1e-10);near(v[k],v0[k],1e-10);}
// Single isolated halo orbit: sufficiently small fixed step remains close to original radius.
let pos=[1,0,0],vel=[0,P.circularSpeed(1,1,.6),0];for(let i=0;i<20000;i++)({p:pos,v:vel}=P.tracerStep(pos,vel,.005,[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]],[1,0],[.6,.6]));near(Math.hypot(...pos),1,1e-5);
console.log(JSON.stringify({passed:true,centerEnergyAbsMaxAt005:c.maxE,positionErrorRatio02to01:err(a.s)/err(b.s),positionErrorRatio01to005:err(b.s)/err(c.s),reference:'CPU double precision; does not validate GPU shader or FPS'},null,2));
