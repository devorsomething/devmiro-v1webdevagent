/* Virtual Tour / AR Preview JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initVirtualTour();
});

/**
 * Virtual Tour Configuration
 */
const virtualTourConfig = {
  scenes: [
    {
      id: 'hero',
      name: { de: 'Start', en: 'Home' },
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
      hotspots: [
        { x: 30, y: 50, label: { de: 'Hero Section', en: 'Hero Section' }, target: 'about' },
        { x: 70, y: 60, label: { de: 'Services', en: 'Services' }, target: 'services' }
      ]
    },
    {
      id: 'about',
      name: { de: 'Über uns', en: 'About Us' },
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
      hotspots: [
        { x: 50, y: 70, label: { de: 'Team', en: 'Team' }, target: 'team' }
      ]
    },
    {
      id: 'services',
      name: { de: 'Services', en: 'Services' },
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920',
      hotspots: [
        { x: 40, y: 50, label: { de: 'Webentwicklung', en: 'Web Development' }, target: 'services' }
      ]
    }
  ],
  autoRotate: false,
  rotationSpeed: 0.5
};

/**
 * Virtual Tour State
 */
let virtualTourState = {
  currentScene: 0,
  isDragging: false,
  startX: 0,
  currentX: 0
};

/**
 * Get current language
 */
function getVirtualTourLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize virtual tour
 */
function initVirtualTour() {
  const container = document.getElementById('virtual-tour');
  if (!container) return;
  
  renderVirtualTour();
  attachVirtualTourHandlers();
}

/**
 * Render virtual tour
 */
function renderVirtualTour() {
  const container = document.getElementById('virtual-tour');
  if (!container) return;
  
  const lang = getVirtualTourLang();
  const scene = virtualTourConfig.scenes[virtualTourState.currentScene];
  
  container.innerHTML = `
    <section class="virtual-tour">
      <div class="container">
        <div class="virtual-tour__container">
          <h2 class="section__title" style="text-align: center; margin-bottom: var(--space-8);">
            ${lang === 'de' ? 'Virtueller Rundgang' : 'Virtual Tour'}
          </h2>
          
          <div class="virtual-tour__viewer" id="tour-viewer">
            ${scene ? `
              <div class="virtual-tour__scene" style="background-image: url('${scene.image}')">
                ${scene.hotspots.map((hotspot, i) => `
                  <div class="virtual-tour__hotspot" style="left: ${hotspot.x}%; top: ${hotspot.y}%;" onclick="navigateToHotspot('${hotspot.target}')">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                `).join('')}
              </div>
            ` : '<p style="color: white;">Virtual tour placeholder</p>'}
          </div>
          
          <div class="virtual-tour__controls">
            <button class="virtual-tour__btn" onclick="rotateTour(-1)" aria-label="Rotate left">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
              </svg>
            </button>
            <button class="virtual-tour__btn" onclick="toggleTourAutoRotate()" aria-label="Auto rotate">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
              </svg>
            </button>
            <button class="virtual-tour__btn" onclick="rotateTour(1)" aria-label="Rotate right">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </button>
          </div>
          
          <div class="virtual-tour__nav">
            ${virtualTourConfig.scenes.map((s, i) => `
              <div class="virtual-tour__dot ${i === virtualTourState.currentScene ? 'active' : ''}" onclick="goToScene(${i})"></div>
            `).join('')}
          </div>
          
          <div style="display: flex; justify-content: center; gap: var(--space-4); margin-top: var(--space-6);">
            <button class="ar-button" onclick="openAR()">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM19 13v1.5h-1.5V13H19z"/>
              </svg>
              ${lang === 'de' ? 'AR ansehen' : 'View in AR'}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Attach virtual tour handlers
 */
function attachVirtualTourHandlers() {
  const viewer = document.getElementById('tour-viewer');
  if (!viewer) return;
  
  viewer.addEventListener('mousedown', startDrag);
  viewer.addEventListener('mousemove', drag);
  viewer.addEventListener('mouseup', endDrag);
  viewer.addEventListener('mouseleave', endDrag);
  
  viewer.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
  viewer.addEventListener('touchmove', (e) => drag(e.touches[0]));
  viewer.addEventListener('touchend', endDrag);
}

/**
 * Start dragging
 */
function startDrag(e) {
  virtualTourState.isDragging = true;
  virtualTourState.startX = e.clientX;
}

/**
 * Drag
 */
function drag(e) {
  if (!virtualTourState.isDragging) return;
  virtualTourState.currentX = e.clientX;
}

/**
 * End dragging
 */
function endDrag() {
  if (!virtualTourState.isDragging) return;
  
  const delta = virtualTourState.currentX - virtualTourState.startX;
  if (Math.abs(delta) > 50) {
    if (delta > 0) {
      rotateTour(1);
    } else {
      rotateTour(-1);
    }
  }
  
  virtualTourState.isDragging = false;
}

/**
 * Rotate tour
 */
function rotateTour(direction) {
  virtualTourState.currentScene += direction;
  if (virtualTourState.currentScene < 0) {
    virtualTourState.currentScene = virtualTourConfig.scenes.length - 1;
  }
  if (virtualTourState.currentScene >= virtualTourConfig.scenes.length) {
    virtualTourState.currentScene = 0;
  }
  renderVirtualTour();
}

/**
 * Go to scene
 */
function goToScene(index) {
  virtualTourState.currentScene = index;
  renderVirtualTour();
}

/**
 * Navigate to hotspot
 */
function navigateToHotspot(target) {
  const element = document.getElementById(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Toggle auto rotate
 */
function toggleTourAutoRotate() {
  virtualTourConfig.autoRotate = !virtualTourConfig.autoRotate;
  
  if (virtualTourConfig.autoRotate) {
    startAutoRotate();
  }
}

/**
 * Start auto rotate
 */
function startAutoRotate() {
  if (!virtualTourConfig.autoRotate) return;
  
  rotateTour(1);
  setTimeout(startAutoRotate, 3000);
}

/**
 * Open AR
 */
function openAR() {
  // Check for AR support
  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      if (supported) {
        alert('AR would open here with WebXR');
      } else {
        alert('AR not supported on this device');
      }
    });
  } else {
    alert('AR not supported in this browser');
  }
}

// Export
window.virtualTourConfig = virtualTourConfig;
window.rotateTour = rotateTour;
window.goToScene = goToScene;
window.navigateToHotspot = navigateToHotspot;
window.openAR = openAR;