/* Multi-Step Form JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const steps = document.querySelectorAll('.form-step');
  const stepIndicators = document.querySelectorAll('.form-progress__step');
  const progressLine = document.getElementById('progressLine');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const formAutosave = document.getElementById('formAutosave');

  let currentStep = 1;
  const totalSteps = steps.length;

  // Initialize
  updateProgress();

  // Auto-save to localStorage
  const STORAGE_KEY = 'devmiro_contact_form';
  
  // Load saved data
  loadFormData();

  // Auto-save on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', debounce(() => {
      saveFormData();
      showAutosaveIndicator('saving');
      setTimeout(() => showAutosaveIndicator('saved'), 500);
    }, 500));
  });

  // Navigation buttons
  prevBtn.addEventListener('click', () => navigateStep(-1));
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      navigateStep(1);
    }
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      // Simulate form submission
      submitBtn.innerHTML = `
        <span class="loading-spinner" style="width: 20px; height: 20px;"></span>
        Wird gesendet...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('active');
        localStorage.removeItem(STORAGE_KEY);
      }, 1500);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.target.matches('textarea')) {
      e.preventDefault();
      if (currentStep < totalSteps && validateStep(currentStep)) {
        navigateStep(1);
      }
    }
  });

  function navigateStep(direction) {
    const newStep = currentStep + direction;
    
    if (newStep < 1 || newStep > totalSteps) return;
    
    // Validate current step before moving forward
    if (direction === 1 && !validateStep(currentStep)) return;

    // Hide current step
    steps[currentStep - 1].classList.remove('active');
    stepIndicators[currentStep - 1].classList.remove('active');
    
    // Update step counter
    currentStep = newStep;
    
    // Show new step
    steps[currentStep - 1].classList.add('active');
    stepIndicators[currentStep - 1].classList.add('active');
    
    // Mark previous steps as completed
    for (let i = 0; i < currentStep - 1; i++) {
      stepIndicators[i].classList.add('completed');
      stepIndicators[i].querySelector('.form-progress__number').innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
    }

    // Update progress line
    updateProgress();
    
    // Update button states
    updateButtons();
    
    // Focus first input of new step
    const firstInput = steps[currentStep - 1].querySelector('input, textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    const currentStepEl = steps[step - 1];
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      const value = field.value.trim();
      const type = field.type;
      
      // Reset error state
      field.classList.remove('error');
      field.classList.remove('valid');

      // Check if empty
      if (!value) {
        isValid = false;
        field.classList.add('error');
      }
      // Email validation
      else if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        field.classList.add('error');
      }
      // Phone validation (optional)
      else if (type === 'tel' && value && !isValidPhone(value)) {
        // Phone is optional, so we don't fail validation
        field.classList.add('valid');
      }
      // Checkbox group validation
      else if (type === 'checkbox' || type.classList.contains('form-checkbox__input')) {
        const name = field.name;
        const checkedBoxes = currentStepEl.querySelectorAll(`input[name="${name}"]:checked`);
        if (field.required && checkedBoxes.length === 0) {
          isValid = false;
        } else if (checkedBoxes.length > 0) {
          field.classList.add('valid');
        }
      }
      // Radio group validation
      else if (type === 'radio') {
        const name = field.name;
        const checkedRadio = currentStepEl.querySelector(`input[name="${name}"]:checked`);
        if (field.required && !checkedRadio) {
          isValid = false;
        } else if (checkedRadio) {
          field.classList.add('valid');
        }
      }
      // Default: mark as valid
      else {
        field.classList.add('valid');
      }
    });

    if (!isValid) {
      // Shake animation
      currentStepEl.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        currentStepEl.style.animation = '';
      }, 500);
    }

    return isValid;
  }

  function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
  }

  function updateButtons() {
    // Previous button
    prevBtn.disabled = currentStep === 1;
    
    // Next/Submit button visibility
    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'flex';
    } else {
      nextBtn.style.display = 'flex';
      submitBtn.style.display = 'none';
    }
  }

  function saveFormData() {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadFormData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    try {
      const data = JSON.parse(saved);
      
      for (let [key, value] of Object.entries(data)) {
        const fields = form.querySelectorAll(`[name="${key}"]`);
        
        fields.forEach(field => {
          if (field.type === 'checkbox' || field.type === 'radio') {
            if (Array.isArray(value)) {
              field.checked = value.includes(field.value);
            } else {
              field.checked = field.value === value;
            }
          } else {
            field.value = value;
          }
        });
      }
    } catch (e) {
      console.log('Could not restore form data');
    }
  }

  function showAutosaveIndicator(state) {
    if (!formAutosave) return;
    
    formAutosave.classList.toggle('saving', state === 'saving');
    
    if (state === 'saved') {
      formAutosave.innerHTML = `
        <svg class="form-autosave__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
        <span>Gespeichert ✓</span>
      `;
      
      setTimeout(() => {
        formAutosave.innerHTML = `
          <svg class="form-autosave__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <span>Automatisches Speichern aktiv</span>
        `;
      }, 2000);
    }
  }

  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
  }
});

// Add shake animation if not exists
if (!document.querySelector('#shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}