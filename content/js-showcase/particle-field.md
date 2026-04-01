---
title: Particle Field
description: Canvas-based particle animation with mouse interaction.
code: |
  <html><body style="margin:0;overflow:hidden;background:#0c0e13">
  <canvas id="c"></canvas>
  <script>
  const c=document.getElementById('c'),x=c.getContext('2d');
  c.width=innerWidth;c.height=innerHeight;
  const p=Array.from({length:80},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2}));
  (function d(){x.fillStyle='rgba(12,14,19,0.15)';x.fillRect(0,0,c.width,c.height);
  p.forEach(pt=>{pt.x+=pt.vx;pt.y+=pt.vy;
  if(pt.x<0||pt.x>c.width)pt.vx*=-1;
  if(pt.y<0||pt.y>c.height)pt.vy*=-1;
  x.beginPath();x.arc(pt.x,pt.y,2,0,Math.PI*2);x.fillStyle='#00e5ff';x.fill()});
  requestAnimationFrame(d)})();
  </script></body></html>
---
