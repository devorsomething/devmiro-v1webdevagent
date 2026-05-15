/* Testimonials Carousel JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  // Testimonials Data (replace with real testimonials)
  const testimonialsData = [
    {
      id: 1,
      name: 'Markus Berger',
      role: 'Geschäftsführer',
      company: 'Berger & Partner GmbH',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      quote: 'DevMiro hat unsere Online-Präsenz komplett transformiert. Die neue Website hat unsere Lead-Generierung um 150% gesteigert. Professionell, schnell und immer erreichbar.',
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: 'Sandra Hofer',
      role: 'Marketing Leiterin',
      company: 'Hofer & Kollegen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      quote: 'Die Zusammenarbeit war von Anfang an perfekt. Timo versteht genau was wir brauchen und liefert immer über den Erwartungen. Unsere Cloud-Migration war stressfrei dank seiner Expertise.',
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: 'Thomas Lingg',
      role: 'IT-Abteilungsleiter',
      company: 'Lingg Werkzeugbau',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      quote: 'Managed Services von DevMiro spart uns monatlich 20+ Stunden IT-Aufwand. Unsere Systeme laufen stabiler als je zuvor. Klare Empfehlung für jedes Unternehmen.',
      rating: 5,
      verified: true
    },
    {
      id: 4,
      name: 'Julia Feurstein',
      role: 'Inhaberin',
      company: 'Feurstein Kosmetik',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
      quote: 'Endlich eine Website die aussieht wie ich es mir vorgestellt habe! Mobile-optimiert, schnell und meine Kunden finden uns jetzt viel besser über Google.',
      rating: 5,
      verified: true
    }
  ];

  // DOM Elements
  const carousel = document.querySelector('.testimonials-carousel');
  const track = document.querySelector('.testimonials-track');
  const dotsContainer = document.querySelector('.testimonials-dots');
  const prevBtn = document.querySelector('.testimonials-nav--prev');
  const nextBtn = document.querySelector('.testimonials-nav--next');
  const autoplayToggle = document.querySelector('.testimonials-autoplay__toggle');
  const progressBar = document.querySelector('.testimonials-autoplay__progress-bar');

  // State
  let currentIndex = 0;
  let autoplayInterval = null;
  let isAutoplayActive = true;
  const autoplayDuration = 5000; // 5 seconds

  // Initialize
  function init() {
    if (!carousel) return;
    renderTestimonials();
    renderDots();
    setupEventListeners();
    startAutoplay();
  }

  // Render Testimonials
  function renderTestimonials() {
    if (!track) return;
    
    track.innerHTML = testimonialsData.map((item, index) => `
      <div class="testimonial-card" data-index="${index}">
        <div class="testimonial-card__inner">
          <div class="testimonial-card__stars">
            ${renderStars(item.rating)}
          </div>
          <blockquote class="testimonial-card__quote">
            ${item.quote}
          </blockquote>
          <div class="testimonial-card__author">
            <img src="${item.avatar}" alt="${item.name}" class="testimonial-card__avatar" loading="lazy">
            <div class="testimonial-card__info">
              <div class="testimonial-card__name">
                ${item.name}
                ${item.verified ? `
                  <span class="testimonial-card__verified">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Verifiziert
                  </span>
                ` : ''}
              </div>
              <div class="testimonial-card__role">${item.role}</div>
              <div class="testimonial-card__company">${item.company}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Stars
  function renderStars(count) {
    return Array(5).fill(0).map((_, i) => `
      <svg viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `).join('');
  }

  // Render Dots
  function renderDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = testimonialsData.map((_, index) => `
      <button class="testimonials-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Testimonial ${index + 1}"></button>
    `).join('');
  }

  // Update Active Dot
  function updateDots() {
    const dots = document.querySelectorAll('.testimonials-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Go to Slide
  function goToSlide(index) {
    currentIndex = index;
    
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    updateDots();
    
    // Reset autoplay
    if (isAutoplayActive) {
      resetAutoplay();
    }
  }

  // Next Slide
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % testimonialsData.length;
    goToSlide(nextIndex);
  }

  // Previous Slide
  function prevSlide() {
    const prevIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    goToSlide(prevIndex);
  }

  // Autoplay
  function startAutoplay() {
    if (!isAutoplayActive) return;
    
    let remainingTime = autoplayDuration;
    const intervalTime = 50;
    
    autoplayInterval = setInterval(() => {
      remainingTime -= intervalTime;
      const progress = ((autoplayDuration - remainingTime) / autoplayDuration) * 100;
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      if (remainingTime <= 0) {
        nextSlide();
        remainingTime = autoplayDuration;
        if (progressBar) {
          progressBar.style.width = '0%';
        }
      }
    }, intervalTime);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    startAutoplay();
  }

  function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    
    if (autoplayToggle) {
      autoplayToggle.classList.toggle('active', isAutoplayActive);
    }
    
    if (isAutoplayActive) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Navigation arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    // Dots
    const dots = document.querySelectorAll('.testimonials-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        goToSlide(index);
      });
    });
    
    // Autoplay toggle
    if (autoplayToggle) {
      autoplayToggle.addEventListener('click', toggleAutoplay);
    }
    
    // Pause on hover
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        if (isAutoplayActive) {
          stopAutoplay();
        }
      });
      
      carousel.addEventListener('mouseleave', () => {
        if (isAutoplayActive) {
          startAutoplay();
        }
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!carousel) return;
      
      // Only when carousel is in viewport
      const rect = carousel.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      if (isInViewport) {
        switch (e.key) {
          case 'ArrowLeft':
            prevSlide();
            break;
          case 'ArrowRight':
            nextSlide();
            break;
        }
      }
    });
    
    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        if (isAutoplayActive) {
          stopAutoplay();
        }
      }, { passive: true });
      
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        if (isAutoplayActive) {
          startAutoplay();
        }
      }, { passive: true });
    }
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  // Initialize
  init();
});