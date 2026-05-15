/* Price Calculator JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  const calculator = document.querySelector('.price-calculator');
  if (!calculator) return;

  // Configuration - adjust prices as needed
  const config = {
    basePrice: 500,
    pricePerPage: 100,
    pricePerFeature: 150,
    pricePerAddOn: {
      'seo': 200,
      'analytics': 100,
      'contact-form': 80,
      'multilanguage': 300,
      'cms': 250,
      'ecommerce': 500,
      'chatbot': 350,
      'custom-design': 400
    },
    timelineDiscount: {
      'standard': 0,
      'express': 0.15, // 15% surcharge for express
      'flexible': -0.1 // 10% discount for flexible
    }
  };

  // State
  let state = {
    pages: 5,
    features: 3,
    addons: [],
    timeline: 'standard'
  };

  // Elements
  const pagesSlider = document.getElementById('pagesSlider');
  const pagesValue = document.getElementById('pagesValue');
  const pagesPrice = document.getElementById('pagesPrice');
  
  const featuresSlider = document.getElementById('featuresSlider');
  const featuresValue = document.getElementById('featuresValue');
  const featuresPrice = document.getElementById('featuresPrice');
  
  const timelineRadios = document.querySelectorAll('input[name="timeline"]');
  
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox input');
  
  const totalPriceEl = document.getElementById('totalPrice');
  const breakdownItems = document.querySelectorAll('.breakdown-item');

  // Initialize
  updateCalculations();

  // Event Listeners
  if (pagesSlider) {
    pagesSlider.addEventListener('input', (e) => {
      state.pages = parseInt(e.target.value);
      updateCalculations();
    });
  }

  if (featuresSlider) {
    featuresSlider.addEventListener('input', (e) => {
      state.features = parseInt(e.target.value);
      updateCalculations();
    });
  }

  timelineRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.timeline = e.target.value;
      updateCalculations();
    });
  });

  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.addons.push(e.target.value);
      } else {
        state.addons = state.addons.filter(a => a !== e.target.value);
      }
      updateCalculations();
    });
  });

  // Calculation Logic
  function updateCalculations() {
    // Update slider displays
    if (pagesValue) pagesValue.textContent = state.pages;
    if (pagesPrice) pagesPrice.textContent = (state.pages * config.pricePerPage).toLocaleString('de-DE');
    
    if (featuresValue) featuresValue.textContent = state.features;
    if (featuresPrice) featuresPrice.textContent = (state.features * config.pricePerFeature).toLocaleString('de-DE');

    // Calculate subtotal
    const pagesCost = state.pages * config.pricePerPage;
    const featuresCost = state.features * config.pricePerFeature;
    const addonsCost = state.addons.reduce((sum, addon) => sum + (config.pricePerAddOn[addon] || 0), 0);
    
    let subtotal = config.basePrice + pagesCost + featuresCost + addonsCost;
    
    // Apply timeline discount/surcharge
    const timelineMultiplier = 1 - (config.timelineDiscount[state.timeline] || 0);
    subtotal = subtotal * timelineMultiplier;

    // Update breakdown
    if (breakdownItems.length > 0) {
      const breakdown = [
        { label: 'Grundpreis', value: config.basePrice },
        { label: `${state.pages} Seiten × €${config.pricePerPage}`, value: pagesCost },
        { label: `${state.features} Features × €${config.pricePerFeature}`, value: featuresCost }
      ];
      
      state.addons.forEach(addon => {
        breakdown.push({
          label: formatAddonName(addon),
          value: config.pricePerAddOn[addon] || 0
        });
      });
      
      if (config.timelineDiscount[state.timeline] !== 0) {
        const discountLabel = state.timeline === 'express' ? 'Express-Aufschlag' : 'Flexible Rabatt';
        const discountValue = Math.round(subtotal * config.timelineDiscount[state.timeline]);
        breakdown.push({
          label: discountLabel,
          value: discountValue
        });
      }
      
      breakdown.forEach((item, index) => {
        if (breakdownItems[index]) {
          breakdownItems[index].querySelector('.calculator-breakdown__label').textContent = item.label;
          breakdownItems[index].querySelector('.calculator-breakdown__value').textContent = `€${item.value.toLocaleString('de-DE')}`;
        }
      });
    }

    // Animate total price
    animateValue(totalPriceEl, parseInt(totalPriceEl.textContent.replace(/\D/g, '')) || 0, Math.round(subtotal), 500);

    // Update CTA text
    const ctaButton = document.querySelector('.calculator-cta .btn--primary');
    if (ctaButton) {
      ctaButton.textContent = `Jetzt Angebot anfordern — €${Math.round(subtotal).toLocaleString('de-DE')}`;
    }
  }

  function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const isDecreasing = end < start;
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      
      element.textContent = Math.round(current).toLocaleString('de-DE');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  function formatAddonName(addon) {
    const names = {
      'seo': 'SEO-Optimierung',
      'analytics': 'Analytics Integration',
      'contact-form': 'Kontaktformular',
      'multilanguage': 'Mehrsprachigkeit',
      'cms': 'CMS-Integration',
      'ecommerce': 'E-Commerce',
      'chatbot': 'Chatbot',
      'custom-design': 'Individuelles Design'
    };
    return names[addon] || addon;
  }

  // Touch-friendly slider interaction
  const sliders = document.querySelectorAll('.range-slider');
  sliders.forEach(slider => {
    let isDragging = false;
    
    slider.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    
    slider.addEventListener('touchstart', () => isDragging = true, { passive: true });
    document.addEventListener('touchend', () => isDragging = false, { passive: true });
  });
});