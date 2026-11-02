'use strict';
const assert=require('node:assert/strict'),D=require('../js/drawing.js'),A=require('../modules/whiteboard-arm/kinematics.js');
const p={w:1828.8,h:914.4,base:292.608,mount:10,l1:694.944,l2:841.248,trayWidth:1828.8,trayHeight:100,parkHeight:90,linkWidth:10};let count=0;
for(const micro of [1,2,4,8,16,32]){
 const dock=A.dock(p,micro);for(const v of dock.points){const pose=A.fk(p,v.q),q=A.quantize(p,pose,micro);assert(!pose.collision&&!q.collision);assert.equal(v.down,false);assert(A.inEnvelope(p,pose));for(const n of A.nodes(pose)){assert(n.x>=5&&n.x<=p.w-5);assert(n.y>=5&&n.y<=95)}count++}
 const rest=A.fk(p,dock.points.at(-1).q);for(const n of A.nodes(rest))assert(Math.abs(n.y-p.mount)<1e-8);assert.deepEqual(dock.points.at(-1).steps,[200*micro,0]);assert.throws(()=>A.checked(p,rest.tip,1,micro),/singular/);
 for(const name of ['robot','flower','wave']){const fitted=A.fit(D.demo(name),p,90,1,micro),draw=A.plan(p,fitted,dock.points[0].t,1,micro),park=A.park(p,draw.points.at(-1).t,1,micro);assert(draw.points.some(v=>v.down));assert(draw.points.some(v=>!v.down));for(const v of [...draw.points,...park.points]){const r=A.fk(p,v.q);assert(A.inEnvelope(p,r));assert(!r.collision);if(!v.phase)assert(r.margin>=A.MARGIN-1e-9);else assert(!v.down);count++}
 // End-to-start replay closure, no singular IK shortcut.
 assert(Math.hypot(A.fk(p,park.points.at(-1).q).tip.x-rest.tip.x,A.fk(p,park.points.at(-1).q).tip.y-rest.tip.y)<1e-8);
 }
}
for(const bad of [{trayWidth:100},{trayHeight:20},{l2:800},{l2:900},{mount:0},{parkHeight:11},{linkWidth:30}])assert.throws(()=>A.dock({...p,...bad},16));
assert.throws(()=>A.validate({...p,w:NaN}),/finite/);assert.throws(()=>A.plan(p,[[{x:0,y:914.4}]],{x:p.w/2,y:90},1,16));
const resized={...p,w:2000,h:1000};A.dock(resized,16);assert.equal(resized.l1,p.l1);assert.equal(resized.l2,p.l2);
console.log('PASS tray five-bar: '+count+' poses; all microstep settings, 3 drawings, exact horizontal supported rest, replay closure, invalid tray/geometry and guarded singularity rejection.');
