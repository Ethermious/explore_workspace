'use strict';
importScripts('model.js');
let current=0;
onmessage=({data})=>{if(data.type==='cancel'){current++;return;}const token=++current,{id,config,width,height}=data;let y=0;const started=performance.now();function chunk(){if(token!==current)return;const rows=Math.min(6,height-y);const pixels=FractalMath.renderRows(config,width,height,y,rows);postMessage({id,y,rows,width,pixels},[pixels.buffer]);y+=rows;if(y<height)setTimeout(chunk,0);else postMessage({id,done:true,ms:performance.now()-started});}chunk();};
