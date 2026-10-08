// ---------- sticky nav blur ----------
const nav = document.getElementById('nav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 24);
}, {passive:true});

// ---------- mobile menu ----------
const burger = document.getElementById('hamburger');
const mmenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  const open = mmenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mmenu.classList.remove('open');
  burger.setAttribute('aria-expanded','false');
}));

// ---------- product tabs ----------
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ---------- reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- pipeline progressive lighting ----------
const psteps = [...document.querySelectorAll('.pstep')];
const pio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    pio.unobserve(e.target);
    let i = 0;
    const tick = () => { if (i < psteps.length) { psteps[i++].classList.add('lit'); setTimeout(tick, 260); } };
    tick();
  });
}, {threshold:.25});
if (psteps.length) pio.observe(psteps[0]);

// ---------- AI studio processing animation ----------
const procSteps = [...document.querySelectorAll('#proc .proc-step')];
const ready = document.getElementById('campaign-ready');
let studioPlayed = false;
const sio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || studioPlayed) return;
    studioPlayed = true;
    sio.disconnect();
    let i = 0;
    const next = () => {
      if (i > 0) { procSteps[i-1].classList.add('done'); }
      if (i < procSteps.length) {
        procSteps[i].classList.add('on');
        i++;
        setTimeout(next, 1100);
      } else {
        procSteps[procSteps.length-1].classList.add('done');
        ready.classList.add('show');
      }
    };
    next();
  });
}, {threshold:.35});
const procBox = document.getElementById('proc');
if (procBox) sio.observe(procBox);

// ---------- keyboard: close mobile menu on Escape ----------
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    mmenu.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  }
});
