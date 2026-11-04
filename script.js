// ===== Nav scroll state =====
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scrollProgress');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  // scroll progress bar
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// Close mobile menu on resize up
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ===== Hat explorer tabs =====
const tabs = document.querySelectorAll('.hat-tab');
const details = document.querySelectorAll('.hat-detail');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    details.forEach(d => d.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.hat);
    if (target) target.classList.add('active');
  });
});

// ===== Reveal on scroll (with stagger) =====
const revealEls = document.querySelectorAll('.reveal');

// Fallback: reveal everything if IntersectionObserver isn't available
function revealAll() {
  revealEls.forEach(el => el.classList.add('visible'));
}

try {
  if (!('IntersectionObserver' in window)) {
    revealAll();
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const group = entry.target.parentElement;
          if (group && group.classList.contains('journey-list')) {
            const kids = group.querySelectorAll('.journey-item');
            kids.forEach((k, i) => {
              k.classList.add('visible');
              k.style.transitionDelay = (i * 90) + 'ms';
            });
            revealObserver.unobserve(group);
            return;
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }
} catch (err) {
  // never leave content hidden — if anything goes wrong, show it all
  revealAll();
}

// ===== Hero parallax on mouse (desktop only) =====
const heroOrbs = document.getElementById('heroOrbs');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (heroOrbs && finePointer) {
  const hero = document.querySelector('.hero');
  let raf = null;
  hero.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      heroOrbs.style.transform = `translate(${dx * -14}px, ${dy * -14}px)`;
      raf = null;
    });
  });
  hero.addEventListener('mouseleave', () => {
    heroOrbs.style.transform = 'translate(0,0)';
  });
}

// ===== Respect reduced motion: skip heavy animation =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}
