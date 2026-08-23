// Preloader — only show once per visit (session), not on every internal page click
const preloader = document.getElementById('preloader');
if (preloader) {
  const alreadyShown = sessionStorage.getItem('as_preloader_shown');
  if (alreadyShown) {
    preloader.classList.add('hide');
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hide');
        sessionStorage.setItem('as_preloader_shown', 'true');
      }, 2000);
    });
  }
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

// Experience detail modal
const expData = {
  exp1: {
    title: 'Data Analytics Intern',
    org: 'Company / Organization Name',
    date: '2025 – Present',
    bullets: [
      'Cleaned and validated raw datasets before analysis',
      'Built recurring reports used by the team',
      'Assisted with dashboard maintenance in Power BI'
    ],
    tech: ['Excel', 'SQL', 'Power BI']
  },
  exp2: {
    title: 'Freelance / College Project Work',
    org: 'Self-directed',
    date: '2024',
    bullets: [
      'Describe the problem you solved here',
      'Describe the approach or tools you used',
      'Describe the outcome, ideally with a number'
    ],
    tech: ['Python', 'Pandas']
  },
  exp3: {
    title: 'Seeking My First Data Analytics Opportunity',
    org: '—',
    date: '2023 – 2024',
    bullets: [
      'Open to internships and entry-level roles in data analytics',
      'Currently strengthening SQL, Python, and Power BI skills',
      'Portfolio projects available on the Projects page'
    ],
    tech: []
  }
};

const detailModal = document.getElementById('detailModal');
const detailContent = document.getElementById('detailContent');
const detailBack = document.getElementById('detailBack');

function openDetail(data) {
  if (!detailModal || !detailContent) return;
  const techHtml = data.tech.length
    ? `<p class="detail-tech-label">Technologies Used</p><div class="chip-row small">${data.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>`
    : '';
  detailContent.innerHTML = `
    <h2>${data.title}</h2>
    <p class="detail-meta">${data.org} · ${data.date}</p>
    <ul class="detail-bullets">${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    ${techHtml}
  `;
  detailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDetail() {
  if (!detailModal) return;
  detailModal.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-exp]').forEach(card => {
  card.addEventListener('click', () => openDetail(expData[card.dataset.exp]));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(expData[card.dataset.exp]);
    }
  });
});
if (detailBack) detailBack.addEventListener('click', closeDetail);
if (detailModal) {
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetail();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDetail();
});

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
