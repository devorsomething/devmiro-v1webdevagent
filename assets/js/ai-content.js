/* AI Content Generator JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAIGenerator();
});

/**
 * AI Content Generator Configuration
 */
const aiContentConfig = {
  // Content types
  types: [
    { id: 'headline', name: { de: 'Überschrift', en: 'Headline' }, icon: '📝' },
    { id: 'paragraph', name: { de: 'Textabsatz', en: 'Paragraph' }, icon: '📄' },
    { id: 'cta', name: { de: 'Call-to-Action', en: 'Call-to-Action' }, icon: '🎯' },
    { id: 'faq', name: { de: 'FAQ Antwort', en: 'FAQ Answer' }, icon: '❓' },
    { id: 'meta', name: { de: 'Meta Description', en: 'Meta Description' }, icon: '🔍' },
    { id: 'social', name: { de: 'Social Media Post', en: 'Social Post' }, icon: '📱' }
  ],
  
  // Tone options
  tones: [
    { id: 'professional', name: { de: 'Professionell', en: 'Professional' } },
    { id: 'friendly', name: { de: 'Freundlich', en: 'Friendly' } },
    { id: 'persuasive', name: { de: 'Überzeugend', en: 'Persuasive' } },
    { id: 'technical', name: { de: 'Technisch', en: 'Technical' } }
  ],
  
  // Length options
  lengths: [
    { id: 'short', name: { de: 'Kurz', en: 'Short' }, chars: 100 },
    { id: 'medium', name: { de: 'Mittel', en: 'Medium' }, chars: 250 },
    { id: 'long', name: { de: 'Lang', en: 'Long' }, chars: 500 }
  ],
  
  // API Configuration (placeholder for actual API)
  apiEndpoint: '/api/ai/generate',
  apiKey: 'YOUR_API_KEY'
};

/**
 * AI Generator State
 */
let aiGeneratorState = {
  type: 'headline',
  tone: 'professional',
  length: 'medium',
  topic: '',
  generatedContent: '',
  history: []
};

/**
 * Get current language
 */
function getAIGeneratorLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize AI generator
 */
function initAIGenerator() {
  const container = document.getElementById('ai-generator');
  if (!container) return;
  
  renderAIGenerator();
}

/**
 * Render AI generator
 */
