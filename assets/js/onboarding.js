/* Multi-step Onboarding Wizard JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initOnboarding();
});

/**
 * Onboarding Configuration
 */
const onboardingConfig = {
  steps: [
    {
      id: 'welcome',
      title: { de: 'Willkommen', en: 'Welcome' },
      subtitle: { de: 'Lassen Sie uns ein paar Fragen beantworten', en: 'Let us answer a few questions' }
    },
    {
      id: 'requirements',
      title: { de: 'Anforderungen', en: 'Requirements' },
      subtitle: { de: 'Was brauchen Sie?', en: 'What do you need?' }
    },
    {
      id: 'goals',
      title: { de: 'Ziele', en: 'Goals' },
      subtitle: { de: 'Was möchten Sie erreichen?', en: 'What do you want to achieve?' }
    },
    {
      id: 'timeline',
      title: { de: 'Zeitplan', en: 'Timeline' },
      subtitle: { de: 'Wann soll es fertig sein?', en: 'When should it be ready?' }
    },
    {
      id: 'contact',
      title: { de: 'Kontakt', en: 'Contact' },
      subtitle: { de: 'Wie können wir Sie erreichen?', en: 'How can we reach you?' }
    },
    {
      id: 'summary',
      title: { de: 'Zusammenfassung', en: 'Summary' },
      subtitle: { de: 'Überprüfen Sie Ihre Angaben', en: 'Review your information' }
    }
  ],
  
  options: {
    websiteType: {
      de: [
        { id: 'landing', label: 'Landing Page', icon: '📄' },
        { id: 'business', label: 'Business Website', icon: '🏢' },
        { id: 'ecommerce', label: 'Online Shop', icon: '🛒' },
        { id: 'blog', label: 'Blog / Portfolio', icon: '📝' },
        { id: 'webapp', label: 'Webanwendung', icon: '⚙️' }
      ],
      en: [
        { id: 'landing', label: 'Landing Page', icon: '📄' },
        { id: 'business', label: 'Business Website', icon: '🏢' },
        { id: 'ecommerce', label: 'Online Shop', icon: '🛒' },
        { id: 'blog', label: 'Blog / Portfolio', icon: '📝' },
        { id: 'webapp', label: 'Web Application', icon: '⚙️' }
      ]
    },
    goals: {
      de: [
        { id: 'leads', label: 'Mehr Leads generieren', icon: '📧' },
        { id: 'sales', label: 'Online Verkäufe steigern', icon: '💰' },
        { id: 'brand', label: 'Markenbekanntheit', icon: '🌟' },
        { id: 'support', label: 'Kundenservice verbessern', icon: '💬' },
        { id: 'info', label: 'Information bereitstellen', icon: '📋' }
      ],
      en: [
        { id: 'leads', label: 'Generate more leads', icon: '📧' },
        { id: 'sales', label: 'Increase online sales', icon: '💰' },
        { id: 'brand', label: 'Brand awareness', icon: '🌟' },
        { id: 'support', label: 'Improve customer service', icon: '💬' },
        { id: 'info', label: 'Provide information', icon: '📋' }
      ]
    },
    budget: {
      de: [
        { id: 'small', label: '€1.500 - €3.000', desc: 'Einfache Website' },
        { id: 'medium', label: '€3.000 - €7.500', desc: 'Professionell' },
        { id: 'large', label: '€7.500 - €15.000', desc: 'Umfangreich' },
        { id: 'enterprise', label: '€15.000+', desc: 'Enterprise' }
      ],
      en: [
        { id: 'small', label: '€1,500 - €3,000', desc: 'Simple Website' },
        { id: 'medium', label: '€3,000 - €7,500', desc: 'Professional' },
        { id: 'large', label: '€7,500 - €15,000', desc: 'Extensive' },
        { id: 'enterprise', label: '€15,000+', desc: 'Enterprise' }
      ]
    },
    timeline: {
      de: [
        { id: 'urgent', label: 'So schnell wie möglich', icon: '🚀' },
        { id: '1month', label: 'Innerhalb 1 Monat', icon: '⏰' },
        { id: '3months', label: 'Innerhalb 3 Monate', icon: '📅' },
        { id: 'flexible', label: 'Flexible', icon: '🎯' }
      ],
      en: [
        { id: 'urgent', label: 'As soon as possible', icon: '🚀' },
        { id: '1month', label: 'Within 1 month', icon: '⏰' },
        { id: '3months', label: 'Within 3 months', icon: '📅' },
        { id: 'flexible', label: 'Flexible', icon: '🎯' }
      ]
    }
  }
};

