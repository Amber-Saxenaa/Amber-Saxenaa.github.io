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

// Animated stat counters (count up when scrolled into view)
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length && 'IntersectionObserver' in window) {
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const startTime = performance.now();
        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          el.textContent = current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statIo.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statIo.observe(el));
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

// Subtle 3D tilt on cards and thumbnails (desktop only)
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card.tilt, .tilt-el').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Detail modal — shared by Experience, Education, and Projects cards
const expData = {
  exp1: {
    tag: 'Now', title: 'MIS Executive', org: "Dellish Baker's", date: 'Apr 2025 – Present · Lucknow, UP',
    bullets: [
      'Created a dashboard reporting system pulling data from 10+ departments, reducing report delivery time by 84% and maintaining dashboard accuracy at 99.8%',
      'Built live KPI dashboards for 12 key business metrics, running monthly trend checks and problem analysis that helped managers fix issues 3x quicker',
      "Redesigned data entry forms and Sheets checklists for 10+ teams, lowering submission mistakes by 47% and eliminating a 2-day data matching delay"
    ],
    tech: ['Excel', 'Power BI', 'Google Sheets']
  },
  exp2: {
    tag: '2024', title: 'MIS Executive', org: 'Know Finity', date: 'Aug 2024 – Apr 2025 · Lucknow, UP',
    bullets: [
      'Set up a shared document system that made file finding easy across teams, cutting search time by 55% and improving inter-department response time by 30%',
      'Automated daily attendance, salary, and stock reports using Excel macros, saving 6 hours every week while keeping data accuracy steady at 98.4%',
      'Cleaned a 40,000+ row dataset by removing duplicates, blanks, and incorrect formats, resulting in a 40% reduction in data errors'
    ],
    tech: ['Excel', 'Excel Macros', 'Data Cleaning']
  },
  exp3: {
    tag: '2024', title: 'MIS Executive', org: 'Grow Enterprises', date: 'Nov 2024 – Dec 2024 · Lucknow, UP',
    bullets: [
      'Built a sales tracker combining data from 8 regional branches, cutting report generation time by 65% and enabling real-time target monitoring',
      'Conducted inventory and back-order analysis for 460 products, identifying weekly demand patterns and stocking gaps',
      'Developed interactive Excel and Power BI dashboards monitoring operational performance across 100+ retail stores'
    ],
    tech: ['Excel', 'Power BI']
  }
};

const eduData = {
  edu1: {
    tag: 'BCA', title: 'Bachelor of Computer Applications', org: 'Amity University', date: '2025 – Present',
    bullets: [
      'Currently pursuing BCA alongside professional MIS/data analytics work',
      'Add specific coursework, honors, or academic projects here as you complete them'
    ],
    tech: []
  },
  edu2: {
    tag: 'XII', title: 'Class XII, Higher Secondary', org: 'Your School Name', date: '2022 – 2023',
    bullets: [
      'Commerce / Science stream with Mathematics or Computer Science',
      'Add your percentage/grade or notable achievements here'
    ],
    tech: []
  }
};

const projData = {
  proj1: {
    tag: 'Ret', title: 'Store Performance Analytics Dashboard', org: 'Personal Project', date: 'April 2026',
    bullets: [
      'Tracked 12-month sales and order trends, identifying peak periods to improve promotion planning by 40%',
      'Analyzed channel performance, revealing Flipkart + Meesho drove 65%+ of revenue — helping focus marketing spend on top platforms',
      'Identified that women contributed 55%+ of sales, enabling targeted product curation that boosted repeat purchases by 25%'
    ],
    tech: ['Excel', 'Power BI']
  },
  proj2: {
    tag: 'HR', title: 'HR Analytics Dashboard', org: 'Personal Project', date: 'December 2025',
    bullets: [
      'Designed a centralized HR dashboard tracking 50 employees across gender, age, location, and region, giving HR heads a real-time view of workforce composition',
      'Tracked employee status and performance ratings, identifying that part-time staff (26%) and remote workers (38%) needed more engagement — leading to targeted retention initiatives'
    ],
    tech: ['Excel', 'Power BI']
  },
  proj3: {
    tag: 'Dash', title: 'Interactive Sales Dashboard', org: 'Add project details', date: 'Add date',
    bullets: ['Add your project description here'],
    tech: []
  },
  proj4: {
    tag: 'ML', title: 'Prediction Model (Beginner ML)', org: 'Add project details', date: 'Add date',
    bullets: ['Add your project description here'],
    tech: []
  },
  proj5: {
    tag: 'TS', title: 'Time Series Forecasting', org: 'Add project details', date: 'Add date',
    bullets: ['Add your project description here'],
    tech: []
  },
  proj6: {
    tag: 'Seg', title: 'Customer Segmentation', org: 'Add project details', date: 'Add date',
    bullets: ['Add your project description here'],
    tech: []
  },
  proj7: {
    tag: 'ETL', title: 'Web Scraping / ETL Pipeline', org: 'Add project details', date: 'Add date',
    bullets: ['Add your project description here'],
    tech: []
  }
};

const detailModal = document.getElementById('detailModal');
const detailContent = document.getElementById('detailContent');
const detailBack = document.getElementById('detailBack');

function openDetail(data, clickEvent) {
  if (!detailModal || !detailContent) return;

  // grow the modal outward from wherever the card was clicked
  if (clickEvent) {
    const xPct = (clickEvent.clientX / window.innerWidth) * 100;
    const yPct = (clickEvent.clientY / window.innerHeight) * 100;
    detailModal.style.setProperty('--origin-x', xPct + '%');
    detailModal.style.setProperty('--origin-y', yPct + '%');
  }

  const techHtml = data.tech && data.tech.length
    ? `<p class="detail-tech-label">Technologies Used</p><div class="chip-row small">${data.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>`
    : '';
  const thumbHtml = data.tag
    ? `<div class="detail-thumb">${data.tag}</div>`
    : '';

  detailContent.innerHTML = `
    <div class="detail-body ${thumbHtml ? '' : 'no-thumb'}">
      ${thumbHtml}
      <div>
        <h2>${data.title}</h2>
        <p class="detail-meta">${data.org} · ${data.date}</p>
        <ul class="detail-bullets">${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        ${techHtml}
      </div>
    </div>
  `;
  detailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDetail() {
  if (!detailModal) return;
  detailModal.classList.remove('open');
  document.body.style.overflow = '';
}

function wireDetailCards(selector, dataMap) {
  document.querySelectorAll(selector).forEach(card => {
    const key = card.dataset.exp || card.dataset.edu || card.dataset.proj;
    card.addEventListener('click', (e) => openDetail(dataMap[key], e));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetail(dataMap[key], null);
      }
    });
  });
}
wireDetailCards('[data-exp]', expData);
wireDetailCards('[data-edu]', eduData);
wireDetailCards('[data-proj]', projData);

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
