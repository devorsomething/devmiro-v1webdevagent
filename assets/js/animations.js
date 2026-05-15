/* Advanced Animations JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAnimations();
});

/**
 * Animation Configuration
 */
const animationConfig = {
  // Scroll reveal threshold
  threshold: 0.1,
  
  // Animation timing
  timing: {
    fade: 600,
    slide: 600,
    scale: 600
  },
  
  // Enable/disable features
  features: {
    scrollReveal: true,
    parallax: true,
    magneticButtons: true,
    cursorTrail: false,
    typewriter: true,
    stagger: true
  }
};

/**
 * Initialize all animations
 */
function initAnimations() {
  // Initialize scroll reveal
  if (animationConfig.features.scrollReveal) {
    initScrollReveal();
  }
  
  // Initialize parallax
  if (animationConfig.features.parallax) {
    initParallax();
  }
  
  // Initialize magnetic buttons
  if (animationConfig.features.magneticButtons) {
    initMagneticButtons();
  }
  
  // Initialize typewriter
  if (animationConfig.features.typewriter) {
    initTypewriter();
  }
  
  // Initialize stagger animations
  if (animationConfig.features.stagger) {
    initStagger();
  }
  
  // Initialize page transitions
  initPageTransitions();
  
  // Initialize morphing shapes
  initMorphing();
  
  // Initialize intersection observer
  initIntersectionObserver();
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: animationConfig.threshold,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(el => observer.observe(el));
}

/**
 * Parallax Effect
 */
function initParallax() {
  const parallaxContainers = document.querySelectorAll('.parallax-container');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercent = scrollY / (docHeight - windowHeight);
    
    // Update CSS variable for parallax
    document.documentElement.style.setProperty('--scroll-percent', scrollPercent);
    
    // Apply parallax transforms
    parallaxContainers.forEach(container => {
      const bg = container.querySelector('.parallax-bg');
      if (bg) {
        const speed = bg.dataset.speed || 0.5;
        const offset = scrollY * speed;
        bg.style.transform = `translateY(${offset}px)`;
      }
    });
  });
}

/**
 * Magnetic Button Effect
 */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const maxMove = 10;
      const moveX = (x / rect.width) * maxMove * 2;
      const moveY = (y / rect.height) * maxMove * 2;
      
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/**
 * Typewriter Effect
 */
function initTypewriter() {
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  
  typewriterElements.forEach(el => {
    const text = el.dataset.typewriter;
    const speed = parseInt(el.dataset.speed) || 50;
    const delay = parseInt(el.dataset.delay) || 0;
    
    setTimeout(() => {
      el.textContent = '';
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      };
      
      type();
    }, delay);
  });
}

/**
 * Stagger Animation for Grid Items
 */
function initStagger() {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
          child.classList.add('active');
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  staggerContainers.forEach(el => observer.observe(el));
}

/**
 * Page Transitions
 */
function initPageTransitions() {
  const links = document.querySelectorAll('a[href^="http"], a[href^="/"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // Skip for same-page anchors
      if (link.getAttribute('href').startsWith('#')) return;
      
      // Add exit class
      document.body.classList.add('page-transition-exit-active');
      
      // Let transition play
      setTimeout(() => {
        document.body.classList.remove('page-transition-exit-active');
      }, 200);
    });
  });
}

/**
 * Morphing Shapes
 */
function initMorphing() {
  const morphElements = document.querySelectorAll('.morph');
  
  morphElements.forEach(el => {
    // Morph is handled by CSS animation
    // This function can add interaction if needed
  });
}

/**
 * Intersection Observer for Generic Animations
 */
function initIntersectionObserver() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: animationConfig.threshold
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth Scroll Animation
 */
function smoothScrollTo(target, duration = 500) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  const targetPosition = targetElement.getBoundingClientRect().top;
  const startPosition = window.scrollY;
  const startTime = performance.now();
  
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const ease = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startPosition + targetPosition * ease);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

/**
 * Animate Number Counter
 */
function animateNumber(element, target, duration = 2000, prefix = '', suffix = '') {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const current = Math.floor(start + (target - start) * ease);
    element.textContent = prefix + current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Animate Progress Bar
 */
function animateProgressBar(element, targetPercent, duration = 1000) {
  element.style.width = '0%';
  
  setTimeout(() => {
    element.style.transition = `width ${duration}ms ease`;
    element.style.width = targetPercent + '%';
  }, 100);
}

/**
 * Sequence Animation
 */
function sequenceAnimation(elements, options = {}) {
  const {
    duration = 500,
    delay = 100,
    easing = 'ease-out'
  } = options;
  
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `all ${duration}ms ${easing}`;
    
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay * index);
  });
}

/**
 * Particle Effect (Simple)
 */
function createParticle(x, y, color = '#3B82F6') {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 8px;
    height: 8px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(particle);
  
  // Animate
  const angle = Math.random() * Math.PI * 2;
  const velocity = 100 + Math.random() * 100;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  
  let opacity = 1;
  let posX = x;
  let posY = y;
  
  function animate() {
    posX += vx * 0.016;
    posY += vy * 0.016;
    opacity -= 0.02;
    
    particle.style.left = posX + 'px';
    particle.style.top = posY + 'px';
    particle.style.opacity = opacity;
    
    if (opacity > 0) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Ripple Effect for Buttons
 */
function createRipple(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    left: ${x}px;
    top: ${y}px;
    width: 100px;
    height: 100px;
    margin-left: -50px;
    margin-top: -50px;
    pointer-events: none;
  `;
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export for global use
window.animationConfig = animationConfig;
window.smoothScrollTo = smoothScrollTo;
window.animateNumber = animateNumber;
window.animateProgressBar = animateProgressBar;
window.sequenceAnimation = sequenceAnimation;
window.createParticle = createParticle;
window.createRipple = createRipple;