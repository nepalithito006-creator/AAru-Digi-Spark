const NUMBER = '9779745347914';
const wa = (msg) => `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll('.order').forEach(a => { a.href = wa(`Hi, I'd like to order ${a.dataset.p}.`); a.target = '_blank'; a.rel = 'noopener'; });
const main = document.getElementById('wa-main');
if (main) { main.href = wa("Hi, I'd like to place an order."); main.target = '_blank'; main.rel = 'noopener'; }
document.querySelectorAll('.cta').forEach(a => { a.href = wa("Hi, I'd like to place an order."); a.target = '_blank'; });
const fl = document.createElement('a');
fl.id = 'wa-float'; fl.href = wa("Hi, I have a question about your spices."); fl.target = '_blank'; fl.textContent = '💬';
fl.setAttribute('aria-label', 'Chat on WhatsApp'); document.body.appendChild(fl);
const menu = document.getElementById('menu'), links = document.getElementById('links');
menu.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Sakura petals, spice seeds, anime sparkles, click bursts */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.getElementById('spice-fx'), ctx = cv.getContext('2d');
  const PETAL = ['#ffb7d5', '#ff9cc4', '#ffd0e4', '#ffc2da'];
  const SEED = ['#f2b441', '#e0455a', '#c9955a', '#8fbf6a'];
  const GLOW = ['#fff', '#ffe08a', '#ffc2da', '#c9e0ff'];
  let W, H, parts = [], stars = [], burst = [], trail = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const petal = (y) => ({ k: Math.random() < .72 ? 'petal' : 'seed', x: rand(0, W), y: y ?? rand(-H, H), r: rand(5, 11), vy: rand(.5, 1.3), sway: rand(0, 6.28), sp: rand(.008, .022), rot: rand(0, 6.28), vr: rand(-.03, .03), a: rand(.5, .9) });
  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    parts = Array.from({ length: Math.min(45, W / 26 | 0) }, () => { const p = petal(); p.c = p.k === 'petal' ? pick(PETAL) : pick(SEED); return p; });
    stars = Array.from({ length: Math.min(36, W / 34 | 0) }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(3, 8), ph: rand(0, 6.28), sp: rand(.015, .04), c: pick(GLOW) }));
  };
  resize(); addEventListener('resize', resize);

  const star4 = (x, y, r, rot, c, a) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const ang = i * Math.PI / 2; ctx.quadraticCurveTo(0, 0, Math.cos(ang) * r, Math.sin(ang) * r); ctx.quadraticCurveTo(0, 0, Math.cos(ang + Math.PI / 4) * r * .22, Math.sin(ang + Math.PI / 4) * r * .22); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  const drawPetal = (p) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
    ctx.beginPath();
    if (p.k === 'petal') { ctx.moveTo(0, -p.r); ctx.bezierCurveTo(p.r, -p.r * .6, p.r * .8, p.r, 0, p.r); ctx.bezierCurveTo(-p.r * .8, p.r, -p.r, -p.r * .6, 0, -p.r); }
    else ctx.ellipse(0, 0, p.r * .55, p.r * .32, 0, 0, 6.28);
    ctx.fill(); ctx.restore();
  };

  addEventListener('pointerdown', e => {
    for (let i = 0; i < 18; i++) { const ang = rand(0, 6.28), s = rand(1.5, 5); burst.push({ x: e.clientX, y: e.clientY, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s, r: rand(4, 10), life: 1, rot: rand(0, 6.28), c: pick(GLOW) }); }
    for (let i = 0; i < 10; i++) { const p = petal(e.clientY); p.x = e.clientX; p.c = pick(PETAL); p.k = 'petal'; p.vy = rand(1, 2.5); burst.push({ petal: p, life: 1 }); }
  });
  let last = 0;
  addEventListener('pointermove', e => {
    const now = performance.now(); if (now - last < 45) return; last = now;
    trail.push({ x: e.clientX + rand(-6, 6), y: e.clientY + rand(-6, 6), r: rand(3, 6), life: 1, c: pick(GLOW), rot: 0 });
    const art = document.querySelector('.hero-art');
    if (art) art.style.transform = `translate(${(e.clientX / innerWidth - .5) * 24}px, ${(e.clientY / innerHeight - .5) * 16}px)`;
  }, { passive: true });

  let t = 0;
  (function tick() {
    t++; ctx.clearRect(0, 0, W, H);
    stars.forEach(s => star4(s.x, s.y, s.r * (.6 + .4 * Math.sin(t * s.sp + s.ph)), t * .004, s.c, .35 + .55 * Math.max(0, Math.sin(t * s.sp + s.ph))));
    parts.forEach(p => { p.y += p.vy; p.sway += p.sp; p.x += Math.sin(p.sway) * .9; p.rot += p.vr; if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); } drawPetal(p); });
    burst.forEach(b => {
      b.life -= .016;
      if (b.petal) { const p = b.petal; p.y += p.vy; p.x += Math.sin(p.sway += p.sp) * 1.2; p.rot += p.vr; p.a = Math.max(b.life, 0); drawPetal(p); }
      else { b.x += b.vx; b.y += b.vy; b.vx *= .97; b.vy *= .97; b.rot += .08; star4(b.x, b.y, b.r * b.life, b.rot, b.c, Math.max(b.life, 0)); }
    });
    burst = burst.filter(b => b.life > 0);
    trail.forEach(s => { s.life -= .035; star4(s.x, s.y, s.r * s.life * 1.6, t * .05, s.c, Math.max(s.life, 0)); });
    trail = trail.filter(s => s.life > 0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();
