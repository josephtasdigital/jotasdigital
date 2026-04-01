---
title: Matrix Rain
description: Classic matrix-style falling characters effect.
code: |
  <html><body style="margin:0;overflow:hidden;background:#0c0e13">
  <canvas id="c"></canvas>
  <script>
  const c=document.getElementById('c'),x=c.getContext('2d');
  c.width=innerWidth;c.height=innerHeight;
  const cols=Math.floor(c.width/14),drops=Array(cols).fill(1);
  setInterval(()=>{x.fillStyle='rgba(12,14,19,0.05)';x.fillRect(0,0,c.width,c.height);
  x.fillStyle='#00e5ff';x.font='14px monospace';
  drops.forEach((y,i)=>{const t=String.fromCharCode(0x30A0+Math.random()*96);
  x.fillText(t,i*14,y*14);drops[i]=y*14>c.height&&Math.random()>.975?0:y+1})},33);
  </script></body></html>
---