/**
 * Onboarding State
 */
let onboardingState = {
  currentStep: 0,
  data: {
    websiteType: null,
    goals: [],
    budget: null,
    timeline: null,
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  }
};

/**
 * Get current language
 */
function getOnboardingLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize onboarding
 */
function initOnboarding() {
  const container = document.getElementById('onboarding');
  if (!container) return;
  
  renderOnboarding();
}

/**
 * Render onboarding wizard
 */
function renderOnboarding() {
  const container = document.getElementById('onboarding');
  if (!container) return;
  
  const lang = getOnboardingLang();
  const step = onboardingConfig.steps[onboardingState.currentStep];
  const progress = ((onboardingState.currentStep) / (onboardingConfig.steps.length - 1)) * 100;
  
  container.innerHTML = `
    <section class="onboarding">
      <div class="container">
        <div class="onboarding__container">
          <!-- Progress -->
          <div class="onboarding__progress">
            <div class="onboarding__steps">
              ${onboardingConfig.steps.map((s, i) => `
                <div class="onboarding__step ${i < onboardingState.currentStep ? 'completed' : ''} ${i === onboardingState.currentStep ? 'active' : ''}">
                  <span class="onboarding__step-number">${i < onboardingState.currentStep ? '✓' : i + 1}</span>
                  <span class="onboarding__step-label">${s.title[lang] || s.title.de}</span>
                </div>
              `).join('')}
            </div>
            <div class="onboarding__progress-bar">
              <div class="onboarding__progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>
          
          <!-- Card -->
          <div class="onboarding__card">
            <div class="onboarding__card-header">
              <h2 class="onboarding__card-title">${step.title[lang] || step.title.de}</h2>
              <p class="onboarding__card-subtitle">${step.subtitle[lang] || step.subtitle.de}</p>
            </div>
            
            ${renderStepContent(step.id)}
          </div>
        </div>
      </div>
    </section>
  `;
  
  attachOnboardingHandlers();
}

/**
 * Render step content
 */
