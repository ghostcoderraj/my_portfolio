(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored === 'dark');
    } else {
      setTheme(true); // default dark to match Figma kit
    }
  }

  function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(!isDark);
    });
  }

  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Placeholder: in production you'd send to a backend or service
      alert('Thanks for your message! In a live site this would be sent to the owner.');
    });
  }

  function initMouseLight() {
    const root = document.documentElement;
    function setMousePosition(e) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty('--mouse-x', x + '%');
      root.style.setProperty('--mouse-y', y + '%');
    }
    document.body.addEventListener('mousemove', setMousePosition);
    document.body.addEventListener('mouseenter', setMousePosition);
  }

  function initGitHubWorks() {
    const GITHUB_USER = 'ghostcoderraj';
    const PER_PAGE = 6;
    const grid = document.getElementById('works-grid');
    const loadWrap = document.getElementById('works-load-wrap');
    const loadBtn = document.getElementById('works-load-more');
    if (!grid) return;

    let allRepos = [];
    let shown = 0;

    function formatTitle(name) {
      return name.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function makeCard(repo) {
      const name = formatTitle(repo.name);
      const category = repo.language || 'Code';
      const url = repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : repo.html_url;
      const initial = (repo.name[0] || 'C').toUpperCase();
      const rawDesc = repo.description || '';
      const fallbackDesc = 'A ' + (category === 'Code' ? 'software' : category) + ' project. View source or demo on GitHub.';
      const descText = rawDesc.length > 0 ? rawDesc : fallbackDesc;
      const desc = descText.length > 100 ? descText.slice(0, 97).trim() + '…' : descText;
      const card = document.createElement('a');
      card.className = 'work-card';
      card.href = url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', 'View project ' + name);
      card.innerHTML =
        '<div class="work-card-image"><span class="work-card-initial">' + initial + '</span></div>' +
        '<div class="work-card-meta">' +
          '<div class="work-card-meta-row">' +
            '<h3>' + escapeHtml(name) + '</h3>' +
            '<span class="work-category">' + escapeHtml(category) + '</span>' +
            '<span class="work-link">↗</span>' +
          '</div>' +
          '<p class="work-card-desc">' + escapeHtml(desc) + '</p>' +
        '</div>';
      return card;
    }

    function escapeHtml(s) {
      const div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }
    function escapeAttr(s) {
      return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderNext() {
      const slice = allRepos.slice(shown, shown + PER_PAGE);
      slice.forEach(function (repo) {
        grid.appendChild(makeCard(repo));
      });
      shown += slice.length;
      grid.setAttribute('aria-busy', 'false');
      if (shown < allRepos.length) {
        loadWrap.style.display = 'block';
      } else {
        loadWrap.style.display = 'none';
      }
    }

    function showError() {
      grid.setAttribute('aria-busy', 'false');
      grid.innerHTML = '<p class="works-loading works-error">Could not load projects. <a href="https://github.com/' + GITHUB_USER + '?tab=repositories" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>';
    }

    fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=100')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API error');
        return res.json();
      })
      .then(function (repos) {
        allRepos = repos.filter(function (r) { return !r.fork && r.name !== GITHUB_USER; });
        if (allRepos.length === 0) {
          grid.innerHTML = '<p class="works-loading">No public repositories yet. <a href="https://github.com/' + GITHUB_USER + '?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub profile</a></p>';
          grid.setAttribute('aria-busy', 'false');
          return;
        }
        grid.innerHTML = '';
        renderNext();
      })
      .catch(function () {
        showError();
      });

    if (loadBtn && loadWrap) {
      loadBtn.addEventListener('click', function () {
        renderNext();
      });
    }
  }

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.hero-inner h1', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero-tagline', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.4 });
    gsap.from('.hero-cred', { opacity: 0, y: 15, duration: 0.7, ease: 'power3.out', delay: 0.55 });
    gsap.from('.hero-inner .btn', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.7 });

    // Sections on scroll
    gsap.utils.toArray('.animate-section').forEach(function (section) {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // Service items stagger
    gsap.from('.service-item', {
      scrollTrigger: { trigger: '#services', start: 'top 80%' },
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // Work cards stagger (run after GitHub injects cards)
    setTimeout(function () {
      gsap.from('.work-card', {
        scrollTrigger: { trigger: '#works', start: 'top 80%' },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, 1500);

    // Skill chips subtle pop
    gsap.from('.skill-chip', {
      scrollTrigger: { trigger: '#skills', start: 'top 82%' },
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.03,
      ease: 'back.out(1.2)'
    });

    // FAQ items
    gsap.from('.faq-item', {
      scrollTrigger: { trigger: '#faq', start: 'top 82%' },
      opacity: 0,
      x: -20,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });

    // Follow links
    gsap.from('.follow-link', {
      scrollTrigger: { trigger: '.section.follow', start: 'top 85%' },
      opacity: 0,
      y: 25,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out'
    });
  }

  initTheme();
  initThemeToggle();
  initNav();
  initYear();
  initForm();
  initMouseLight();
  initGitHubWorks();
  initScrollAnimations();
})();
