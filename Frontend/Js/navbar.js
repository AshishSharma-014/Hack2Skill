document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('navbar-placeholder');

  if (placeholder) {
    try {
      const response = await fetch('navbar.html');
      placeholder.innerHTML = await response.text();
    } catch (error) {
      placeholder.innerHTML = '<nav class="navbar"><div class="nav-container"><a class="logo" href="index.html"><span class="logo-text">Jan<span class="logo-accent">Awaaz</span></span></a></div></nav>';
    }
  }

  initNavbar();
});

function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.getElementById('navActions');
  const langSwitcher = document.querySelector('.lang-switcher');
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langLabel = document.getElementById('langLabel');

  if (!hamburger || !navLinks || !navActions) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    navActions.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    navActions.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  if (langBtn && langSwitcher && langDropdown && langLabel) {
    langBtn.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = langSwitcher.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(isOpen));
    });

    langDropdown.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        langLabel.textContent = item.dataset.lang;
        langSwitcher.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
        localStorage.setItem('janawaaz-lang', item.dataset.lang);
      });
    });

    langLabel.textContent = localStorage.getItem('janawaaz-lang') || 'EN';

    document.addEventListener('click', event => {
      if (!langSwitcher.contains(event.target)) {
        langSwitcher.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}
