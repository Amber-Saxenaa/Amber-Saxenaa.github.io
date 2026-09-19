/* Unified portfolio card interactions
   Makes Home, Experience, Projects and Education cards behave consistently.
*/
(() => {
  const details = {
    exp1: {
      type: 'Experience', icon: '◈', tag: 'NOW',
      title: "Dellish Baker's | MIS Executive",
      meta: 'Apr 2025 – Present',
      description: 'Current MIS role focused on turning operational data into reporting and dashboards that support day-to-day business decisions.',
      points: ['MIS reporting and recurring operational reporting workflows.', 'Working with Excel, dashboards and structured business data.', 'Translating raw information into clear, decision-ready reporting.']
    },
    exp2: {
      type: 'Experience', icon: '◈', tag: '2024',
      title: 'Know Finity | MIS Executive',
      meta: 'Aug 2024 – Apr 2025',
      description: 'MIS experience centered on reporting, data handling and building a stronger foundation in business analytics.',
      points: ['Prepared and worked with structured MIS reports.', 'Used spreadsheet-based analysis to organize operational data.', 'Built practical experience connecting data with business reporting.']
    },
    exp3: {
      type: 'Experience', icon: '◈', tag: '2024',
      title: 'Grow Enterprises | MIS Executive',
      meta: 'Nov 2024 – Dec 2024',
      description: 'A hands-on MIS experience that added practical exposure to reporting and operational data workflows.',
      points: ['Worked with business data and recurring reporting tasks.', 'Strengthened practical spreadsheet and MIS skills.', 'Gained additional exposure to real-world reporting requirements.']
    },
    edu1: {
      type: 'Education', icon: 'EDU', tag: 'BCA',
      title: 'Bachelor of Computer Applications (BCA)',
      meta: 'Amity University • 2025 – Present',
      description: 'Pursuing BCA alongside professional MIS and data analytics work, building on a foundation already applied in real reporting and dashboard projects.',
      points: ['Building a stronger foundation in programming and computer applications.', 'Developing skills that complement Excel, Power BI, SQL and Python work.', 'Applying academic learning through practical dashboards, reporting and analytics projects.']
    },
    edu2: {
      type: 'Education', icon: 'EDU', tag: 'XII',
      title: 'Class XII (Higher Secondary)',
      meta: 'Your School • 2022 – 2023',
      description: 'Completed higher secondary education and built the academic foundation that led into the current BCA and analytics journey.',
      points: ['Higher secondary academic foundation completed in 2022 – 2023.', 'Academic background as represented on the portfolio.', 'Built the foundation for continued learning in technology and data.']
    },
    proj1: {
      type: 'Project', icon: 'PRJ', tag: 'RET',
      title: 'Store Performance Analytics Dashboard', meta: 'Excel • Power BI',
      description: 'A dashboard project focused on turning store-level performance data into a clear view of business KPIs and trends.',
      points: ['Built around store performance and operational KPIs.', 'Uses Excel and Power BI for analysis and visualization.', 'Designed to make performance patterns easier to review and act on.']
    },
    proj2: {
      type: 'Project', icon: 'PRJ', tag: 'HR',
      title: 'HR Analytics Dashboard', meta: 'Excel • Power BI',
      description: 'An HR-focused dashboard concept for organizing people data into useful metrics and management views.',
      points: ['Uses Excel and Power BI for reporting and visualization.', 'Structures HR information into readable KPI views.', 'Designed to support quick comparison and trend review.']
    },
    proj3: {
      type: 'Project', icon: 'PRJ', tag: 'DASH',
      title: 'Interactive Sales Dashboard', meta: 'Power BI • DAX',
      description: 'An interactive sales reporting project using Power BI and DAX to turn sales data into dynamic business insights.',
      points: ['Built with Power BI and DAX.', 'Uses interactive reporting to explore sales performance.', 'Focuses on KPI visibility, comparisons and trend analysis.']
    },
    proj4: {
      type: 'Project', icon: 'PRJ', tag: 'ML',
      title: 'Prediction Model (Beginner ML)', meta: 'Python • Scikit-learn',
      description: 'A beginner machine-learning project using Python and Scikit-learn to explore predictive modeling.',
      points: ['Uses Python for data preparation and modeling.', 'Introduces a practical Scikit-learn workflow.', 'Designed as an entry point into applied machine learning.']
    },
    proj5: {
      type: 'Project', icon: 'PRJ', tag: 'TS',
      title: 'Time Series Forecasting', meta: 'Tools to be added',
      description: 'A planned project slot for a forecasting workflow using time-based data.',
      points: ['Project slot is already part of the portfolio structure.', 'Tools and final implementation can be added as the project is built.', 'Intended to demonstrate forecasting and trend analysis.']
    },
    proj6: {
      type: 'Project', icon: 'PRJ', tag: 'SEG',
      title: 'Customer Segmentation', meta: 'Tools to be added',
      description: 'A planned analytics project for grouping customers into meaningful segments based on their data.',
      points: ['Project slot is already part of the portfolio structure.', 'Tools and final implementation can be added later.', 'Intended to demonstrate customer analytics and segmentation.']
    },
    proj7: {
      type: 'Project', icon: 'PRJ', tag: 'ETL',
      title: 'Web Scraping / ETL Pipeline', meta: 'Tools to be added',
      description: 'A planned data-engineering style project for collecting, transforming and preparing data for analysis.',
      points: ['Project slot is already part of the portfolio structure.', 'Tools and final implementation can be added later.', 'Intended to demonstrate practical ETL and data preparation.']
    }
  };

  const cards = document.querySelectorAll('.carousel-card[data-exp], .carousel-card[data-proj], .carousel-card[data-edu], .timeline-center-item[data-exp], .timeline-center-item[data-proj], .edu-timeline-item[data-edu]');
  if (!cards.length) return;

  // Prevent the older generic modal from leaving a second overlay behind our unified modal.
  const closeLegacyModal = () => {
    const legacy = document.getElementById('detailModal');
    if (legacy) {
      legacy.classList.remove('open');
      legacy.setAttribute('aria-hidden', 'true');
    }
  };

  let modal = document.getElementById('portfolioDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'portfolio-detail-modal';
    modal.id = 'portfolioDetailModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="portfolio-detail-inner" role="dialog" aria-modal="true" aria-labelledby="portfolioDetailTitle">
        <button class="portfolio-detail-back" type="button" aria-label="Close details">← Back</button>
        <div class="portfolio-detail-grid">
          <div class="portfolio-detail-visual" id="portfolioDetailVisual"></div>
          <div class="portfolio-detail-copy">
            <span class="portfolio-detail-type" id="portfolioDetailType"></span>
            <h2 id="portfolioDetailTitle"></h2>
            <p class="portfolio-detail-meta" id="portfolioDetailMeta"></p>
            <p class="portfolio-detail-description" id="portfolioDetailDescription"></p>
            <ul class="portfolio-detail-list" id="portfolioDetailList"></ul>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  const back = modal.querySelector('.portfolio-detail-back');
  const visual = modal.querySelector('#portfolioDetailVisual');
  const type = modal.querySelector('#portfolioDetailType');
  const title = modal.querySelector('#portfolioDetailTitle');
  const meta = modal.querySelector('#portfolioDetailMeta');
  const desc = modal.querySelector('#portfolioDetailDescription');
  const list = modal.querySelector('#portfolioDetailList');
  let timers = [];
  let previousFocus = null;

  const stopTyping = () => { timers.forEach(clearTimeout); timers = []; };
  const typeText = (el, text, speed, delay) => {
    const token = document.createElement('span');
    const caret = document.createElement('span');
    token.className = 'portfolio-typewriter';
    caret.className = 'portfolio-caret';
    el.innerHTML = '';
    el.append(token, caret);
    let i = 0;
    const run = () => {
      token.textContent = text.slice(0, i++);
      if (i <= text.length) timers.push(setTimeout(run, speed));
      else caret.remove();
    };
    timers.push(setTimeout(run, delay));
  };

  const open = (key, card) => {
    const d = details[key];
    if (!d) return;
    closeLegacyModal();
    previousFocus = card || document.activeElement;
    stopTyping();
    type.textContent = d.type;
    visual.innerHTML = `<span class="portfolio-detail-icon">${d.icon}</span><span class="portfolio-detail-tag">${d.tag}</span>`;
    list.innerHTML = '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    typeText(title, d.title, 24, 90);
    typeText(meta, d.meta, 17, 600);
    typeText(desc, d.description, 10, 980);

    d.points.forEach((point, i) => {
      const li = document.createElement('li');
      li.textContent = point;
      li.style.opacity = '0';
      li.style.transform = 'translateY(8px)';
      list.appendChild(li);
      timers.push(setTimeout(() => {
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      }, 1450 + i * 220));
    });
    setTimeout(() => back.focus(), 80);
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopTyping();
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  };

  cards.forEach(card => {
    const key = card.dataset.exp || card.dataset.proj || card.dataset.edu;
    card.classList.add('portfolio-clickable');
    card.setAttribute('aria-label', `Open ${details[key]?.title || 'details'}`);
    card.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); open(key, card); });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        open(key, card);
      }
    });
  });

  back.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();