function renderStepContent(stepId) {
  const lang = getOnboardingLang();
  
  switch (stepId) {
    case 'welcome':
      return `
        <div style="text-align: center; padding: var(--space-6) 0;">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">👋</div>
          <p style="color: var(--color-text-muted); max-width: 400px; margin: 0 auto;">
            ${lang === 'de' 
              ? 'In nur 5 Minuten helfen Sie uns, Ihre perfekte Website zu planen. Keine technischen Kenntnisse nötig!' 
              : 'In just 5 minutes, help us plan your perfect website. No technical knowledge required!'}
          </p>
        </div>
        <div class="onboarding__nav">
          <div></div>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary" onclick="nextOnboardingStep()">
            ${lang === 'de' ? 'Los geht\'s' : 'Let\'s go'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      `;
      
    case 'requirements':
      return `
        <div class="onboarding__form">
          <div class="onboarding__options">
            ${onboardingConfig.options.websiteType[lang].map(opt => `
              <div class="onboarding__option ${onboardingState.data.websiteType === opt.id ? 'selected' : ''}" onclick="selectOnboardingOption('websiteType', '${opt.id}')">
                <div style="font-size: 2rem; margin-bottom: var(--space-2);">${opt.icon}</div>
                <div class="onboarding__option-title">${opt.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="onboarding__nav">
          <button class="onboarding__nav-btn onboarding__nav-btn--secondary" onclick="prevOnboardingStep()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            ${lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary ${!onboardingState.data.websiteType ? 'onboarding__nav-btn--disabled' : ''}" onclick="nextOnboardingStep()" ${!onboardingState.data.websiteType ? 'disabled' : ''}>
            ${lang === 'de' ? 'Weiter' : 'Next'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      `;
      
    case 'goals':
      return `
        <div class="onboarding__form">
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">
            ${lang === 'de' ? 'Wählen Sie alle Ziele, die auf Sie zutreffen:' : 'Select all goals that apply to you:'}
          </p>
          <div class="onboarding__options">
            ${onboardingConfig.options.goals[lang].map(opt => `
              <div class="onboarding__option ${onboardingState.data.goals.includes(opt.id) ? 'selected' : ''}" onclick="toggleOnboardingGoal('${opt.id}')">
                <div style="font-size: 2rem; margin-bottom: var(--space-2);">${opt.icon}</div>
                <div class="onboarding__option-title">${opt.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="onboarding__nav">
          <button class="onboarding__nav-btn onboarding__nav-btn--secondary" onclick="prevOnboardingStep()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            ${lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary ${onboardingState.data.goals.length === 0 ? 'onboarding__nav-btn--disabled' : ''}" onclick="nextOnboardingStep()" ${onboardingState.data.goals.length === 0 ? 'disabled' : ''}>
            ${lang === 'de' ? 'Weiter' : 'Next'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      `;
      
    case 'timeline':
      return `
        <div class="onboarding__form">
          <div class="onboarding__options" style="grid-template-columns: repeat(2, 1fr);">
            ${onboardingConfig.options.timeline[lang].map(opt => `
              <div class="onboarding__option ${onboardingState.data.timeline === opt.id ? 'selected' : ''}" onclick="selectOnboardingOption('timeline', '${opt.id}')">
                <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">${opt.icon}</div>
                <div class="onboarding__option-title">${opt.label}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="onboarding__field" style="margin-top: var(--space-6);">
            <label>${lang === 'de' ? 'Budget-Range' : 'Budget Range'}</label>
            <div class="onboarding__options">
              ${onboardingConfig.options.budget[lang].map(opt => `
                <div class="onboarding__option ${onboardingState.data.budget === opt.id ? 'selected' : ''}" onclick="selectOnboardingOption('budget', '${opt.id}')">
                  <div class="onboarding__option-title">${opt.label}</div>
                  <div class="onboarding__option-desc">${opt.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="onboarding__nav">
          <button class="onboarding__nav-btn onboarding__nav-btn--secondary" onclick="prevOnboardingStep()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            ${lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary ${!onboardingState.data.timeline || !onboardingState.data.budget ? 'onboarding__nav-btn--disabled' : ''}" onclick="nextOnboardingStep()" ${!onboardingState.data.timeline || !onboardingState.data.budget ? 'disabled' : ''}>
            ${lang === 'de' ? 'Weiter' : 'Next'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      `;
      
    case 'contact':
      return `
        <div class="onboarding__form">
          <div class="onboarding__field">
            <label>${lang === 'de' ? 'Name *' : 'Name *'}</label>
            <input type="text" id="onboarding-name" value="${onboardingState.data.name}" onchange="updateOnboardingData('name', this.value)" required>
          </div>
          <div class="onboarding__field">
            <label>${lang === 'de' ? 'E-Mail *' : 'Email *'}</label>
            <input type="email" id="onboarding-email" value="${onboardingState.data.email}" onchange="updateOnboardingData('email', this.value)" required>
          </div>
          <div class="onboarding__field">
            <label>${lang === 'de' ? 'Telefon' : 'Phone'}</label>
            <input type="tel" id="onboarding-phone" value="${onboardingState.data.phone}" onchange="updateOnboardingData('phone', this.value)">
          </div>
          <div class="onboarding__field">
            <label>${lang === 'de' ? 'Firma' : 'Company'}</label>
            <input type="text" id="onboarding-company" value="${onboardingState.data.company}" onchange="updateOnboardingData('company', this.value)">
          </div>
        </div>
        <div class="onboarding__nav">
          <button class="onboarding__nav-btn onboarding__nav-btn--secondary" onclick="prevOnboardingStep()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            ${lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary" onclick="nextOnboardingStep()">
            ${lang === 'de' ? 'Zusammenfassung' : 'Summary'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      `;
      
    case 'summary':
      return `
        <div class="onboarding__summary">
          <h3 class="onboarding__summary-title">${lang === 'de' ? 'Ihre Anfrage' : 'Your Request'}</h3>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'Website-Typ' : 'Website Type'}</span>
            <span class="onboarding__summary-value">${getWebsiteTypeLabel(onboardingState.data.websiteType, lang)}</span>
          </div>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'Ziele' : 'Goals'}</span>
            <span class="onboarding__summary-value">${onboardingState.data.goals.map(g => getGoalLabel(g, lang)).join(', ')}</span>
          </div>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'Budget' : 'Budget'}</span>
            <span class="onboarding__summary-value">${getBudgetLabel(onboardingState.data.budget, lang)}</span>
          </div>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'Timeline' : 'Timeline'}</span>
            <span class="onboarding__summary-value">${getTimelineLabel(onboardingState.data.timeline, lang)}</span>
          </div>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'Name' : 'Name'}</span>
            <span class="onboarding__summary-value">${onboardingState.data.name}</span>
          </div>
          
          <div class="onboarding__summary-item">
            <span class="onboarding__summary-label">${lang === 'de' ? 'E-Mail' : 'Email'}</span>
            <span class="onboarding__summary-value">${onboardingState.data.email}</span>
          </div>
        </div>
        
        ${lang === 'de' 
          ? '<p style="margin-top: var(--space-4); font-size: 0.875rem; color: var(--color-text-muted);">Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>'
          : '<p style="margin-top: var(--space-4); font-size: 0.875rem; color: var(--color-text-muted);">We will contact you within 24 hours.</p>'}
        
        <div class="onboarding__nav">
          <button class="onboarding__nav-btn onboarding__nav-btn--secondary" onclick="prevOnboardingStep()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            ${lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <button class="onboarding__nav-btn onboarding__nav-btn--primary" onclick="submitOnboarding()">
            ${lang === 'de' ? 'Anfrage absenden' : 'Submit Request'}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      `;
      
    default:
      return '';
  }
}

/**
 * Get website type label
 */
function getWebsiteTypeLabel(id, lang) {
  const types = onboardingConfig.options.websiteType[lang];
  const type = types.find(t => t.id === id);
  return type ? type.label : id;
}

/**
 * Get goal label
 */
function getGoalLabel(id, lang) {
  const goals = onboardingConfig.options.goals[lang];
  const goal = goals.find(g => g.id === id);
  return goal ? goal.label : id;
}

/**
 * Get budget label
 */
function getBudgetLabel(id, lang) {
  const budgets = onboardingConfig.options.budget[lang];
  const budget = budgets.find(b => b.id === id);
  return budget ? budget.label : id;
}

/**
 * Get timeline label
 */
function getTimelineLabel(id, lang) {
  const timelines = onboardingConfig.options.timeline[lang];
  const timeline = timelines.find(t => t.id === id);
  return timeline ? timeline.label : id;
}

/**
 * Attach onboarding handlers
 */
function attachOnboardingHandlers() {
  // Form input handlers are inline in renderStepContent
}

/**
 * Select onboarding option (single select)
 */
function selectOnboardingOption(key, value) {
  onboardingState.data[key] = value;
  renderOnboarding();
}

/**
 * Toggle onboarding goal (multi select)
 */
function toggleOnboardingGoal(goalId) {
  const index = onboardingState.data.goals.indexOf(goalId);
  if (index === -1) {
    onboardingState.data.goals.push(goalId);
  } else {
    onboardingState.data.goals.splice(index, 1);
  }
  renderOnboarding();
}

/**
 * Update onboarding data
 */
function updateOnboardingData(key, value) {
  onboardingState.data[key] = value;
}

/**
 * Next onboarding step
 */
function nextOnboardingStep() {
  if (onboardingState.currentStep < onboardingConfig.steps.length - 1) {
    onboardingState.currentStep++;
    renderOnboarding();
    
    // Track step
    if (window.journeyTrack) {
      window.journeyTrack.track('onboarding_step_' + (onboardingState.currentStep + 1));
    }
  }
}

/**
 * Previous onboarding step
 */
function prevOnboardingStep() {
  if (onboardingState.currentStep > 0) {
    onboardingState.currentStep--;
    renderOnboarding();
  }
}

/**
 * Submit onboarding
 */
function submitOnboarding() {
  const lang = getOnboardingLang();
  
  // Save to localStorage
  localStorage.setItem('devmiro-onboarding', JSON.stringify(onboardingState.data));
  
  // Show success
  const container = document.getElementById('onboarding');
  if (container) {
    container.innerHTML = `
      <section class="onboarding">
        <div class="container">
          <div class="onboarding__container">
            <div class="onboarding__card">
              <div class="onboarding__success">
                <div class="onboarding__success-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 class="onboarding__success-title">${lang === 'de' ? 'Vielen Dank!' : 'Thank you!'}</h2>
                <p class="onboarding__success-text">
                  ${lang === 'de' 
                    ? 'Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns innerhalb von 24 Stunden bei Ihnen.' 
                    : 'Your request has been submitted successfully. We will contact you within 24 hours.'}
                </p>
                <a href="/" class="onboarding__nav-btn onboarding__nav-btn--primary">
                  ${lang === 'de' ? 'Zurück zur Startseite' : 'Back to Homepage'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  // Track submission
  if (window.journeyTrack) {
    window.journeyTrack.track('onboarding_complete', onboardingState.data);
  }
  
  // Send data to CRM
  if (window.submitToHubSpot) {
    window.submitToHubSpot(onboardingState.data);
  }
}

// Export for global use
window.onboardingConfig = onboardingConfig;
window.selectOnboardingOption = selectOnboardingOption;
window.toggleOnboardingGoal = toggleOnboardingGoal;
window.updateOnboardingData = updateOnboardingData;
window.nextOnboardingStep = nextOnboardingStep;
window.prevOnboardingStep = prevOnboardingStep;
window.submitOnboarding = submitOnboarding;