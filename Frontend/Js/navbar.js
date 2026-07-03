document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.getElementById('navActions');
  const langSwitcher = document.querySelector('.lang-switcher');
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langLabel = document.getElementById('langLabel');

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    navActions.classList.toggle('open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navActions.classList.remove('open');
      document.body.classList.remove('nav-open');

      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Language dropdown toggle
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSwitcher.classList.toggle('open');
  });

  // Select language
  langDropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      langLabel.textContent = item.dataset.lang;
      langSwitcher.classList.remove('open');
      // Hook your i18n logic here, e.g.:
      // setAppLanguage(item.dataset.lang);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langSwitcher.contains(e.target)) {
      langSwitcher.classList.remove('open');
    }
  });

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navActions.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
});