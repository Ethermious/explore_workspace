'use strict';
const assert=require('node:assert/strict');require('../js/kinematics.js');const D=require('../js/drawing.js');
const p={base:100,upper:100,lower:140},b=[1,-1],start={x:0,y:160};let cases=0;
for(const name of ['robot','flower','infinity'])for(const micro of [1,8,16,32]){const strokes=D.fit(D.demo(name),80,0,150),plan=D.buildPlan(p,strokes,start,b,micro);assert(plan.length>0);assert(plan.drawLength>0);assert(plan.upLength>0);assert(plan.points.every(t=>D.check(p,t,b,micro).ok));for(const pt of plan.points){const m=D.motor(p,pt,b,micro);assert(m.steps.every(Number.isInteger));assert(m.error<3);for(const a of m.angles)assert(Math.abs(a/(2*Math.PI/(400*micro))-Math.round(a/(2*Math.PI/(400*micro))))<1e-9);const s=FiveBar.solve(p,m.tip,b);assert(s.residual<1e-8);cases++}for(let k=0;k<=100;k++){const t=D.sample(plan,plan.length*k/100);assert(D.check(p,t,b,micro).ok)}}
const separated=[[{x:-30,y:130},{x:-30,y:170}],[{x:30,y:170},{x:30,y:130}]],plan=D.buildPlan(p,separated,start,b);assert(plan.points.some(t=>!t.down&&t.x>0&&t.x<30));assert.equal(plan.drawLength,80);
const park=D.findPark(p,start,b,16);assert(park);assert(park.point.y>=45&&park.point.y<=100);assert(park.plan.points.every(t=>!t.down));assert.throws(()=>D.buildPlan(p,[],start,b,16,{x:0,y:20}),/singular|margin|branch/);
assert.throws(()=>D.buildPlan(p,[[{x:0,y:150},{x:500,y:150}]],start,b),/Unreachable|cross|singular/);
assert.throws(()=>D.buildPlan(p,separated,start,[-1,1]),/cross/);
assert.throws(()=>D.buildPlan(p,[[{x:NaN,y:0},{x:1,y:1}]],start,b),/./);
assert.deepEqual(D.transform('translate(10 20) scale(2)'),[2,0,0,2,10,20]);assert.deepEqual(D.apply(D.transform('translate(10 20) scale(2)'),{x:3,y:4}),{x:16,y:28});
assert.throws(()=>D.transform('scale(NaN)'),/Non-finite/);assert.throws(()=>D.transform('oops(1)'),/Unsupported/);assert.throws(()=>D.pathCheck('M0 0 L1'),/Incomplete/);assert.throws(()=>D.pathCheck('M0 0 A10 10 0 3 0 2 2'),/flags/);assert.throws(()=>D.pathCheck('M0 0 LInfinity 2'),/./);assert.throws(()=>D.pathCheck('L0 0'),/begin/);
D.pathCheck('M1e-2,-2 L5 6 C1 2 3 4 5 6 Q4 5 6 7 A10 10 0 1 0 20 30 Z');
const ordered=D.reorder(separated,{x:30,y:130});assert.equal(ordered[0][0].x,30);assert.equal(ordered[0][0].y,130);assert.deepEqual(separated[1][0],{x:30,y:170});
console.log('PASS drawing: '+cases+' quantized poses; disconnected strokes; park transit; malformed paths/transforms; route reversal. Browser SVG import tested separately.');

const boundary=D.buildPlan(p,[[{x:-150,y:-1},{x:-150,y:0}]],{x:-150,y:-1},b,16);for(let i=1;i<boundary.points.length;i++)assert(boundary.points[i].steps.every((v,j)=>Math.abs(v-boundary.points[i-1].steps[j])<100));console.log('PASS continuous motor counts across principal-angle boundary');
