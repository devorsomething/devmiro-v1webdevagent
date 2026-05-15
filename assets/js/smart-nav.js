/* Smart Sticky Navigation JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initSmartNavigation();
});

function initSmartNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const progressBar = document.querySelector('.nav__progress, .scroll-progress');
  const navContainer = document.querySelector('.nav__container');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Scroll handler with requestAnimationFrame
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (currentScrollY / docHeight) * 100;
    
    // Update scroll progress bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }
    
    // Hide/Show on scroll direction
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        nav.classList.add('scroll-down');
        nav.classList.remove('scroll-up');
      } else {
        // Scrolling up
        nav.classList.add('scroll-up');
        nav.classList.remove('scroll-down');
      }
    } else {
      nav.classList.remove('scroll-down', 'scroll-up');
    }
    
    // Compact mode when scrolled
    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // Active section highlighting
    updateActiveSection();
    
    lastScrollY = currentScrollY;
  }

  function updateActiveSection() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const targetPosition = target.offsetTop - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  });

  // Theme toggle
  const themeToggle = document.querySelector('.nav__theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Initial call
  handleScroll();
}

// Theme toggle function
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load saved theme
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Initialize theme
loadSavedTheme();

// Export for use
window.toggleTheme = toggleTheme;
window.initSmartNavigation = initSmartNavigation;