'use strict';
const assert=require('node:assert/strict');const {solve}=require('../js/kinematics.js');let tested=0;
for(const base of [40,100,200])for(const upper of [50,100,180])for(const lower of [60,140,200])for(const branch of [[1,-1],[-1,1],[1,1],[-1,-1]])for(let x=-250;x<=250;x+=25)for(let y=-50;y<=300;y+=25){
 const p={base,upper,lower},t={x,y},s=solve(p,t,branch);const ds=[Math.hypot(x+base/2,y),Math.hypot(x-base/2,y)];const expected=ds.every(d=>d>1e-8&&d<=upper+lower+1e-8&&d>=Math.abs(upper-lower)-1e-8);assert.equal(!!s,expected);
 if(s){for(const [a,b,l]of[[s.A,s.L,upper],[s.B,s.R,upper],[s.L,s.T,lower],[s.R,s.T,lower]])assert.ok(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-l)<1e-6);assert.ok(s.margin>=0&&s.margin<=1+1e-10);assert.ok(s.residual<1e-6)}tested++;
}
assert.equal(solve({base:100,upper:100,lower:140},{x:NaN,y:160}),null);assert.equal(solve({base:-1,upper:100,lower:140},{x:0,y:160}),null);
const s=solve({base:100,upper:100,lower:140},{x:0,y:160});assert.ok(s);assert.ok(Math.abs(s.L.x+s.R.x)<1e-8);assert.ok(Math.abs(s.L.y-s.R.y)<1e-8);assert.equal(s.collision,false);
console.log('PASS',tested,'geometry cases; link lengths, reachability, branches, symmetry and input guards');
