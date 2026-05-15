/* Advanced Form Builder JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initFormBuilder();
});

/**
 * Form Builder Configuration
 */
const formConfig = {
  id: 'contact-form-advanced',
  steps: [
    {
      id: 'personal',
      title: 'Kontaktdaten',
      fields: ['name', 'email', 'phone', 'company']
    },
    {
      id: 'project',
      title: 'Projekt',
      fields: ['projectType', 'description', 'deadline']
    },
    {
      id: 'budget',
      title: 'Budget & Zeitrahmen',
      fields: ['budget', 'timeline', 'features']
    },
    {
      id: 'files',
      title: 'Dateien & Abschluss',
      fields: ['files', 'terms']
    }
  ],
  fieldDefinitions: {
    name: {
      type: 'text',
      label: 'Vollständiger Name',
      placeholder: 'Max Mustermann',
      required: true,
      validation: 'name',
      icon: 'user'
    },
    email: {
      type: 'email',
      label: 'E-Mail-Adresse',
      placeholder: 'max@beispiel.at',
      required: true,
      validation: 'email',
      icon: 'mail'
    },
    phone: {
      type: 'tel',
      label: 'Telefonnummer',
      placeholder: '+43 660 123 4567',
      required: false,
      validation: 'phone',
      icon: 'phone'
    },
    company: {
      type: 'text',
      label: 'Firmenname',
      placeholder: 'Ihre Firma GmbH',
      required: false,
      icon: 'building'
    },
    projectType: {
      type: 'select',
      label: 'Projektart',
      required: true,
      options: [
        { value: '', label: 'Bitte auswählen...' },
        { value: 'website', label: 'Website / Landingpage' },
        { value: 'webapp', label: 'Webanwendung' },
        { value: 'ecommerce', label: 'E-Commerce Shop' },
        { value: ' redesign', label: 'Website Relaunch' },
        { value: 'hosting', label: 'Hosting / Server' },
        { value: 'consulting', label: 'IT-Beratung' },
        { value: 'other', label: 'Sonstiges' }
      ]
    },
    description: {
      type: 'textarea',
      label: 'Projektbeschreibung',
      placeholder: 'Beschreiben Sie Ihr Projekt so detailliert wie möglich...',
      required: true,
      validation: 'minLength:20'
    },
    deadline: {
      type: 'date',
      label: 'Wunschtermin (optional)',
      required: false,
      min: new Date().toISOString().split('T')[0]
    },
    budget: {
      type: 'select',
      label: 'Geschätztes Budget',
      required: true,
      options: [
        { value: '', label: 'Bitte auswählen...' },
        { value: 'under-1000', label: 'Unter €1.000' },
        { value: '1000-5000', label: '€1.000 - €5.000' },
        { value: '5000-15000', label: '€5.000 - €15.000' },
        { value: '15000-50000', label: '€15.000 - €50.000' },
        { value: 'over-50000', label: 'Über €50.000' },
        { value: 'flexible', label: 'Flexibel / nach Absprache' }
      ]
    },
    timeline: {
      type: 'select',
      label: 'Zeitrahmen',
      required: true,
      options: [
        { value: '', label: 'Bitte auswählen...' },
        { value: 'asap', label: 'So schnell wie möglich' },
        { value: '1-month', label: 'Innerhalb 1 Monats' },
        { value: '1-3-months', label: '1-3 Monate' },
        { value: '3-6-months', label: '3-6 Monate' },
        { value: 'flexible', label: 'Flexibel' }
      ]
    },
    features: {
      type: 'checkbox-group',
      label: 'Gewünschte Features',
      required: false,
      options: [
        { value: 'seo', label: 'SEO-Optimierung' },
        { value: 'analytics', label: 'Google Analytics' },
        { value: 'contact-form', label: 'Kontaktformular' },
        { value: 'cms', label: 'CMS-Integration' },
        { value: 'multilingual', label: 'Mehrsprachigkeit' },
        { value: 'social', label: 'Social Media Integration' },
        { value: 'newsletter', label: 'Newsletter-Anmeldung' },
        { value: 'blog', label: 'Blog / News-Bereich' }
      ]
    },
    files: {
      type: 'file',
      label: 'Dateien hochladen',
      hint: 'PDF, DOC, DOCX, JPG, PNG bis max. 10MB',
      required: false,
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
      maxSize: 10 * 1024 * 1024,
      multiple: true
    },
    terms: {
      type: 'checkbox',
      label: 'Ich akzeptiere die <a href="/datenschutz.html" target="_blank">Datenschutzerklärung</a> und stimme der Verarbeitung meiner Daten zu.',
      required: true,
      validation: 'checked'
    }
  },
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  showValidationOnBlur: true
};

