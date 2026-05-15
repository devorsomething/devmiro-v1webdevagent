/* Portfolio JavaScript - Gallery with Lightbox */

document.addEventListener('DOMContentLoaded', function() {
  // Portfolio Data (replace with real projects)
  const portfolioData = [
    {
      id: 1,
      title: 'Hotel Alpenblick',
      category: 'website',
      description: 'Moderne Website für ein 4-Sterne Hotel in Lech am Arlberg mit Online-Buchungssystem.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      link: '#'
    },
    {
      id: 2,
      title: 'MTL Metallverarbeitung',
      category: 'website',
      description: 'Corporate Website für einen Zulieferer in der Automobilindustrie.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      link: '#'
    },
    {
      id: 3,
      title: 'Wälder Getränke',
      category: 'webapp',
      description: 'B2B Portal für Bestellungen und Liefermanagement.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      link: '#'
    },
    {
      id: 4,
      title: 'Kreativagentur Visuelle',
      category: 'branding',
      description: 'Komplettes Branding inkl. Logo, Farbkonzept und Printmaterialien.',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
      link: '#'
    },
    {
      id: 5,
      title: 'Physiopraxis Feldkirch',
      category: 'website',
      description: 'Landing Page mit Terminbuchungs-Funktion für Physiotherapie-Praxis.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      link: '#'
    },
    {
      id: 6,
      title: 'CloudTech Solutions',
      category: 'webapp',
      description: 'Dashboard zur Verwaltung von Cloud-Infrastruktur und Monitoring.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      link: '#'
    }
  ];

  // DOM Elements
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const filterButtons = document.querySelectorAll('.portfolio-filter__btn');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox__image');
  const lightboxTitle = document.querySelector('.lightbox__title');
  const lightboxDescription = document.querySelector('.lightbox__description');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__nav--prev');
  const lightboxNext = document.querySelector('.lightbox__nav--next');
  const lightboxCounter = document.querySelector('.lightbox__counter');

  // State
  let currentIndex = 0;
  let filteredItems = [...portfolioData];

  // Initialize Portfolio
  function initPortfolio() {
    renderPortfolio(portfolioData);
    setupEventListeners();
  }

  // Render Portfolio Items
  function renderPortfolio(items) {
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = items.map((item, index) => `
      <article class="portfolio-item" data-category="${item.category}" data-index="${index}">
        <img src="${item.image}" alt="${item.title}" class="portfolio-item__image" loading="lazy">
        <div class="portfolio-item__zoom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M11 8v6M8 11h6"/>
          </svg>
        </div>
        <div class="portfolio-item__overlay">
          <span class="portfolio-item__category">${getCategoryLabel(item.category)}</span>
          <h3 class="portfolio-item__title">${item.title}</h3>
          <p class="portfolio-item__description">${item.description}</p>
          <a href="${item.link}" class="portfolio-item__link">
            Projekt ansehen
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </article>
    `).join('');

    // Re-attach click handlers
    attachPortfolioClickHandlers();
  }

  function attachPortfolioClickHandlers() {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        openLightbox(index);
      });
    });
  }

  // Filter Portfolio
  function filterPortfolio(category) {
    if (category === 'all') {
      filteredItems = [...portfolioData];
    } else {
      filteredItems = portfolioData.filter(item => item.category === category);
    }
    
    // Update active button
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
    
    // Re-render with new indices
    renderPortfolio(filteredItems);
  }

  // Lightbox Functions
  function openLightbox(index) {
    if (!lightbox) return;
    
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = filteredItems[currentIndex];
    if (!item) return;
    
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightboxCounter.textContent = `${currentIndex + 1} / ${filteredItems.length}`;
    
    // Update nav visibility
    lightboxPrev.style.display = filteredItems.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = filteredItems.length > 1 ? 'flex' : 'none';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % filteredItems.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxContent();
  }

  // Helper Functions
  function getCategoryLabel(category) {
    const labels = {
      'website': 'Website',
      'webapp': 'WebApp',
      'branding': 'Branding',
      'ecommerce': 'E-Commerce'
    };
    return labels[category] || category;
  }

  // Event Listeners
  function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterPortfolio(btn.dataset.filter);
      });
    });
    
    // Lightbox close
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Lightbox navigation
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
      });
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
      });
    }
    
    // Lightbox backdrop click
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    });
    
    // Touch swipe for lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightbox) {
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  }

  // Initialize
  initPortfolio();
});