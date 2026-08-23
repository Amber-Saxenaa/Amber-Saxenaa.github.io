// Preloader — smooth fade out once page has loaded
const preloader = document.getElementById('preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hide');
    }, 2000);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

// Scroll progress bar
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (progress) progress.style.width = scrolled + '%';
}, { passive: true });

// Cursor glow (desktop only)
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// Scroll-triggered reveal animations
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .from-left, .from-right');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Skill bar fill animation (only on skills page)
const skillBars = document.querySelectorAll('.skill-bar');
if (skillBars.length && 'IntersectionObserver' in window) {
  const skillIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.dataset.level || 0;
        const fill = bar.querySelector('.skill-bar-fill');
        const pct = bar.querySelector('.skill-pct');
        requestAnimationFrame(() => {
          if (fill) fill.style.width = level + '%';
        });
        if (pct) pct.textContent = level + '%';
        skillIo.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillIo.observe(bar));
}

// Subtle 3D tilt on project cards (desktop only)
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Carousel arrow scrolling (home page previews)
document.querySelectorAll('.carousel-arrow').forEach(btn => {
  btn.addEventListener('click', () => {
    const trackId = btn.dataset.target;
    const track = document.getElementById(trackId);
    if (!track) return;
    const scrollAmount = track.clientWidth * 0.8;
    track.scrollBy({
      left: btn.classList.contains('next') ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  });
});

// Contact form placeholder handler (no backend wired yet)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('This form is not connected to anything yet.\nSee the setup guide to wire it to Formspree, or replace it with a simple mailto link.');
  });
}
