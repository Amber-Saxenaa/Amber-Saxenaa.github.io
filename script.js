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

// Peeking robot (home page only) — reacts to which section is in view, and to clicks
const peekingRobot = document.getElementById('peekingRobot');
if (peekingRobot) {
  const robotSections = [
    { id: 'about', state: 'about' },
    { id: 'experience', state: 'experience' },
    { id: 'education', state: 'education' },
    { id: 'projects', state: 'projects' }
  ];
  function updateRobotState() {
    const centerY = window.innerHeight / 2;
    let activeState = '';
    for (const s of robotSections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= centerY && rect.bottom >= centerY) {
        activeState = s.state;
        break;
      }
    }
    if (peekingRobot.dataset.state !== activeState) {
      peekingRobot.dataset.state = activeState;
    }

    // travel down the page with scroll, same as the 3D cube on other pages
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    const viewportH = window.innerHeight;
    const topPx = 100 + scrolled * (viewportH - 260);
    peekingRobot.style.top = topPx + 'px';
  }
  window.addEventListener('scroll', updateRobotState, { passive: true });
  updateRobotState();

  // click (or Enter/Space) to wave and say hi
  const robotSpeech = document.getElementById('robotSpeech');
  function robotSayHi() {
    peekingRobot.classList.remove('waving');
    void peekingRobot.offsetWidth; // restart animation
    peekingRobot.classList.add('waving');
    if (robotSpeech) {
      robotSpeech.classList.remove('show');
      void robotSpeech.offsetWidth;
      robotSpeech.classList.add('show');
    }
  }
  peekingRobot.addEventListener('click', robotSayHi);
  peekingRobot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      robotSayHi();
    }
  });
}

// 3D scroll companion cube — travels down the page with scroll, drifts, and rotates
const companionCube = document.getElementById('companionCube');
const companionWrap = document.getElementById('scrollCompanion');
if (companionCube && companionWrap) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    const t = scrolled * Math.PI * 8;

    // travel from near the top to near the bottom of the viewport as the page scrolls
    const viewportH = window.innerHeight;
    const topPx = 90 + scrolled * (viewportH - 220);
    companionWrap.style.top = topPx + 'px';

    // small organic side-to-side drift layered on top
    const offsetX = Math.sin(t) * 26;
    const offsetY = Math.cos(t * 1.4) * 12;
    companionWrap.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    const rotateY = 30 + scrolled * 360 * 2;
    const rotateX = -20 + Math.sin(t) * 15;
    companionCube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, { passive: true });
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
        // give the 3D companion a little reaction whenever new content reveals
        const cube = document.getElementById('companionCube');
        if (cube) {
          cube.classList.remove('wobble');
          void cube.offsetWidth; // restart animation
          cube.classList.add('wobble');
        }
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
let lastCardEl = null; // the whole card that was clicked, used to morph the box to/from it

function openDetail(data, clickEvent, originCardEl) {
  if (!detailModal || !detailContent) return;

  lastCardEl = originCardEl || null;
  const modalInner = detailModal.querySelector('.detail-modal-inner');

  const techHtml = data.tech && data.tech.length
    ? `<p class="detail-tech-label">Technologies Used</p><div class="chip-row small tech-fade">${data.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>`
    : '';
  const thumbHtml = data.tag
    ? `<div class="detail-thumb" tabindex="0" role="button" aria-label="View larger image">${data.tag}</div>`
    : '';

  detailContent.innerHTML = `
    <div class="detail-body ${thumbHtml ? '' : 'no-thumb'}">
      ${thumbHtml}
      <div>
        <h2>${data.title}</h2>
        <p class="detail-meta">${data.org} · ${data.date}</p>
        <ul class="detail-bullets" id="detailBullets">${data.bullets.map(b => `<li></li>`).join('')}</ul>
        ${techHtml}
      </div>
    </div>
  `;

  // store the real bullet text so we can type it out, without breaking on quotes/HTML
  const bulletEls = detailContent.querySelectorAll('#detailBullets li');
  const bulletTexts = data.bullets;

  // morph the box outward from the clicked card's exact position/size
  if (lastCardEl && modalInner) {
    const fromRect = lastCardEl.getBoundingClientRect();
    const toRect = modalInner.getBoundingClientRect();
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const deltaX = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const deltaY = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    modalInner.style.transition = 'none';
    modalInner.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    modalInner.style.opacity = '0';
    modalInner.style.filter = 'blur(6px)';
    void modalInner.offsetWidth; // force reflow so the "from" state actually paints
  }

  detailModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    if (modalInner) {
      modalInner.style.transition = 'transform .5s cubic-bezier(.2,.85,.25,1), filter .4s ease, opacity .3s ease';
      modalInner.style.transform = 'translate(0,0) scale(1,1)';
      modalInner.style.opacity = '1';
      modalInner.style.filter = 'blur(0px)';
    }
  });

  // type the bullet points out sequentially, once the box has mostly finished opening
  setTimeout(() => typeBullets(bulletEls, bulletTexts, 0), 260);
}

