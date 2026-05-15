/* Final Polish & Premium Enhancements JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPremiumPolish();
});

/**
 * Premium Polish Configuration
 */
const premiumConfig = {
  enableCursorEffects: true,
  enableShimmerLoading: true,
  enablePageTransitions: true,
  enableMorphBackground: true,
  enableRippleEffects: true,
  enableParallax: false, // Disabled for performance
  enablePrintStyles: true
};

/**
 * Initialize premium polish
 */
function initPremiumPolish() {
  // Create page transition element
  if (premiumConfig.enablePageTransitions) {
    createPageTransition();
  }
  
  // Initialize cursor effects
  if (premiumConfig.enableCursorEffects && window.matchMedia('(pointer: fine)').matches) {
    initCursorEffects();
  }
  
  // Initialize shimmer loading
  if (premiumConfig.enableShimmerLoading) {
    initShimmerEffects();
  }
  
  // Initialize ripple effects
  if (premiumConfig.enableRippleEffects) {
    initRippleEffects();
  }
  
  // Add noise texture
  if (premiumConfig.enableMorphBackground) {
    initNoiseTexture();
  }
  
  // Add smooth scroll behavior
  initSmoothScroll();
  
  // Initialize loading skeletons
  initLoadingSkeletons();
  
  // Premium hover effects
  initPremiumHoverEffects();
  
  // Floating elements
  initFloatingElements();
  
  // Print mode handler
  if (premiumConfig.enablePrintStyles) {
    initPrintMode();
  }
}

/**
 * Create page transition
 */
function createPageTransition() {
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.id = 'page-transition';
  document.body.appendChild(transition);
}

/**
 * Show page transition
 */
function showPageTransition() {
  const transition = document.getElementById('page-transition');
  if (transition) {
    transition.classList.add('active');
  }
}

/**
 * Hide page transition
 */
function hidePageTransition() {
  const transition = document.getElementById('page-transition');
  if (transition) {
    setTimeout(() => {
      transition.classList.remove('active');
    }, 300);
  }
}

/**
 * Initialize cursor effects
 */
function initCursorEffects() {
  // Create cursor elements
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.id = 'cursor-dot';
  
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.id = 'cursor-ring';
  
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  
  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate cursor
  function animateCursor() {
    // Smooth dot movement
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    
    // Smooth ring movement (slower)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    const dotEl = document.getElementById('cursor-dot');
    const ringEl = document.getElementById('cursor-ring');
    
    if (dotEl) {
      dotEl.style.left = dotX - 4 + 'px';
      dotEl.style.top = dotY - 4 + 'px';
    }
    
    if (ringEl) {
      ringEl.style.left = ringX - 20 + 'px';
      ringEl.style.top = ringY - 20 + 'px';
    }
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Hover effects on interactive elements
  const interactive = 'a, button, input, select, textarea, [role="button"], .clickable';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => {
      const ringEl = document.getElementById('cursor-ring');
      if (ringEl) {
        ringEl.style.transform = 'scale(1.5)';
        ringEl.style.borderColor = 'var(--color-primary)';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      const ringEl = document.getElementById('cursor-ring');
      if (ringEl) {
        ringEl.style.transform = 'scale(1)';
        ringEl.style.borderColor = 'var(--color-primary)';
      }
    });
  });
}

/**
 * Initialize shimmer effects
 */
function initShimmerEffects() {
  // Add shimmer class to loading elements
  const shimmerElements = document.querySelectorAll('.loading, [data-loading]');
  shimmerElements.forEach(el => {
    el.classList.add('shimmer');
  });
}

/**
 * Initialize ripple effects
 */
function initRippleEffects() {
  // Add ripple to buttons
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .ripple');
    if (!target || target.closest('.no-ripple')) return;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    
    target.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
}

/**
 * Initialize noise texture
 */
function initNoiseTexture() {
  const containers = document.querySelectorAll('.noise, .hero, .gradient-bg');
  containers.forEach(container => {
    container.classList.add('noise');
  });
  
  // Add morph background
  const hero = document.querySelector('.hero');
  if (hero) {
    const morph = document.createElement('div');
    morph.className = 'morph-bg';
    morph.innerHTML = `
      <div class="morph-blob" style="width: 60%; height: 60%; top: -20%; right: -20%;"></div>
      <div class="morph-blob" style="width: 50%; height: 50%; bottom: -20%; left: -20%; animation-delay: -5s;"></div>
    `;
    hero.appendChild(morph);
  }
}

/**
 * Initialize smooth scroll
 */
function initSmoothScroll() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Update URL hash smoothly
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = section.id;
      }
    });
    
    if (currentSection && history.pushState) {
      history.replaceState(null, '', '#' + currentSection);
    }
  });
}

/**
 * Initialize loading skeletons
 */
function initLoadingSkeletons() {
  // Create skeleton elements for async content
  const placeholders = document.querySelectorAll('[data-skeleton]');
  placeholders.forEach(el => {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.style.height = el.offsetHeight + 'px';
    el.appendChild(skeleton);
  });
  
  // Observe skeleton elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const content = target.getAttribute('data-skeleton-content');
        
        if (content) {
          // Replace with actual content
          target.innerHTML = content;
          target.classList.remove('skeleton');
          observer.unobserve(target);
        }
      }
    });
  }, { rootMargin: '100px' });
  
  placeholders.forEach(el => observer.observe(el));
}

/**
 * Initialize premium hover effects
 */
function initPremiumHoverEffects() {
  const cards = document.querySelectorAll('.card, .service-card, .portfolio-item');
  cards.forEach(card => {
    card.classList.add('premium-card');
  });
  
  // Parallax on card hover
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Initialize floating elements
 */
function initFloatingElements() {
  const floats = document.querySelectorAll('.float, [data-float]');
  floats.forEach(el => {
    el.classList.add('float');
  });
  
  // Stagger floating animations
  floats.forEach((el, i) => {
    el.style.animationDelay = (i * 0.2) + 's';
  });
}

/**
 * Initialize print mode
 */
function initPrintMode() {
  // Add print button to page
  const printBtn = document.createElement('button');
  printBtn.className = 'no-print';
  printBtn.innerHTML = '🖨️';
  printBtn.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    transition: transform 0.2s ease;
  `;
  
  printBtn.addEventListener('click', () => window.print());
  printBtn.addEventListener('mouseenter', () => printBtn.style.transform = 'scale(1.1)');
  printBtn.addEventListener('mouseleave', () => printBtn.style.transform = '');
  
  document.body.appendChild(printBtn);
}

/**
 * Animate numbers
 */
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const value = Math.floor(progress * (target - start));
    element.textContent = value.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Add glow effect
 */
function addGlow(element, duration = 2000) {
  element.classList.add('glow');
  setTimeout(() => element.classList.remove('glow'), duration);
}

/**
 * Create typing effect
 */
function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

/**
 * Page visible animation trigger
 */
function initScrollAnimations() {
  const animated = document.querySelectorAll('.animate-on-scroll, [data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animated.forEach(el => observer.observe(el));
}

// Initialize scroll animations
setTimeout(initScrollAnimations, 1000);

// Export for global use
window.premiumConfig = premiumConfig;
window.showPageTransition = showPageTransition;
window.hidePageTransition = hidePageTransition;
window.animateNumber = animateNumber;
window.addGlow = addGlow;
window.typeText = typeText;