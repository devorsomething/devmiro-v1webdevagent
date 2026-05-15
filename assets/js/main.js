/* DevMiro - Enhanced Interactions & Features */

document.addEventListener('DOMContentLoaded', function() {
  // ============ Loading Screen ============
  const loader = document.querySelector('.loader');
  
  if (loader) {
    // Hide loader after page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('page-transition');
      }, 800);
    });
    
    // Fallback: hide loader after max 3 seconds
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.classList.add('page-transition');
      }
    }, 3000);
  }

  // ============ Navigation Scroll Effect ============
  const nav = document.querySelector('.nav');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
    
    // Scroll indicator
    if (scrollIndicator) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.width = scrollPercent + '%';
    }
  }, 16));

  // ============ Mobile Menu Toggle ============
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      const isOpen = navLinks.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ============ Scroll Animations ============
  const animateElements = document.querySelectorAll('.animate-on-scroll, .service-card, .pricing-card, .card, .process-step');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 50);
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(el => {
    animateOnScroll.observe(el);
  });

  // ============ FAQ Accordion ============
  const faqItems = document.querySelectorAll('.faq__item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ============ Back to Top Button ============
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, 100));
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ Smooth Scroll for Anchor Links ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============ Button Ripple Effect ============
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(40);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ============ Card Tilt Effect ============
  document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', debounce((e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }, 10));
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============ Form Validation ============
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        const value = input.value.trim();
        const isEmail = input.type === 'email';
        
        // Reset styles
        input.style.borderColor = '';
        
        if (!value) {
          isValid = false;
          input.style.borderColor = '#EF4444';
        } else if (isEmail && !isValidEmail(value)) {
          isValid = false;
          input.style.borderColor = '#F59E0B';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        // Shake animation for invalid form
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => form.style.animation = '', 500);
      }
    });
    
    // Real-time validation feedback
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.style.borderColor = '#EF4444';
        } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
          this.style.borderColor = '#F59E0B';
        } else {
          this.style.borderColor = '';
        }
      });
    });
  });

  // ============ Cookie Consent ============
  const cookieConsent = document.querySelector('.cookie-consent');
  
  if (cookieConsent) {
    // Check if already accepted
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieConsent.classList.add('visible');
      }, 2000);
    }
    
    const acceptBtn = cookieConsent.querySelector('.cookie-consent__accept');
    const settingsBtn = cookieConsent.querySelector('.cookie-consent__settings');
    
    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.classList.remove('visible');
    });
    
    settingsBtn?.addEventListener('click', () => {
      // Open privacy settings modal or link to datenschutz page
      window.location.href = 'datenschutz.html';
    });
  }

  // ============ Parallax Effect for Hero ============
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const heroBackground = hero.querySelector('.hero__background');
        if (heroBackground) {
          heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }
    }, 16));
  }

  // ============ Active Nav Link Highlight ============
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link:not(.nav__cta)');
  
  window.addEventListener('scroll', throttle(() => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinksAll.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active');
      }
    });
  }, 100));

  // ============ Page Transitions for Links ============
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip external links, anchors, and special links
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
        return;
      }
      
      e.preventDefault();
      document.body.classList.add('page-transition-out');
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  // ============ Service Card Icon Animation ============
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.service-card__icon');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(-5deg)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.service-card__icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
  });

  // ============ Hover Effects for Footer Links ============
  document.querySelectorAll('.footer__links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.paddingLeft = '1rem';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.paddingLeft = '';
    });
  });

  // ============ Input Focus Effects ============
  document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement?.classList.remove('focused');
    });
  });

  // ============ Counter Animation ============
  const counters = document.querySelectorAll('.counter');
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));

  // ============ Lazy Loading for Images ============
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));

  // ============ Keyboard Navigation ============
  document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
      const navLinks = document.querySelector('.nav__links');
      const navToggle = document.querySelector('.nav__toggle');
      
      if (navLinks?.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
      
      // Close any open FAQ items
      document.querySelectorAll('.faq__item.active').forEach(item => {
        item.classList.remove('active');
      });
    }
  });

  // ============ Accessibility: Skip to Content ============
  const skipLink = document.querySelector('.skip-to-content');
  
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('main')?.focus();
    });
  }

  // ============ Shake Animation for Forms ============
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ============ Initialize Scroll Indicator ============
  if (scrollIndicator) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollIndicator.style.width = scrollPercent + '%';
  }

  // ============ Mobile Sticky CTA ============
  const mobileStickyCta = document.querySelector('.mobile-sticky-cta');
  const heroSection = document.querySelector('.hero');
  
  if (mobileStickyCta && heroSection) {
    const heroHeight = heroSection.offsetHeight;
    
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > heroHeight) {
        mobileStickyCta.classList.add('visible');
      } else {
        mobileStickyCta.classList.remove('visible');
      }
    }, 100));
  }

  // ============ WhatsApp Button Click Tracking ============
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      // Track click event (for analytics)
      console.log('WhatsApp button clicked');
    });
  }
});

// ============ Utility Functions ============

function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
  return phoneRegex.test(phone);
}