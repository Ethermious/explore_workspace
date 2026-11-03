'use strict';const assert=require('node:assert/strict'),R=require('./reach.js'),M=require('./math.js');const maps=R.modes.map(b=>R.map(b));
assert.deepEqual(maps.map(m=>m.total),[884,884,884,884]);assert.deepEqual(maps.map(m=>m.geometric),[554,554,554,554]);assert.deepEqual(maps.map(m=>m.contained),[546,150,311,311]);
for(const m of maps){assert.equal(m.nx,26);assert.equal(m.ny,34);assert.equal(R.map(m.branch),m);assert.deepEqual(m.cells.map(c=>c.geometric),maps[0].cells.map(c=>c.geometric));for(const c of m.cells){const s=M.ik(c,m.branch);assert.equal(c.contained,!!s&&s.contained&&Math.min(...s.serial,s.parallel)>=.08&&s.condition<=20);}}
for(let iy=0;iy<34;iy++)for(let ix=0;ix<26;ix++)assert.equal(maps[2].cells[iy*26+ix].contained,maps[3].cells[iy*26+(25-ix)].contained);
assert.ok(maps[2].positive>maps[2].negative,'Alternate mode must not inherit canonical det-negative policy');
console.log('PASS reach comparison: symmetric 884-point grid; ideal masks identical; contained/regular counts 546/150/311/311; mirrored modes equal; both closure signs allowed; maps cached.');
