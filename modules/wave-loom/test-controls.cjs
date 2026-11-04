/* Mock DOM/Canvas flow checks. Does not claim real browser pixels, touch or performance. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
function target(){return {listeners:{},addEventListener(t,f){(this.listeners[t]??=[]).push(f)},fire(t,e={}){for(const f of this.listeners[t]||[])f({preventDefault(){},...e})},classList:{remove(){}}};}
function setup({reduced=false,noCanvas=false}={}){
 const elements={},frames=new Map();let serial=0;
 for(const m of html.matchAll(/<([a-z0-9]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){
  const id=m[3],attrs=m[2],captures=new Set();
  elements[id]={...target(),value:attrs.match(/\bvalue="([^"]+)"/)?.[1]||'',checked:/\bchecked\b/.test(attrs),textContent:'',style:{},dataset:{},attributes:{},width:350,height:310,disabled:false,setAttribute(k,v){this.attributes[k]=v},getBoundingClientRect:()=>({left:0,top:0,width:350,height:310}),focus(){},setPointerCapture(id){captures.add(id)},hasPointerCapture(id){return captures.has(id)},releasePointerCapture(id){captures.delete(id);this.fire('lostpointercapture',{pointerId:id})},click(){this.onclick?.()}};
 }
 const moments=['echo','cancel','standing'].map(scene=>({...target(),dataset:{scene},attributes:{},setAttribute(k,v){this.attributes[k]=v},click(){this.onclick()}}));
 const gradient={addColorStop(){}}; const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>o[k]??(()=>{})});
 elements.loom.getContext=()=>noCanvas?null:ctx;
 const document={...target(),hidden:false,body:{dataset:{}},getElementById:id=>{assert(elements[id],`missing ${id}`);return elements[id]},querySelectorAll:q=>q==='[data-scene]'?moments:q==='button, input'?Object.values(elements):[]};
 const media={...target(),matches:reduced};
 const context={...target(),console,document,Float64Array,Math,Number,String,Map,matchMedia:()=>media,devicePixelRatio:5,requestAnimationFrame(f){const id=++serial;frames.set(id,f);return id},cancelAnimationFrame(id){frames.delete(id)}};
 context.window=context;vm.createContext(context);for(const f of ['model.js','loom.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),context,{filename:f});
 const frame=time=>{const fs=[...frames.values()];frames.clear();for(const f of fs)f(time)};
 return {elements,moments,document,media,context,frames,frame,d:()=>context.waveLoomDiagnostics()};
}
for(const reduced of [false,true]){
 const h=setup({reduced}),e=h.elements;
 assert.equal(h.d().paused,reduced);assert.equal(h.frames.size,reduced?0:1);h.frame(1000);h.frame(1032);assert.equal(h.d().time>0,!reduced);
 e.pluck.click();h.frame(2000);h.frame(2032);assert(!h.d().paused);assert(h.d().time>0);e.pause.click();const paused=h.d().time;h.frame(2064);assert.equal(h.d().time,paused);assert.equal(h.frames.size,0);assert.match(e.status.textContent,/Energy share/);assert.match(e.status.textContent,/kinetic \(motion\)/);assert.match(e.status.textContent,/potential \(stored\)/);
 e.free.click();assert.equal(h.d().boundary,'free');assert(h.d().paused);assert.equal(h.frames.size,0);e.fixed.click();assert.equal(h.d().boundary,'fixed');
 e.loom.fire('pointerdown',{pointerId:1,button:0,clientX:100,clientY:100});e.loom.fire('pointerdown',{pointerId:2,button:0,clientX:250,clientY:200});e.loom.fire('pointerdown',{pointerId:3,button:0,clientX:200,clientY:150});assert.equal(h.d().held,2);
 e.loom.fire('pointermove',{pointerId:1,clientX:300,clientY:80});assert.equal(h.d().held,2);e.loom.fire('pointercancel',{pointerId:1});assert.equal(h.d().held,1);e.loom.fire('lostpointercapture',{pointerId:2});assert.equal(h.d().held,0);
 e.loom.fire('keydown',{key:'ArrowUp'});assert.equal(h.d().held,1);e.loom.fire('keydown',{key:'ArrowRight'});e.loom.fire('keydown',{key:' '});assert.equal(h.d().held,0);e.loom.fire('keydown',{key:'ArrowDown'});e.loom.fire('blur');assert.equal(h.d().held,0);
 const beforeResume=h.d().time;e.pause.click();h.frame(3000);h.frame(3032);assert(h.d().time>beforeResume);h.document.hidden=true;h.document.fire('visibilitychange');const time=h.d().time;assert.equal(h.frames.size,0);h.frame(9000);assert.equal(h.d().time,time);h.document.hidden=false;h.document.fire('visibilitychange');h.frame(90000);assert.equal(h.d().time,time,'No catch-up on restore');
 h.context.fire('pagehide');assert.equal(h.frames.size,0);h.context.fire('pageshow');assert.equal(h.frames.size,1);
 h.moments[1].click();assert.equal(h.d().scene,'cancel');h.frame(100000);h.frame(101000);assert(h.d().time<=.051,'large wall gap capped');
 h.moments[2].click();h.moments[2].click();assert.equal(h.d().scene,'standing');assert.match(e.status.textContent,/mode 4/);assert(!e.insightText.textContent.includes('Three loops'));
 e.slow.click();assert(h.d().slow);const before=h.d().time;h.frame(200000);h.frame(200040);assert(h.d().time-before<=.011,'quarter speed');
 e.speed.value='.4';e.speed.fire('input');e.damping.value='0';e.damping.fire('input');assert.equal(e.dampingOut.textContent,'None');e.trails.checked=false;e.trails.fire('change');assert.equal(h.d().history,0);
 h.media.fire('change',{matches:true});assert(h.d().paused);assert.equal(h.frames.size,0);e.clear.click();assert.equal(h.d().energy.total,0);assert.equal(h.d().held,0);assert.equal(h.d().history,0);assert.equal(h.frames.size,0);
 assert(h.d().finite);assert(h.d().width*h.d().height<=1800000);console.log(`PASS control lifecycle, two-pointer/cancel, keyboard, hidden tabs, bfcache, timing, reduced=${reduced}`);
}
const fallback=setup({noCanvas:true});assert.equal(fallback.frames.size,0);assert(fallback.elements.pluck.disabled);assert.match(fallback.elements.status.textContent,/unavailable/);fallback.context.fire('resize');console.log('PASS no Canvas 2D fallback including resize');
const registry=fs.readFileSync(__dirname+'/../../js/projects.js','utf8'),app=fs.readFileSync(__dirname+'/../../js/app.js','utf8');assert.match(registry,/id:'waves'/);assert.match(app,/location.href='modules\/wave-loom\/index.html'/);assert.match(html,/href="\.\.\/\.\.\/index.html"/);assert(!html.includes('<iframe'));console.log('PASS standalone launcher entry and home link');
console.log('NOTE: Mock tests do not verify real layout, browser rendering, hardware touch or frame rate.');

// Terminology remains paired with an accessible explanation, including non-JS fallback copy.
assert.match(html,/transverse displacement is its signed up-and-down offset from the resting line/);assert.match(html,/kinetic <b><\/b> potential/);assert.match(html,/>Fixed<\/button>/);
const copy=fs.readFileSync(__dirname+'/loom.js','utf8');for(const term of ['phase inversion','superposition','destructive interference','normal mode','Nodes','antinodes'])assert(copy.includes(term),`missing ${term}`);console.log('PASS precise, explained wave and energy terminology');