function typeBullets(bulletEls, texts, index) {
  if (index >= bulletEls.length) {
    // reveal the tech chips as a block once all bullets are done
    const chips = detailContent.querySelector('.tech-fade');
    if (chips) chips.classList.add('show');
    return;
  }
  const li = bulletEls[index];
  const text = texts[index];
  let i = 0;
  function typeChar() {
    li.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) {
      setTimeout(typeChar, 12);
    } else {
      setTimeout(() => typeBullets(bulletEls, texts, index + 1), 120);
    }
  }
  typeChar();
}

function closeDetail() {
  if (!detailModal) return;
  const modalInner = detailModal.querySelector('.detail-modal-inner');

  // morph the box back down to the card it came from
  if (lastCardEl && modalInner) {
    const originRect = lastCardEl.getBoundingClientRect();
    const currentRect = modalInner.getBoundingClientRect();
    const scaleX = originRect.width / currentRect.width;
    const scaleY = originRect.height / currentRect.height;
    const deltaX = originRect.left + originRect.width / 2 - (currentRect.left + currentRect.width / 2);
    const deltaY = originRect.top + originRect.height / 2 - (currentRect.top + currentRect.height / 2);
    modalInner.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1), filter .3s ease, opacity .3s ease';
    modalInner.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    modalInner.style.opacity = '0';
    modalInner.style.filter = 'blur(6px)';
  }

  detailModal.classList.remove('open');
  document.body.style.overflow = '';

  setTimeout(() => {
    if (modalInner) {
      modalInner.style.transition = '';
      modalInner.style.transform = '';
      modalInner.style.opacity = '';
      modalInner.style.filter = '';
    }
    lastCardEl = null;
  }, 380);
}

function wireDetailCards(selector, dataMap) {
  document.querySelectorAll(selector).forEach(card => {
    const key = card.dataset.exp || card.dataset.edu || card.dataset.proj;

    // tactile press feedback
    const press = () => card.classList.add('card-pressed');
    const release = () => card.classList.remove('card-pressed');
    card.addEventListener('mousedown', press);
    card.addEventListener('touchstart', press, { passive: true });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => card.addEventListener(ev, release));

    function open(e) {
      card.classList.add('click-ring');
      setTimeout(() => card.classList.remove('click-ring'), 500);
      openDetail(dataMap[key], e, card);
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(null);
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
  if (e.key === 'Escape') {
    closeDetail();
    closeLightbox();
  }
});

// image lightbox — click the thumbnail inside an open box to see it larger
const imageLightbox = document.getElementById('imageLightbox');
const lightboxInner = document.getElementById('lightboxInner');
function openLightbox(thumbEl) {
  if (!imageLightbox || !lightboxInner || !thumbEl) return;
  lightboxInner.innerHTML = thumbEl.innerHTML;
  const bg = window.getComputedStyle(thumbEl).backgroundImage;
  lightboxInner.style.backgroundImage = bg && bg !== 'none' ? bg : '';
  imageLightbox.classList.add('open');
}
function closeLightbox() {
  if (!imageLightbox) return;
  imageLightbox.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const thumb = e.target.closest('.detail-thumb');
  if (thumb) {
    e.stopPropagation();
    openLightbox(thumb);
  }
});
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList.contains('detail-thumb')) {
    e.preventDefault();
    openLightbox(document.activeElement);
  }
});
if (imageLightbox) {
  imageLightbox.addEventListener('click', closeLightbox);
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
