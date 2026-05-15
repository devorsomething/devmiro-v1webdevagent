/* Before/After Image Slider JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initBeforeAfterSliders();
});

function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after');
  
  sliders.forEach(slider => {
    initSlider(slider);
  });
}

function initSlider(slider) {
  const container = slider.querySelector('.before-after__container');
  if (!container) return;

  const beforeImage = slider.querySelector('.before-after__image--before');
  const afterImage = slider.querySelector('.before-after__image--after');
  const handle = slider.querySelector('.before-after__handle');
  
  if (!beforeImage || !afterImage || !handle) return;

  let isDragging = false;
  let isTouchDevice = 'ontouchstart' in window;

  // Set initial position (50%)
  setHandlePosition(50);

  // Mouse events
  handle.addEventListener('mousedown', startDrag);
  container.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  handle.addEventListener('touchstart', startDrag, { passive: false });
  container.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Keyboard events
  slider.addEventListener('keydown', handleKeyboard);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    slider.classList.add('dragging');
    updatePosition(e);
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e);
  }

  function endDrag() {
    isDragging = false;
    slider.classList.remove('dragging');
  }

  function updatePosition(e) {
    const rect = container.getBoundingClientRect();
    let clientX;

    if (e.type.startsWith('touch')) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    let x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));

    setHandlePosition(percentage);
  }

  function setHandlePosition(percentage) {
    // Update handle position
    handle.style.left = `${percentage}%`;

    // Update before image clip
    beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;

    // Update percentage display
    const percentageDisplay = slider.querySelector('.before-after__percentage');
    if (percentageDisplay) {
      percentageDisplay.textContent = `${Math.round(percentage)}%`;
    }
  }

  function handleKeyboard(e) {
    const currentLeft = parseFloat(handle.style.left) || 50;
    let newPosition = currentLeft;

    switch(e.key) {
      case 'ArrowLeft':
        newPosition = Math.max(0, currentLeft - 5);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newPosition = Math.min(100, currentLeft + 5);
        e.preventDefault();
        break;
      case 'Home':
        newPosition = 0;
        e.preventDefault();
        break;
      case 'End':
        newPosition = 100;
        e.preventDefault();
        break;
    }

    if (newPosition !== currentLeft) {
      setHandlePosition(newPosition);
    }
  }

  // Pause autoplay on hover (if any)
  slider.addEventListener('mouseenter', () => {
    if (slider.dataset.autoplay === 'true') {
      slider.dataset.paused = 'true';
    }
  });

  slider.addEventListener('mouseleave', () => {
    if (slider.dataset.autoplay === 'true') {
      slider.dataset.paused = 'false';
    }
  });
}

// Export for use
window.initBeforeAfterSliders = initBeforeAfterSliders;