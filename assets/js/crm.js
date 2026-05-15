/* CRM / HubSpot Integration JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initCRM();
});

/**
 * HubSpot Configuration
 */
const hubspotConfig = {
  // Replace with your actual HubSpot Portal ID and Form ID
  portalId: '12345678',
  formId: 'abc123-def456-ghi789',
  
  // Field mappings (local field name -> HubSpot field name)
  fieldMappings: {
    'firstname': 'firstname',
    'lastname': 'lastname',
    'email': 'email',
    'phone': 'phone',
    'company': 'company',
    'service': 'service_interest',
    'message': 'message',
    'budget': 'budget_range'
  },
  
  // Service options for dropdown
  serviceOptions: {
    de: [
      { value: 'website', label: 'Website & Shop' },
      { value: 'webapp', label: 'Webanwendungen' },
      { value: 'hosting', label: 'Hosting & Domain' },
      { value: 'support', label: 'IT-Support' },
      { value: 'consulting', label: 'IT-Beratung' },
      { value: 'other', label: 'Sonstiges' }
    ],
    en: [
      { value: 'website', label: 'Website & Shop' },
      { value: 'webapp', label: 'Web Applications' },
      { value: 'hosting', label: 'Hosting & Domain' },
      { value: 'support', label: 'IT Support' },
      { value: 'consulting', label: 'IT Consulting' },
      { value: 'other', label: 'Other' }
    ]
  },
  
  // Budget options
  budgetOptions: {
    de: [
      { value: 'under-1000', label: 'Unter €1.000' },
      { value: '1000-3000', label: '€1.000 - €3.000' },
      { value: '3000-5000', label: '€3.000 - €5.000' },
      { value: '5000-10000', label: '€5.000 - €10.000' },
      { value: 'over-10000', label: 'Über €10.000' },
      { value: 'not-sure', label: 'Noch nicht sicher' }
    ],
    en: [
      { value: 'under-1000', label: 'Under €1,000' },
      { value: '1000-3000', label: '€1,000 - €3,000' },
      { value: '3000-5000', label: '€3,000 - €5,000' },
      { value: '5000-10000', label: '€5,000 - €10,000' },
      { value: 'over-10000', label: 'Over €10,000' },
      { value: 'not-sure', label: 'Not sure yet' }
    ]
  }
};

/**
 * Get current language
 */
function getCRMLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize CRM
 */
function initCRM() {
  const leadForm = document.querySelector('.lead-form');
  
  if (leadForm) {
    populateDropdowns(leadForm);
    initFormValidation(leadForm);
    initFormSubmission(leadForm);
    initAutoSave(leadForm);
  }
}

/**
 * Populate dropdown options based on language
 */
function populateDropdowns(form) {
  const lang = getCRMLang();
  
  // Service dropdown
  const serviceSelect = form.querySelector('[name="service"]');
  if (serviceSelect && hubspotConfig.serviceOptions[lang]) {
    const options = hubspotConfig.serviceOptions[lang];
    serviceSelect.innerHTML = '<option value="">' + (lang === 'de' ? 'Bitte wählen...' : 'Please select...') + '</option>';
    options.forEach(opt => {
      serviceSelect.innerHTML += `<option value="${opt.value}">${opt.label}</option>`;
    });
  }
  
  // Budget dropdown
  const budgetSelect = form.querySelector('[name="budget"]');
  if (budgetSelect && hubspotConfig.budgetOptions[lang]) {
    const options = hubspotConfig.budgetOptions[lang];
    budgetSelect.innerHTML = '<option value="">' + (lang === 'de' ? 'Bitte wählen...' : 'Please select...') + '</option>';
    options.forEach(opt => {
      budgetSelect.innerHTML += `<option value="${opt.value}">${opt.label}</option>`;
    });
  }
}

/**
 * Initialize form validation
 */
function initFormValidation(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error on input
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.lead-form__error');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
    });
  });
}

/**
 * Validate single field
 */
function validateField(field) {
  const value = field.value.trim();
  let error = null;
  
  // Required check
  if (field.hasAttribute('required') && !value) {
    error = getCRMLang() === 'de' ? 'Dieses Feld ist erforderlich' : 'This field is required';
  }
  
  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      error = getCRMLang() === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein' : 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!phoneRegex.test(value) || value.length < 7) {
      error = getCRMLang() === 'de' ? 'Bitte geben Sie eine gültige Telefonnummer ein' : 'Please enter a valid phone number';
    }
  }
  
  // Show/hide error
  if (error) {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.lead-form__error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'lead-form__error';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = error;
    errorEl.style.display = 'block';
    return false;
  } else {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.lead-form__error');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
    return true;
  }
}

