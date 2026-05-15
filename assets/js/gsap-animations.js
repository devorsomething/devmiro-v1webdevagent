/* GSAP Advanced Animations with ScrollTrigger */

document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if GSAP is available
  if (typeof gsap === 'undefined') {
    console.log('GSAP not loaded, skipping animations');
    return;
  }

  initGSAPAnimations();
});

async function initGSAPAnimations() {
  // Load GSAP plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Apply all animations immediately for reduced motion
    document.querySelectorAll('.gsap-fade, .gsap-stagger > *, .text-reveal, .hover-lift').forEach(el => {
      el.classList.add('animated');
    });
    return;
  }

  // Hero Section Animations
  animateHero();

  // Service Cards
  animateServiceCards();

  // Stats Counter
  animateStats();

  // Scroll-triggered sections
  animateScrollSections();

  // Parallax Effects
  initParallax();

  // Magnetic Buttons
  initMagneticButtons();

  // Text Split Animations
  initTextAnimations();

  // Horizontal Scroll (if present)
  initHorizontalScroll();
}

/**
 * Hero Section Animations
 */
function animateHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Badge
  tl.from('.hero__badge, .hero-badge', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2
  });

  // Title (character by character or line by line)
  tl.from('.hero__title, .hero-title, .hero h1', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.4
  }, '-=0.4');

  // Subtitle
  tl.from('.hero__subtitle, .hero-subtitle, .hero p', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.6
  }, '-=0.6');

  // CTA Buttons
  tl.from('.hero__cta, .hero-cta, .hero .btn', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.8
  }, '-=0.4');

  // Hero Image (if exists)
  tl.from('.hero__image, .hero-image, .hero img', {
    scale: 1.1,
    opacity: 0,
    duration: 1.2,
    delay: 0.3
  }, '-=1');

  // Background Elements
  tl.from('.hero__background, .hero-bg', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    delay: 0.1
  }, '-=1.2');
}

/**
 * Service Cards Animation
 */
function animateServiceCards() {
  const cards = document.querySelectorAll('.service-card, .card');
  
  if (cards.length === 0) return;

  gsap.from(cards, {
    scrollTrigger: {
      trigger: cards[0].parentElement,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });
}

/**
 * Stats Counter Animation
 */
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat__number, .stat-value, [data-counter]');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.counter || stat.textContent.replace(/\D/g, '')) || 0;
    const suffix = stat.dataset.suffix || '';
    const prefix = stat.dataset.prefix || '';
    
    gsap.from(stat, {
      scrollTrigger: {
        trigger: stat,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      textContent: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        const current = Math.round(gsap.getProperty(stat, 'textContent'));
        stat.textContent = prefix + current + suffix;
      }
    });
  });
}

/**
 * Scroll-triggered Section Animations
 */
function animateScrollSections() {
  // Generic fade-in elements
  const fadeElements = document.querySelectorAll('.section, .features, .faq, .testimonials, .portfolio, .pricing');
  
  fadeElements.forEach(el => {
    if (el.classList.contains('hero')) return; // Skip hero

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Text reveal animations
  const textReveals = document.querySelectorAll('.text-reveal');
  textReveals.forEach(el => {
    const inner = el.querySelector('.text-reveal__inner') || el;
    
    gsap.from(inner, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: '100%',
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Stagger animations
  const staggerContainers = document.querySelectorAll('.gsap-stagger, .grid, .services-grid, .testimonials-grid');
  staggerContainers.forEach(container => {
    const children = container.children;
    
    gsap.from(children, {
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    });
  });
}

/**
 * Parallax Effects
 */
function initParallax() {
  // Background parallax
  const parallaxBgs = document.querySelectorAll('.parallax-bg, [data-parallax]');
  
  parallaxBgs.forEach(bg => {
    gsap.to(bg, {
      scrollTrigger: {
        trigger: bg.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: 100,
      ease: 'none'
    });
  });

  // Floating elements
  const floatingElements = document.querySelectorAll('.floating, [data-float]');
  
  floatingElements.forEach(el => {
    const speed = parseFloat(el.dataset.float || 0.5);
    
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -50 * speed,
      ease: 'none'
    });
  });

  // Hero parallax
  const heroBg = document.querySelector('.hero__background, .hero-bg, .hero-image');
  if (heroBg) {
    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 200,
      ease: 'none'
    });
  }
}

/**
 * Magnetic Button Effect
 */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn, [data-magnetic]');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

/**
 * Text Animations
 */
function initTextAnimations() {
  // Split text into characters
  const splitTexts = document.querySelectorAll('[data-split="chars"], .split-chars');
  
  splitTexts.forEach(el => {
    const text = el.textContent;
    const chars = text.split('').map(char => 
      char === ' ' ? ' ' : `<span class="char">${char}</span>`
    ).join('');
    
    el.innerHTML = chars;
    
    gsap.from(el.querySelectorAll('.char'), {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      rotateX: -40,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  });

  // Gradient text animation
  const gradientTexts = document.querySelectorAll('.gradient-animate, [data-gradient]');
  gradientTexts.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power2.out'
    });
  });
}

/**
 * Horizontal Scroll Section
 */
function initHorizontalScroll() {
  const horizontalSections = document.querySelectorAll('.horizontal-scroll');
  
  horizontalSections.forEach(section => {
    const panels = section.children;
    
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${section.offsetWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });
  });
}

/**
 * Lottie Integration (if available)
 */
function initLottieAnimations() {
  if (typeof lottie === 'undefined') return;

  const lottieElements = document.querySelectorAll('[data-lottie]');
  
  lottieElements.forEach(el => {
    const animationPath = el.dataset.lottie;
    
    lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath
    });
  });
}

// Initialize Lottie when DOM is ready
document.addEventListener('DOMContentLoaded', initLottieAnimations);

// Export for global use
window.initGSAPAnimations = initGSAPAnimations;