'use strict';
const assert = require('node:assert/strict');
const { StringModel, DT } = require('./model.js');
const max = ys => Math.max(...Array.from(ys, Math.abs));
const advance = (m, seconds, holds) => { for (let i = 0; i < Math.round(seconds / DT); i++) m.step(holds); };
const near = (actual, expected, tol, label) => assert(Math.abs(actual - expected) <= tol, `${label}: ${actual} vs ${expected}`);
let steps = 0;
for (const count of [17, 129, 257]) for (const boundary of ['fixed', 'free']) for (const speed of [.08, .22, .4]) {
  const m = new StringModel({ count, boundary, speed, damping: 0 }); m.standing(3);
  const e0 = m.energy().total;
  for (let i = 0; i < 4800; i++) { m.step(); steps++; }
  assert([...m.y, ...m.v].every(Number.isFinite));
  assert(Math.abs(m.energy().total / e0 - 1) < .00005, 'Smooth eigenmode conserves energy');
  assert(speed * DT / m.dx <= .214, 'CFL remains bounded');
  if (boundary === 'fixed') assert.equal(Math.abs(m.y[0]) + Math.abs(m.y[count - 1]), 0);
}
console.log(`PASS stability, endpoint constraints and energy across ${steps} fixed steps`);
for (const boundary of ['fixed', 'free']) {
  const m = new StringModel({ boundary, speed:.3, damping:0 }); m.pulse(.3,.5,1,.07);
  advance(m, 4); // x=.3 + .3*4 =1.5 → reflected peak at .5.
  near(m.y[64], boundary === 'fixed' ? -.5 : .5, .012, `${boundary} reflection sign`);
  console.log(`PASS ${boundary} reflection: center displacement ${m.y[64].toFixed(6)}`);
}
{
 const m = new StringModel({speed:.22,damping:0}); m.pulse(.22,.46,1,.065);m.pulse(.78,-.46,-1,.065); const initial=m.energy().total;
 advance(m,.28/.22);
 assert(max(m.y)<.008,'Opposite pulses cancel displacement');assert(m.energy().kinetic/m.energy().total>.999,'Cancellation retains motion energy');near(m.energy().total/initial,1,.001,'Total energy at cancellation');
 advance(m,.7);assert(max(m.y)>.4,'Pulses reappear after overlap');console.log('PASS transient cancellation retains energy and pulses continue');
}
{
 const m = new StringModel({damping:.3});m.pulse();const e=m.energy().total;advance(m,10);assert(m.energy().total<e*.1,'Damping removes energy');
 m.clear(); assert.equal(m.energy().total,0);assert.equal(m.time,0);advance(m,.1);assert.equal(m.energy().total,0);
 m.step([{index:31,y:.7},{index:91,y:-.5}]);assert.equal(m.y[31],.7);assert.equal(m.y[91],-.5);assert.equal(m.v[31],0);advance(m,.5);assert(m.energy().total>0);assert([...m.y,...m.v].every(Number.isFinite));
 console.log('PASS damping, clear, two held points and release');
}
{
 const a=new StringModel({damping:0}),b=new StringModel({damping:0}),both=new StringModel({damping:0});a.pulse(.3,.4,1);b.pulse(.7,-.3,-1);both.pulse(.3,.4,1);both.pulse(.7,-.3,-1);
 advance(a,2);advance(b,2);advance(both,2);for(let i=0;i<a.count;i++)near(a.y[i]+b.y[i],both.y[i],1e-12,'Linear superposition');console.log('PASS linear superposition');
}
for(const args of [{count:1},{count:258},{count:32.5},{speed:NaN},{speed:1},{damping:-1},{boundary:'unknown'}])assert.throws(()=>new StringModel(args),RangeError);
console.log('PASS parameter guards');