/**
 * Initialize Form Builder
 */
function initFormBuilder() {
  const formContainer = document.querySelector('[data-form-builder]');
  if (!formContainer) return;

  const formBuilder = new FormBuilder(formContainer, formConfig);
  formBuilder.init();
}

/**
 * Form Builder Class
 */
class FormBuilder {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.currentStep = 0;
    this.formData = {};
    this.validationErrors = {};
    this.submitted = false;

    // Load saved data
    this.loadFromStorage();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.updateProgress();

    // Auto-save
    if (this.config.autoSave) {
      this.startAutoSave();
    }
  }

  render() {
    const html = `
      <div class="form-builder" id="${this.config.id}">
        ${this.renderProgress()}
        <form id="form-${this.config.id}" novalidate>
          ${this.renderCurrentStep()}
          ${this.renderActions()}
        </form>
      </div>
    `;

    this.container.innerHTML = html;
    this.form = document.getElementById(`form-${this.config.id}`);
  }

  renderProgress() {
    const steps = this.config.steps.map((step, index) => {
      const isActive = index === this.currentStep;
      const isCompleted = index < this.currentStep;

      return `
        <div class="form-progress__step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-step="${index}">
          <div class="form-progress__step-number">
            ${isCompleted ? '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3"/></svg>' : index + 1}
          </div>
          <div class="form-progress__step-label">${step.title}</div>
        </div>
      `;
    }).join('');

    const progress = ((this.currentStep) / (this.config.steps.length - 1)) * 100;

    return `
      <div class="form-progress">
        <div class="form-progress__bar">
          <div class="form-progress__fill" style="width: ${progress}%"></div>
        </div>
        <div class="form-progress__steps">
          ${steps}
        </div>
      </div>
    `;
  }

  renderCurrentStep() {
    const step = this.config.steps[this.currentStep];
    const fields = step.fields.map(fieldName => this.renderField(fieldName)).join('');

    return `
      <div class="form-step" data-step-content="${this.currentStep}">
        <h3 class="form-step__title">${step.title}</h3>
        ${this.renderAutoSaveIndicator()}
        ${fields}
      </div>
    `;
  }

  renderField(fieldName) {
    const field = this.config.fieldDefinitions[fieldName];
    if (!field) return '';

    const value = this.formData[fieldName] || '';
    const error = this.validationErrors[fieldName];
    const hasError = error && error.show;
    const isValid = value && !hasError;

    let inputHtml = '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        inputHtml = this.renderTextInput(fieldName, field, value, hasError, isValid);
        break;
      case 'select':
        inputHtml = this.renderSelect(fieldName, field, value);
        break;
      case 'textarea':
        inputHtml = this.renderTextarea(fieldName, field, value, hasError, isValid);
        break;
      case 'checkbox':
        inputHtml = this.renderCheckbox(fieldName, field, value);
        break;
      case 'checkbox-group':
        inputHtml = this.renderCheckboxGroup(fieldName, field, value);
        break;
      case 'file':
        inputHtml = this.renderFileUpload(fieldName, field, value);
        break;
      case 'date':
        inputHtml = this.renderDateInput(fieldName, field, value);
        break;
    }

    return `
      <div class="form-field ${hasError ? 'has-error' : ''}" data-field="${fieldName}">
        ${inputHtml}
        ${field.hint ? `<div class="form-field__hint">${field.hint}</div>` : ''}
        ${hasError ? `<div class="form-field__error show"><svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>${error.message}</div>` : ''}
      </div>
    `;
  }

  renderTextInput(fieldName, field, value, hasError, isValid) {
    const iconSvg = this.getIcon(field.icon);

    return `
      ${field.icon ? `
        <div class="form-field__input-wrapper">
          <span class="form-field__icon">${iconSvg}</span>
          <input
            type="${field.type}"
            name="${fieldName}"
            class="form-field__input ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}"
            placeholder="${field.placeholder || ''}"
            value="${value}"
            ${field.required ? 'required' : ''}
            data-validate="${field.validation || ''}"
          >
        </div>
      ` : `
        <input
          type="${field.type}"
          name="${fieldName}"
          class="form-field__input ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}"
          placeholder="${field.placeholder || ''}"
          value="${value}"
          ${field.required ? 'required' : ''}
          data-validate="${field.validation || ''}"
        >
      `}
      <label class="form-field__label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : ''}
      </label>
    `;
  }

  renderSelect(fieldName, field, value) {
    const options = field.options.map(opt => `
      <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>${opt.label}</option>
    `).join('');

    return `
      <label class="form-field__label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : ''}
      </label>
      <select name="${fieldName}" class="form-field__select" ${field.required ? 'required' : ''}>
        ${options}
      </select>
    `;
  }

  renderTextarea(fieldName, field, value, hasError, isValid) {
    return `
      <label class="form-field__label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : ''}
      </label>
      <textarea
        name="${fieldName}"
        class="form-field__textarea ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}"
        placeholder="${field.placeholder || ''}"
        ${field.required ? 'required' : ''}
        data-validate="${field.validation || ''}"
      >${value}</textarea>
    `;
  }

  renderCheckbox(fieldName, field, value) {
    const checked = value ? 'checked' : '';
    return `
      <label class="form-field__checkbox">
        <input type="checkbox" name="${fieldName}" ${checked}>
        <span class="form-field__checkbox-label">${field.label}</span>
      </label>
    `;
  }

  renderCheckboxGroup(fieldName, field, value) {
    const values = Array.isArray(value) ? value : [];

    const options = field.options.map(opt => `
      <label class="form-field__checkbox">
        <input type="checkbox" name="${fieldName}" value="${opt.value}" ${values.includes(opt.value) ? 'checked' : ''}>
        <span class="form-field__checkbox-label">${opt.label}</span>
      </label>
    `).join('');

    return `
      <label class="form-field__label">${field.label}</label>
      <div class="form-field__checkbox-group">
        ${options}
      </div>
    `;
  }

  renderFileUpload(fieldName, field, value) {
    return `
      <label class="form-field__label">${field.label}</label>
      <div class="form-field__file" data-field="${fieldName}">
        <div class="form-field__file-dropzone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div class="form-field__file-dropzone-text">
            Dateien hierher ziehen oder klicken
          </div>
          <div class="form-field__file-dropzone-hint">${field.hint}</div>
        </div>
        <input
          type="file"
          class="form-field__file-input"
          accept="${field.accept}"
          ${field.multiple ? 'multiple' : ''}
          data-max-size="${field.maxSize}"
        >
        <div class="form-field__file-list"></div>
      </div>
    `;
  }

  renderDateInput(fieldName, field, value) {
    return `
      <label class="form-field__label">${field.label}</label>
      <input
        type="date"
        name="${fieldName}"
        class="form-field__input"
        value="${value}"
        ${field.min ? `min="${field.min}"` : ''}
      >
    `;
  }

  renderAutoSaveIndicator() {
    return `
      <div class="form-autosave" style="display: none;">
        <svg class="form-autosave__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        <span class="form-autosave__text">Wird gespeichert...</span>
      </div>
    `;
  }

  renderActions() {
    const isFirstStep = this.currentStep === 0;
    const isLastStep = this.currentStep === this.config.steps.length - 1;

    return `
      <div class="form-actions">
        ${!isFirstStep ? `
          <button type="button" class="btn btn--secondary btn-prev">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Zurück
          </button>
        ` : '<div></div>'}
        ${isLastStep ? `
          <button type="submit" class="btn btn--primary btn-submit">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Anfrage senden
          </button>
        ` : `
          <button type="button" class="btn btn--primary btn-next">
            Weiter
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        `}
      </div>
    `;
  }

  attachEventListeners() {
    // Navigation buttons
    this.container.querySelector('.btn-prev')?.addEventListener('click', () => this.prevStep());
    this.container.querySelector('.btn-next')?.addEventListener('click', () => this.nextStep());

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Input change tracking
    this.form.addEventListener('input', (e) => this.handleInputChange(e));
    this.form.addEventListener('change', (e) => this.handleInputChange(e));

    // File upload
    this.initFileUpload();

    // Validation on blur
    if (this.config.showValidationOnBlur) {
      this.form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => this.validateField(input.name));
      });
    }
  }

  handleInputChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && e.target.name.includes('[]')) {
      // Handle checkbox groups
      const fieldName = name.replace('[]', '');
      if (!this.formData[fieldName]) {
        this.formData[fieldName] = [];
      }
      if (checked) {
        this.formData[fieldName].push(value);
      } else {
        this.formData[fieldName] = this.formData[fieldName].filter(v => v !== value);
      }
    } else if (type === 'checkbox') {
      this.formData[name] = checked;
    } else {
      this.formData[name] = value;
    }

    // Save to storage
    if (this.config.autoSave) {
      this.saveToStorage();
    }
  }

  async nextStep() {
    // Validate current step
    const step = this.config.steps[this.currentStep];
    const isValid = await this.validateStep(step.fields);

    if (!isValid) {
      this.showToast('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      return;
    }

    this.currentStep++;
    this.updateForm();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateForm();
    }
  }

  updateForm() {
    this.render();
    this.attachEventListeners();
    this.updateProgress();
  }

  updateProgress() {
    const progress = ((this.currentStep) / (this.config.steps.length - 1)) * 100;
    const fill = this.container.querySelector('.form-progress__fill');
    if (fill) {
      fill.style.width = `${progress}%`;
    }
  }

  async validateStep(fieldNames) {
    let isValid = true;

    for (const fieldName of fieldNames) {
      const fieldValid = await this.validateField(fieldName);
      if (!fieldValid) {
        isValid = false;
      }
    }

    return isValid;
  }

  async validateField(fieldName) {
    const field = this.config.fieldDefinitions[fieldName];
    const input = this.form.querySelector(`[name="${fieldName}"]`);
    if (!input) return true;

    const value = input.type === 'checkbox' ? input.checked : input.value;
    let error = null;

    // Required check
    if (field.required) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        error = { message: 'Dieses Feld ist erforderlich', show: true };
      }
    }

    // Validation rules
    if (value && field.validation) {
      const validationRules = field.validation.split(',');

      for (const rule of validationRules) {
        const [ruleName, ruleParam] = rule.split(':');

        switch (ruleName) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              error = { message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein', show: true };
            }
            break;
          case 'phone':
            if (!/^[\d\s\+\-\(\)]{6,}$/.test(value)) {
              error = { message: 'Bitte geben Sie eine gültige Telefonnummer ein', show: true };
            }
            break;
          case 'name':
            if (value.length < 2) {
              error = { message: 'Bitte geben Sie Ihren vollständigen Namen ein', show: true };
            }
            break;
          case 'minLength':
            if (value.length < parseInt(ruleParam)) {
              error = { message: `Bitte geben Sie mindestens ${ruleParam} Zeichen ein`, show: true };
            }
            break;
          case 'checked':
            if (!value) {
              error = { message: 'Sie müssen diese Option akzeptieren', show: true };
            }
            break;
        }
      }
    }

    // Update UI
    const fieldEl = this.container.querySelector(`[data-field="${fieldName}"]`);
    const errorEl = fieldEl?.querySelector('.form-field__error');

    if (error) {
      this.validationErrors[fieldName] = error;
      input.classList.add('error');
      input.classList.remove('valid');
      if (errorEl) {
        errorEl.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>${error.message}`;
        errorEl.classList.add('show');
      }
    } else {
      delete this.validationErrors[fieldName];
      input.classList.remove('error');
      if (value) input.classList.add('valid');
      if (errorEl) errorEl.classList.remove('show');
    }

    return !error;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const allFields = this.config.steps.flatMap(step => step.fields);
    const isValid = await this.validateStep(allFields);

    if (!isValid) {
      this.showToast('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
      return;
    }

    // Show loading state
    const submitBtn = this.container.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Wird gesendet...</span>';

    // Simulate form submission
    try {
      await this.submitForm();

      // Success
      this.renderSuccess();
      this.clearStorage();

      // Track conversion
      if (window.journeyTrack) {
        window.journeyTrack.track('form_submit_advanced', this.formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Anfrage senden';
    }
  }

  async submitForm() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', this.formData);
        resolve({ success: true, reference: 'DM-' + Date.now() });
      }, 1500);
    });
  }

  renderSuccess() {
    const reference = 'DM-' + Date.now();

    this.container.innerHTML = `
      <div class="form-builder">
        <div class="form-success">
          <div class="form-success__icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3 class="form-success__title">Vielen Dank für Ihre Anfrage!</h3>
          <p class="form-success__message">Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
          <div class="form-success__reference">
            <div class="form-success__reference-label">Ihre Referenznummer</div>
            <div class="form-success__reference-number">${reference}</div>
          </div>
          <a href="/" class="btn btn--primary">Zurück zur Startseite</a>
        </div>
      </div>
    `;
  }

  initFileUpload() {
    const fileFields = this.container.querySelectorAll('.form-field__file');

    fileFields.forEach(field => {
      const input = field.querySelector('.form-field__file-input');
      const dropzone = field.querySelector('.form-field__file-dropzone');
      const list = field.querySelector('.form-field__file-list');
      const maxSize = parseInt(input.dataset.maxSize) || 10 * 1024 * 1024;

      // Click to upload
      input.addEventListener('change', () => handleFiles(input.files));

      // Drag and drop
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults);
        document.body.addEventListener(eventName, preventDefaults);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'));
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'));
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        handleFiles(dt.files);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const handleFiles = (files) => {
        Array.from(files).forEach(file => {
          if (file.size > maxSize) {
            this.showToast(`Datei ${file.name} ist zu groß (max. 10MB)`, 'error');
            return;
          }

          // Add to list
          const item = document.createElement('div');
          item.className = 'form-field__file-item';
          item.innerHTML = `
            <div class="form-field__file-item-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div class="form-field__file-item-info">
              <div class="form-field__file-item-name">${file.name}</div>
              <div class="form-field__file-item-size">${formatSize(file.size)}</div>
            </div>
            <button type="button" class="form-field__file-item-remove">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          `;

          item.querySelector('.form-field__file-item-remove').addEventListener('click', () => {
            item.remove();
          });

          list.appendChild(item);

          // Store file reference
          const fieldName = field.dataset.field;
          if (!this.formData[fieldName]) {
            this.formData[fieldName] = [];
          }
          this.formData[fieldName].push(file);
        });
      };

      function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
    });
  }

  startAutoSave() {
    setInterval(() => {
      this.saveToStorage();
      this.showAutoSaveIndicator();
    }, this.config.autoSaveInterval);
  }

  saveToStorage() {
    const data = {
      formData: this.formData,
      currentStep: this.currentStep,
      timestamp: Date.now()
    };
    localStorage.setItem(`form_${this.config.id}`, JSON.stringify(data));
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(`form_${this.config.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        // Only restore if less than 24 hours old
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          this.formData = data.formData || {};
          this.currentStep = data.currentStep || 0;
        }
      }
    } catch (e) {
      console.log('Could not load saved form data');
    }
  }

  clearStorage() {
    localStorage.removeItem(`form_${this.config.id}`);
  }

  showAutoSaveIndicator() {
    const indicator = this.container.querySelector('.form-autosave');
    if (indicator) {
      indicator.style.display = 'flex';
      const icon = indicator.querySelector('.form-autosave__icon');
      const text = indicator.querySelector('.form-autosave__text');

      icon.classList.remove('saved');
      text.textContent = 'Wird gespeichert...';

      setTimeout(() => {
        icon.classList.add('saved');
        text.textContent = 'Gespeichert';
        setTimeout(() => {
          indicator.style.display = 'none';
        }, 2000);
      }, 500);
    }
  }

  showToast(message, type = 'info') {
    if (window.toast) {
      window.toast.show(message, type);
    } else {
      alert(message);
    }
  }

  getIcon(name) {
    const icons = {
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>'
    };
    return icons[name] || '';
  }
}

// Export for global use
window.FormBuilder = FormBuilder;