/**
 * Initialize form submission
 */
function initFormSubmission(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Collect form data
    const formData = collectFormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.lead-form__submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = getCRMLang() === 'de' ? 'Wird gesendet...' : 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Submit to HubSpot
      await submitToHubSpot(formData);
      
      // Track successful submission
      if (window.journeyTrack) {
        window.journeyTrack.track('lead_form_submit', formData);
      }
      
      // Show success state
      showSuccessState(form);
      
      // Clear localStorage
      localStorage.removeItem('leadFormData');
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error toast
      if (window.showToast) {
        window.showToast(
          getCRMLang() === 'de' 
            ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
            : 'An error occurred. Please try again.',
          'error'
        );
      }
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

/**
 * Collect form data
 */
function collectFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  // Add metadata
  data.submittedAt = new Date().toISOString();
  data.pageUrl = window.location.href;
  data.pageName = document.title;
  
  return data;
}

/**
 * Submit to HubSpot
 */
async function submitToHubSpot(formData) {
  // Convert to HubSpot format
  const hubspotFields = Object.entries(formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({
      name: hubspotConfig.fieldMappings[key] || key,
      value: value
    }));
  
  // If portal ID is placeholder, simulate success
  if (hubspotConfig.portalId === '12345678') {
    console.log('HubSpot submission (demo mode):', hubspotFields);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
  }
  
  // Actual HubSpot API call
  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotConfig.portalId}/${hubspotConfig.formId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: hubspotFields,
        context: {
          pageUri: formData.pageUrl,
          pageName: formData.pageName
        }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error('HubSpot submission failed');
  }
  
  return response.json();
}

/**
 * Show success state
 */
function showSuccessState(form) {
  const lang = getCRMLang();
  
  form.innerHTML = `
    <div class="lead-form__success">
      <div class="lead-form__success-icon">✓</div>
      <h3 class="lead-form__success-title">${lang === 'de' ? 'Vielen Dank!' : 'Thank you!'}</h3>
      <p class="lead-form__success-message">
        ${lang === 'de' 
          ? 'Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.' 
          : 'We have received your request and will get back to you within 24 hours.'}
      </p>
    </div>
  `;
}

/**
 * Initialize auto-save to localStorage
 */
function initAutoSave(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  
  // Load saved data
  const savedData = localStorage.getItem('leadFormData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      Object.entries(data).forEach(([key, value]) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && value) {
          input.value = value;
        }
      });
    } catch (e) {
      console.log('Could not restore form data');
    }
  }
  
  // Auto-save on input
  let saveTimeout;
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const formData = collectFormData(form);
        localStorage.setItem('leadFormData', JSON.stringify(formData));
      }, 1000);
    });
  });
}

/**
 * Lead Scoring System
 */
const leadScoring = {
  calculateScore(formData) {
    let score = 0;
    
    // Email provided (high intent)
    if (formData.email) score += 25;
    
    // Phone provided (high intent)
    if (formData.phone) score += 20;
    
    // Company provided
    if (formData.company) score += 15;
    
    // Service selected
    if (formData.service) score += 15;
    
    // Budget specified
    if (formData.budget) score += 15;
    
    // Message length (indicates engagement)
    if (formData.message && formData.message.length > 50) score += 10;
    
    return Math.min(score, 100);
  },
  
  getScoreLabel(score) {
    if (score >= 80) return { label: 'Hot Lead', color: '#EF4444' };
    if (score >= 60) return { label: 'Warm Lead', color: '#F59E0B' };
    if (score >= 40) return { label: 'Cool Lead', color: '#3B82F6' };
    return { label: 'New Lead', color: '#10B981' };
  }
};

/**
 * Update lead scoring display
 */
function updateLeadScoring(formData) {
  const scoringEl = document.querySelector('.lead-scoring');
  if (!scoringEl) return;
  
  const score = leadScoring.calculateScore(formData);
  const label = leadScoring.getScoreLabel(score);
  
  const valueEl = scoringEl.querySelector('.lead-scoring__value');
  const labelEl = scoringEl.querySelector('.lead-scoring__label');
  
  if (valueEl) valueEl.textContent = score + '%';
  if (labelEl) {
    labelEl.textContent = label.label;
    labelEl.style.color = label.color;
  }
}

// Export for global use
window.hubspotConfig = hubspotConfig;
window.submitToHubSpot = submitToHubSpot;
window.leadScoring = leadScoring;