/* Lottie Animations for DevMiro */

document.addEventListener('DOMContentLoaded', function() {
  // Check if Lottie is available
  if (typeof lottie === 'undefined') {
    console.log('Lottie library not loaded, skipping animations');
    return;
  }

  // Initialize animations when they come into view
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationPath = element.dataset.animation;
        
        if (animationPath && !element.classList.contains('lottie-loaded')) {
          loadLottieAnimation(element, animationPath);
          element.classList.add('lottie-loaded');
        }
        
        animationObserver.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe all elements with data-animation attribute
  document.querySelectorAll('[data-animation]').forEach(el => {
    animationObserver.observe(el);
  });

  // Load Lottie animation
  function loadLottieAnimation(element, path) {
    const animation = lottie.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: path
    });

    // Add loaded class for styling
    element.classList.add('lottie-loaded');

    // Pause on hover if specified
    if (element.dataset.hover === 'pause') {
      element.addEventListener('mouseenter', () => animation.pause());
      element.addEventListener('mouseleave', () => animation.play());
    }

    return animation;
  }

  // Initialize inline SVG animations (CSS-based)
  initSvgAnimations();
});

/* Inline SVG Path Animations */
function initSvgAnimations() {
  // Animate stroke-dasharray for line drawings
  document.querySelectorAll('.animate-draw').forEach(svg => {
    const paths = svg.querySelectorAll('path, line, circle, rect, polyline, polygon');
    
    paths.forEach(path => {
      const length = path.getTotalLength ? path.getTotalLength() : 1000;
      
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'stroke-dashoffset 2s ease-in-out';
    });

    // Trigger animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paths = svg.querySelectorAll('path, line, circle, rect, polyline, polygon');
          paths.forEach((path, i) => {
            setTimeout(() => {
              path.style.strokeDashoffset = '0';
            }, i * 100);
          });
          observer.unobserve(svg);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(svg);
  });
}

/* Icon Animations */
document.querySelectorAll('[data-animate-icons]').forEach(container => {
  const icons = container.querySelectorAll('.icon-item');
  let currentIndex = 0;

  // Auto-rotate icons
  setInterval(() => {
    icons.forEach((icon, i) => {
      icon.classList.toggle('active', i === currentIndex);
    });
    currentIndex = (currentIndex + 1) % icons.length;
  }, 2000);
});

/* Loading Animation */
class LottieLoader {
  constructor() {
    this.container = document.querySelector('.loading-screen');
    this.progress = 0;
  }

  setProgress(value) {
    this.progress = Math.min(100, Math.max(0, value));
    // Update loading bar if exists
    const progressBar = this.container?.querySelector('.loading-bar');
    if (progressBar) {
      progressBar.style.width = `${this.progress}%`;
    }
  }

  complete() {
    this.setProgress(100);
    setTimeout(() => {
      this.hide();
    }, 500);
  }

  hide() {
    if (this.container) {
      this.container.classList.add('hidden');
      setTimeout(() => {
        this.container.style.display = 'none';
      }, 500);
    }
  }
}

// Export for use
window.LottieLoader = LottieLoader;