function renderAIGenerator() {
  const container = document.getElementById('ai-generator');
  if (!container) return;
  
  const lang = getAIGeneratorLang();
  
  container.innerHTML = `
    <section class="ai-generator">
      <div class="container">
        <div class="ai-generator__container">
          <div class="ai-generator__header">
            <h2 class="section__title">✨ AI Content Generator</h2>
            <p class="section__subtitle">
              ${lang === 'de' 
                ? 'Erstellen Sie ansprechende Texte mit KI-Unterstützung' 
                : 'Create engaging copy with AI assistance'}
            </p>
          </div>
          
          <div class="ai-generator__form" id="ai-form">
            <!-- Content Type -->
            <div class="ai-generator__field">
              <label class="ai-generator__label">
                ${lang === 'de' ? 'Inhaltstyp' : 'Content Type'}
              </label>
              <div class="ai-generator__options">
                ${aiContentConfig.types.map(t => `
                  <div class="ai-generator__option ${aiGeneratorState.type === t.id ? 'selected' : ''}" onclick="selectAIType('${t.id}')">
                    <span>${t.icon}</span>
                    <span>${t.name[lang] || t.name.de}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Topic -->
            <div class="ai-generator__field">
              <label class="ai-generator__label">
                ${lang === 'de' ? 'Thema / Kontext' : 'Topic / Context'}
              </label>
              <textarea class="ai-generator__textarea" id="ai-topic" placeholder="${
                lang === 'de' 
                  ? 'Beschreiben Sie Ihr Thema oder Ihre Firma...' 
                  : 'Describe your topic or company...'}">${aiGeneratorState.topic}</textarea>
            </div>
            
            <!-- Tone -->
            <div class="ai-generator__field">
              <label class="ai-generator__label">
                ${lang === 'de' ? 'Ton' : 'Tone'}
              </label>
              <div class="ai-generator__options">
                ${aiContentConfig.tones.map(t => `
                  <div class="ai-generator__option ${aiGeneratorState.tone === t.id ? 'selected' : ''}" onclick="selectAITone('${t.id}')">
                    <span>${t.name[lang] || t.name.de}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Length -->
            <div class="ai-generator__field">
              <label class="ai-generator__label">
                ${lang === 'de' ? 'Länge' : 'Length'}
              </label>
              <div class="ai-generator__options">
                ${aiContentConfig.lengths.map(l => `
                  <div class="ai-generator__option ${aiGeneratorState.length === l.id ? 'selected' : ''}" onclick="selectAILength('${l.id}')">
                    <span>${l.name[lang] || l.name.de}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Generate Button -->
            <button class="ai-generator__generate-btn" id="ai-generate-btn" onclick="generateAIContent()">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
              </svg>
              ${lang === 'de' ? 'Text generieren' : 'Generate Content'}
            </button>
          </div>
          
          <!-- Output Area -->
          <div class="ai-generator__output" id="ai-output" style="display: none;">
            <div class="ai-generator__output-header">
              <span>✨ ${lang === 'de' ? 'Generierter Inhalt' : 'Generated Content'}</span>
              <div class="ai-generator__output-actions">
                <button class="ai-generator__action-btn" onclick="copyAIContent()">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  ${lang === 'de' ? 'Kopieren' : 'Copy'}
                </button>
                <button class="ai-generator__action-btn" onclick="regenerateAIContent()">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                  ${lang === 'de' ? 'Neu generieren' : 'Regenerate'}
                </button>
              </div>
            </div>
            <div class="ai-generator__output-content" id="ai-output-content"></div>
          </div>
          
          <!-- Suggestions -->
          <div class="ai-suggestions">
            <div class="ai-suggestions__title">
              ${lang === 'de' ? 'Schnell-Vorlagen' : 'Quick Templates'}
            </div>
            <div class="ai-suggestions__list">
              <div class="ai-suggestions__item" onclick="applySuggestion('hero')">
                🏠 Hero Section
              </div>
              <div class="ai-suggestions__item" onclick="applySuggestion('services')">
                💼 Service Beschreibung
              </div>
              <div class="ai-suggestions__item" onclick="applySuggestion('pricing')">
                💰 Preisgestaltung
              </div>
              <div class="ai-suggestions__item" onclick="applySuggestion('about')">
                👥 Über uns
              </div>
              <div class="ai-suggestions__item" onclick="applySuggestion('faq')">
                ❓ FAQ
              </div>
              <div class="ai-suggestions__item" onclick="applySuggestion('contact')">
                📧 Kontakt
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Select content type
 */
function selectAIType(type) {
  aiGeneratorState.type = type;
  renderAIGenerator();
}

/**
 * Select tone
 */
function selectAITone(tone) {
  aiGeneratorState.tone = tone;
  renderAIGenerator();
}

/**
 * Select length
 */
function selectAILength(length) {
  aiGeneratorState.length = length;
  renderAIGenerator();
}

/**
 * Generate AI content
 */
function generateAIContent() {
  const topic = document.getElementById('ai-topic')?.value;
  if (!topic) {
    showToast('Bitte Thema eingeben', 'warning');
    return;
  }
  
  aiGeneratorState.topic = topic;
  
  // Show loading
  const btn = document.getElementById('ai-generate-btn');
  const output = document.getElementById('ai-output');
  const outputContent = document.getElementById('ai-output-content');
  
  btn.disabled = true;
  btn.innerHTML = `
    <div class="ai-typing">
      <span></span><span></span><span></span>
    </div>
    ${getAIGeneratorLang() === 'de' ? 'Generiere...' : 'Generating...'}
  `;
  
  // Simulate API call (in production, connect to actual AI API)
  setTimeout(() => {
    const content = generateContent(topic, aiGeneratorState.type, aiGeneratorState.tone, aiGeneratorState.length);
    
    aiGeneratorState.generatedContent = content;
    
    // Show output with typing effect
    output.style.display = 'block';
    typeContent(content, outputContent);
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
      </svg>
      ${getAIGeneratorLang() === 'de' ? 'Text generieren' : 'Generate Content'}
    `;
    
    // Add to history
    aiGeneratorState.history.push({
      type: aiGeneratorState.type,
      topic: topic,
      content: content,
      timestamp: Date.now()
    });
    
  }, 1500);
}

/**
 * Generate content (mock - in production use actual AI)
 */
function generateContent(topic, type, tone, length) {
  const lang = getAIGeneratorLang();
  const lengthConfig = aiContentConfig.lengths.find(l => l.id === length);
  const maxChars = lengthConfig?.chars || 250;
  
  // Template responses (in production, connect to AI API)
  const templates = {
    headline: {
      de: [
        `Professionelle Webentwicklung für Ihr Unternehmen`,
        `Ihre digitale Präsenz, neu definiert`,
        `Maßgeschneiderte Lösungen für Ihren Erfolg`
      ],
      en: [
        `Professional Web Development for Your Business`,
        `Your Digital Presence, Redefined`,
        `Tailored Solutions for Your Success`
      ]
    },
    paragraph: {
      de: `Wir bieten hochwertige IT-Dienstleistungen mit Fokus auf moderne Technologien und Benutzererfahrung. Unser Team verbindet technische Expertise mit kreativem Denken, um Ergebnisse zu liefern, die messbar sind.`,
      en: `We provide high-quality IT services with a focus on modern technologies and user experience. Our team combines technical expertise with creative thinking to deliver measurable results.`
    },
    cta: {
      de: `Jetzt beraten lassen und unverbindliches Angebot erhalten →`,
      en: `Get a consultation now and receive a free quote →`
    },
    faq: {
      de: `Wir bieten transparente Preise ohne versteckte Kosten. Jedes Projekt wird individuell kalkuliert, basierend auf Ihren spezifischen Anforderungen und Zielen.`,
      en: `We offer transparent pricing with no hidden costs. Every project is individually calculated based on your specific requirements and goals.`
    },
    meta: {
      de: `DevMiro - Ihr Partner für Webentwicklung, IT-Beratung und digitale Transformation in Vorarlberg. Professionell, zuverlässig und innovativ.`,
      en: `DevMiro - Your partner for web development, IT consulting and digital transformation in Vorarlberg. Professional, reliable and innovative.`
    },
    social: {
      de: `🚀 Neu: Wir haben unsere Services erweitert! Jetzt noch effizientere Lösungen für Ihr Business. Mehr dazu auf unserer Website. #WebDevelopment #DigitalTransformation`,
      en: `🚀 New: We've expanded our services! Now even more efficient solutions for your business. More on our website. #WebDevelopment #DigitalTransformation`
    }
  };
  
  const template = templates[type];
  if (Array.isArray(template)) {
    return template[lang] || template.de;
  }
  return template?.[lang] || template?.de || '';
}

/**
 * Type content effect
 */
function typeContent(content, element, speed = 20) {
  element.textContent = '';
  let i = 0;
  
  const type = () => {
    if (i < content.length) {
      element.textContent += content.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  
  type();
}

/**
 * Copy AI content
 */
function copyAIContent() {
  navigator.clipboard.writeText(aiGeneratorState.generatedContent).then(() => {
    showToast(getAIGeneratorLang() === 'de' ? 'Kopiert!' : 'Copied!', 'success');
  });
}

/**
 * Regenerate content
 */
function regenerateAIContent() {
  generateAIContent();
}

/**
 * Apply suggestion template
 */
function applySuggestion(template) {
  const lang = getAIGeneratorLang();
  
  const suggestions = {
    hero: lang === 'de' 
      ? 'DevMiro IT-Dienstleistungen: Wir entwickeln moderne, performante Websites für Unternehmen in Vorarlberg. Professionell. Zuverlässig. Innovativ.' 
      : 'DevMiro IT Services: We develop modern, high-performance websites for businesses in Vorarlberg. Professional. Reliable. Innovative.',
    services: lang === 'de'
      ? 'Webentwicklung, UX Design, Wartung und Support - alles aus einer Hand.'
      : 'Web development, UX design, maintenance and support - all from one source.',
    pricing: lang === 'de'
      ? 'Transparente Preise ab €1.500 für professionelle Websites. Individuelle Angebote auf Anfrage.'
      : 'Transparent pricing starting at €1,500 for professional websites. Custom quotes on request.',
    about: lang === 'de'
      ? 'DevMiro ist Ihr lokaler Partner für digitale Projekte in Vorarlberg. Mit Leidenschaft für Technologie und Design.'
      : 'DevMiro is your local partner for digital projects in Vorarlberg. With passion for technology and design.',
    faq: lang === 'de'
      ? 'Wie lange dauert die Entwicklung einer Website? Je nach Umfang 2-8 Wochen. Wir arbeiten transparent und halten Sie auf dem Laufenden.'
      : 'How long does website development take? Depending on scope 2-8 weeks. We work transparently and keep you updated.',
    contact: lang === 'de'
      ? 'Kontaktieren Sie uns für ein unverbindliches Erstgespräch. Wir freuen uns auf Ihr Projekt!'
      : 'Contact us for a non-binding initial consultation. We look forward to your project!'
  };
  
  document.getElementById('ai-topic').value = suggestions[template] || '';
  aiGeneratorState.topic = suggestions[template];
}

// Export for global use
window.aiContentConfig = aiContentConfig;
window.selectAIType = selectAIType;
window.selectAITone = selectAITone;
window.selectAILength = selectAILength;
window.generateAIContent = generateAIContent;
window.copyAIContent = copyAIContent;
window.regenerateAIContent = regenerateAIContent;
window.applySuggestion = applySuggestion;