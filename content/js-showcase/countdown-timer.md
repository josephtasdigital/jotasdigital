---
title: Countdown Timer
description: A live countdown timer with millisecond precision.
code: |
  <html><body style="background:#0c0e13;color:#00e5ff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
  <div id="t" style="font-size:3rem"></div>
  <script>
  const end = Date.now() + 60000;
  setInterval(() => {
    const d = Math.max(0, end - Date.now());
    const s = Math.floor(d/1000), ms = d%1000;
    document.getElementById('t').textContent = s + '.' + String(ms).padStart(3,'0');
  }, 50);
  </script></body></html>
---
