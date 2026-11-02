'use strict';
const assert=require('node:assert/strict'),D=require('../js/drawing.js'),A=require('../modules/whiteboard-arm/kinematics.js');
const p={w:1828.8,h:914.4,offset:200,mount:100,l1:650,l2:650,bayWidth:450,bayAbove:0,bayBelow:0};let count=0;
for(const branch of [-1,1])for(let x=-400;x<2100;x+=31)for(let y=-100;y<1100;y+=37){const t={x,y},r=A.ik(p,t,branch),d=Math.hypot(x+p.offset,y-p.mount);assert.equal(!!r,d<=1300);if(r){assert(Math.hypot(r.tip.x-x,r.tip.y-y)<1e-8);count++}}
for(const micro of [1,16,32])for(const name of ['robot','flower','wave']){const fit=A.fit(D.demo(name),p,90,-1,micro),plan=A.plan(p,fit,{x:914.4,y:457.2},-1,micro),park=A.park(p,plan.points.at(-1).t,-1,micro);assert(plan.points.some(v=>!v.down));assert(plan.points.some(v=>v.down));assert.equal(park.points.length,301);for(const v of [...plan.points,...park.points]){const r=A.fk(p,v.q),q=A.quantize(p,r,micro);assert(A.inEnvelope(p,r)&&A.inEnvelope(p,q));assert(r.margin>=A.MARGIN&&q.margin>=A.MARGIN);assert(Math.sin(v.q[1])<0);count++}const end=A.quantize(p,A.fk(p,park.points.at(-1).q),micro);assert(Math.max(end.base.x,end.elbow.x,end.tip.x)<=-10);}
assert.throws(()=>A.park({...p,bayWidth:50},{x:914.4,y:457.2},-1,16),/envelope|tuck/);
assert.throws(()=>A.plan(p,[[{x:1800,y:500}]],{x:914.4,y:457.2},-1,16),/Unreachable|envelope|singular/);
assert.throws(()=>A.checked(p,{x:1100,y:100},-1,16),/singular/);
assert.throws(()=>A.validate({...p,w:NaN}),/finite/);
const t=A.torque({...p,l1:1000,l2:1000},[0,0],{link1:1,link2:1,motor:1,payload:1});assert(Math.abs(t[0]-5*9.80665)<1e-9);assert(Math.abs(t[1]-1.5*9.80665)<1e-9);
console.log('PASS folding arm: '+count+' FK/IK, drawing and park poses; step-rounding branch/envelope, no-park and singularity rejection, static torque.');
