/* WebGL / 3D Elements JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initWebGL();
});

/**
 * WebGL / 3D Configuration
 */
const webglConfig = {
  enableParticles: true,
  enableTiltCards: true,
  enable3DGallery: true,
  particleCount: 50,
  particleColor: 'rgba(59, 130, 246, 0.6)'
};

/**
 * Initialize WebGL features
 */
function initWebGL() {
  // Initialize 3D tilt cards
  if (webglConfig.enableTiltCards) {
    initTiltCards();
  }
  
  // Initialize 3D gallery
  if (webglConfig.enable3DGallery) {
    init3DGallery();
  }
  
  // Initialize particle background
  if (webglConfig.enableParticles && new URLSearchParams(window.location.search).has('particles')) {
    initParticleBackground();
  }
  
  // Initialize 3D sphere
  init3DSphere();
}

/**
 * 3D Tilt Card Effect
 */
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Update shine effect
      const shine = card.querySelector('.tilt-card__shine');
      if (shine) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.3) 0%, transparent 50%)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

/**
 * 3D Gallery Effect
 */
function init3DGallery() {
  const gallery = document.querySelector('.gallery-3d');
  if (!gallery) return;
  
  const items = gallery.querySelectorAll('.gallery-3d__item');
  
  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 15;
      const rotateX = ((centerY - y) / centerY) * 10;
      
      item.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });
}

/**
 * Particle Background
 */
function initParticleBackground() {
  const container = document.createElement('div');
  container.className = 'particle-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  `;
  
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width: 100%; height: 100%;';
  container.appendChild(canvas);
  
  // Insert before body content
  document.body.insertBefore(container, document.body.firstChild);
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  
  // Create particles
  for (let i = 0; i < webglConfig.particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = webglConfig.particleColor.replace('0.6', p.opacity.toString());
      ctx.fill();
      
      // Connect nearby particles
      particles.forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = webglConfig.particleColor.replace('0.6', (0.2 * (1 - dist / 100)).toString());
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/**
 * 3D Sphere Animation
 */
function init3DSphere() {
  const sphere = document.querySelector('.sphere-3d');
  if (!sphere) return;
  
  // 3D sphere is handled by CSS, but can add interaction here
  sphere.addEventListener('mouseenter', () => {
    sphere.style.animationDuration = '3s';
  });
  
  sphere.addEventListener('mouseleave', () => {
    sphere.style.animationDuration = '10s';
  });
}

/**
 * Create 3D Floating Element
 */
function createFloating3DElement(x, y, size = 50) {
  const element = document.createElement('div');
  element.className = 'float-3d';
  element.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    border-radius: ${size / 4}px;
    pointer-events: none;
    opacity: 0.3;
    transform-style: preserve-3d;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  `;
  
  document.body.appendChild(element);
  
  // Add float animation
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.5 + Math.random() * 0.5;
  let posX = x;
  let posY = y;
  let anglePos = Math.random() * Math.PI * 2;
  
  function animate() {
    anglePos += 0.02 * speed;
    posX += Math.cos(anglePos) * speed;
    posY += Math.sin(anglePos) * speed;
    
    element.style.left = posX + 'px';
    element.style.top = posY + 'px';
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Remove after 10 seconds
  setTimeout(() => element.remove(), 10000);
}

/**
 * 3D Text Reveal
 */
function revealText3D(element, delay = 0) {
  const text = element.textContent;
  element.textContent = '';
  element.style.perspective = '500px';
  
  setTimeout(() => {
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = `
        display: inline-block;
        transform-style: preserve-3d;
        animation: textReveal3D 0.5s ease forwards;
        animation-delay: ${i * 0.05}s;
        opacity: 0;
      `;
      element.appendChild(span);
    });
  }, delay);
  
  // Add keyframes
  if (!document.getElementById('text-reveal-3d-style')) {
    const style = document.createElement('style');
    style.id = 'text-reveal-3d-style';
    style.textContent = `
      @keyframes textReveal3D {
        0% {
          opacity: 0;
          transform: translateZ(-50px) rotateX(90deg);
        }
        100% {
          opacity: 1;
          transform: translateZ(0) rotateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Parallax 3D Background
 */
function initParallax3D() {
  const sections = document.querySelectorAll('[data-parallax-3d]');
  
  sections.forEach(section => {
    const depth = parseFloat(section.dataset.parallax3d) || 0.5;
    
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const windowCenterY = window.innerHeight / 2;
      const offset = (centerY - windowCenterY) * depth;
      
      section.style.transform = `translateZ(${offset}px)`;
    });
  });
}

// Export for global use
window.webglConfig = webglConfig;
window.createFloating3DElement = createFloating3DElement;
window.revealText3D = revealText3D;
window.initParallax3D = initParallax3D;