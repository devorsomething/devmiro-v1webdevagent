/* AI Chatbot JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initChatbot();
});

/**
 * Chatbot Configuration
 */
const chatbotConfig = {
  // API Configuration (replace with your backend endpoint)
  apiEndpoint: '/api/chatbot',
  
  // Welcome message
  welcomeMessage: {
    de: 'Hallo! 👋 Ich bin der DevMiro Assistant. Wie kann ich Ihnen heute helfen?',
    en: 'Hello! 👋 I am the DevMiro Assistant. How can I help you today?'
  },
  
  // Quick actions
  quickActions: {
    de: [
      { label: 'Website Angebot', action: 'offer' },
      { label: 'Hosting Info', action: 'hosting' },
      { label: 'Kontakt aufnehmen', action: 'contact' },
      { label: 'Support', action: 'support' }
    ],
    en: [
      { label: 'Website Quote', action: 'offer' },
      { label: 'Hosting Info', action: 'hosting' },
      { label: 'Contact Us', action: 'contact' },
      { label: 'Support', action: 'support' }
    ]
  },
  
  // Responses for quick actions
  quickResponses: {
    de: {
      offer: 'Gerne! Für ein unverbindliches Website-Angebot brauche ich einige Informationen:\n\n• Welche Art von Website benötigen Sie?\n• Welche Funktionen sind wichtig?\n• Haben Sie bereits ein Design oder Texte?\n\nSie können auch direkt unser Kontaktformular ausfüllen oder uns unter +43 660 1234 5678 anrufen.',
      hosting: 'Wir bieten verschiedene Hosting-Pakete an:\n\n• **Basic** ab €15/Monat\n• **Professional** ab €29/Monat\n• **Enterprise** ab €59/Monat\n\nAlle Pakete include:\n• Kostenloses SSL\n• 99.9% Uptime\n• Tägliche Backups\n• CDN Integration\n\nMöchten Sie mehr Details zu einem bestimmten Paket?',
      contact: 'Sie können uns auf folgenden Wegen erreichen:\n\n📧 info@devmiro.at\n📞 +43 660 1234 5678\n💬 WhatsApp: +43 660 1234 5678\n\nOder füllen Sie einfach unser Kontaktformular aus - wir melden uns innerhalb von 24 Stunden!',
      support: 'Für technischen Support bieten wir:\n\n• **Basic Support**: E-Mail Support\n• **Professional Support**: E-Mail + Phone Support\n• **Premium Support**: 24/7 Verfügbarkeit\n\nBei akuten Problemen erreichen Sie uns am schnellsten per WhatsApp!'
    },
    en: {
      offer: 'Gladly! For a non-binding website quote, I need some information:\n\n• What type of website do you need?\n• Which features are important?\n• Do you already have a design or texts?\n\nYou can also fill out our contact form or call us at +43 660 1234 5678.',
      hosting: 'We offer various hosting packages:\n\n• **Basic** from €15/month\n• **Professional** from €29/month\n• **Enterprise** from €59/month\n\nAll packages include:\n• Free SSL\n• 99.9% Uptime\n• Daily Backups\n• CDN Integration\n\nWould you like more details on a specific package?',
      contact: 'You can reach us through:\n\n📧 info@devmiro.at\n📞 +43 660 1234 5678\n💬 WhatsApp: +43 660 1234 5678\n\nOr simply fill out our contact form - we will get back to you within 24 hours!',
      support: 'For technical support we offer:\n\n• **Basic Support**: Email Support\n• **Professional Support**: Email + Phone Support\n• **Premium Support**: 24/7 Availability\n\nFor urgent issues, you can reach us fastest via WhatsApp!'
    }
  },
  
  // Error message
  errorMessage: {
    de: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    en: 'Sorry, an error occurred. Please try again later.'
  }
};

/**
 * Get current language
 */
function getChatbotLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Chat State
 */
let chatbotState = {
  isOpen: false,
  messages: [],
  isTyping: false
};

/**
 * Initialize chatbot
 */
function initChatbot() {
  createChatbotHTML();
  attachEventListeners();
}

/**
 * Create chatbot HTML
 */
function createChatbotHTML() {
  const container = document.createElement('div');
  container.className = 'chatbot-float';
  container.innerHTML = `
    <!-- Chat Window -->
    <div class="chatbot-window" id="chatbotWindow">
      <div class="chatbot-window__header">
        <div class="chatbot-window__title">
          <svg class="chatbot-window__title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>DevMiro Assistant</span>
        </div>
        <div class="chatbot-window__status">Online</div>
        <button class="chatbot-window__close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="chatbot-window__messages" id="chatbotMessages">
        <!-- Messages will be added here -->
      </div>
      <div class="chatbot-window__quick-actions" id="chatbotQuickActions">
        <!-- Quick actions will be added here -->
      </div>
      <div class="chatbot-window__input">
        <input type="text" placeholder="${getChatbotLang() === 'de' ? 'Nachricht eingeben...' : 'Type a message...'}" id="chatbotInput" autocomplete="off">
        <button class="chatbot-window__send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Floating Button -->
    <button class="chatbot-float__btn" id="chatbotToggle" aria-label="Open chat">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
      <span class="chatbot-float__badge" id="chatbotBadge" style="display: none;">1</span>
    </button>
  `;
  
  document.body.appendChild(container);
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  const toggleBtn = document.getElementById('chatbotToggle');
  const closeBtn = document.querySelector('.chatbot-window__close');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.querySelector('.chatbot-window__send');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleChatbot);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleChatbot);
  }
  
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Initialize messages
  setTimeout(() => {
    addWelcomeMessage();
  }, 1000);
}

/**
 * Toggle chatbot
 */
function toggleChatbot() {
  const window = document.getElementById('chatbotWindow');
  const toggleBtn = document.getElementById('chatbotToggle');
  
  chatbotState.isOpen = !chatbotState.isOpen;
  
  if (chatbotState.isOpen) {
    window.classList.add('active');
    toggleBtn.classList.add('chatbot-float__btn--active');
    
    // Hide badge
    const badge = document.getElementById('chatbotBadge');
    if (badge) badge.style.display = 'none';
    
    // Focus input
    setTimeout(() => {
      document.getElementById('chatbotInput')?.focus();
    }, 300);
    
    // Track open
    if (window.journeyTrack) {
      window.journeyTrack.track('chatbot_open');
    }
  } else {
    window.classList.remove('active');
    toggleBtn.classList.remove('chatbot-float__btn--active');
  }
}

/**
 * Add welcome message
 */
function addWelcomeMessage() {
  const lang = getChatbotLang();
  const message = chatbotConfig.welcomeMessage[lang] || chatbotConfig.welcomeMessage.de;
  
  addMessage(message, 'bot');
  renderQuickActions();
}

/**
 * Render quick actions
 */
function renderQuickActions() {
  const container = document.getElementById('chatbotQuickActions');
  if (!container) return;
  
  const lang = getChatbotLang();
  const actions = chatbotConfig.quickActions[lang] || chatbotConfig.quickActions.de;
  
  container.innerHTML = actions.map(action => `
    <button class="chatbot-quick-action" data-action="${action.action}">
      ${action.label}
    </button>
  `).join('');
  
  // Add click handlers
  container.querySelectorAll('.chatbot-quick-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleQuickAction(action);
    });
  });
}

/**
 * Handle quick action
 */
function handleQuickAction(action) {
  const lang = getChatbotLang();
  const responses = chatbotConfig.quickResponses[lang] || chatbotConfig.quickResponses.de;
  const response = responses[action];
  
  if (response) {
    addMessage(response, 'bot');
  }
}

/**
 * Add message to chat
 */
function addMessage(text, sender) {
  const messagesContainer = document.getElementById('chatbotMessages');
  if (!messagesContainer) return;
  
  const messageEl = document.createElement('div');
  messageEl.className = `chatbot-message chatbot-message--${sender}`;
  messageEl.textContent = text;
  
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  chatbotState.messages.push({ text, sender });
  
  // Show badge if chat is closed
  if (!chatbotState.isOpen && sender === 'bot') {
    const badge = document.getElementById('chatbotBadge');
    if (badge) badge.style.display = 'flex';
  }
}

/**
 * Show typing indicator
 */
function showTyping() {
  const messagesContainer = document.getElementById('chatbotMessages');
  if (!messagesContainer) return;
  
  const typingEl = document.createElement('div');
  typingEl.className = 'chatbot-message chatbot-message--bot';
  typingEl.id = 'chatbotTyping';
  typingEl.innerHTML = `
    <div class="chatbot-message__typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  
  messagesContainer.appendChild(typingEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  chatbotState.isTyping = true;
}

/**
 * Hide typing indicator
 */
function hideTyping() {
  const typingEl = document.getElementById('chatbotTyping');
  if (typingEl) typingEl.remove();
  chatbotState.isTyping = false;
}

/**
 * Send message
 */
async function sendMessage() {
  const input = document.getElementById('chatbotInput');
  if (!input) return;
  
  const text = input.value.trim();
  if (!text) return;
  
  // Add user message
  addMessage(text, 'user');
  input.value = '';
  
  // Show typing
  showTyping();
  
  try {
    const response = await getBotResponse(text);
    hideTyping();
    addMessage(response, 'bot');
  } catch (error) {
    hideTyping();
    const lang = getChatbotLang();
    addMessage(chatbotConfig.errorMessage[lang] || chatbotConfig.errorMessage.de, 'bot');
  }
}

/**
 * Get bot response
 */
async function getBotResponse(userMessage) {
  const lang = getChatbotLang();
  
  // Demo mode - simple keyword matching
  const lowerMessage = userMessage.toLowerCase();
  
  // Predefined responses
  if (lowerMessage.includes('preis') || lowerMessage.includes('kost') || lowerMessage.includes('cost')) {
    return lang === 'de' 
      ? 'Unsere Website-Preise beginnen bei €1.500 für eine einfache Website. Für ein individuelles Angebot füllen Sie bitte unser Kontaktformular aus.'
      : 'Our website prices start at €1,500 for a simple website. For an individual quote, please fill out our contact form.';
  }
  
  if (lowerMessage.includes('kontakt') || lowerMessage.includes('email') || lowerMessage.includes('telefon')) {
    return lang === 'de'
      ? 'Sie erreichen uns unter:\n📧 info@devmiro.at\n📞 +43 660 1234 5678'
      : 'You can reach us at:\n📧 info@devmiro.at\n📞 +43 660 1234 5678';
  }
  
  if (lowerMessage.includes('hosting') || lowerMessage.includes('server')) {
    return lang === 'de'
      ? 'Wir bieten Hosting ab €15/Monat mit kostenlosem SSL, 99.9% Uptime und täglichen Backups.'
      : 'We offer hosting from €15/month with free SSL, 99.9% uptime and daily backups.';
  }
  
  if (lowerMessage.includes('danke') || lowerMessage.includes('thanks')) {
    return lang === 'de'
      ? 'Gerne geschehen! Gibt es noch etwas, das ich für Sie tun kann?'
      : 'You are welcome! Is there anything else I can help you with?';
  }
  
  if (lowerMessage.includes('hilfe') || lowerMessage.includes('help')) {
    return lang === 'de'
      ? 'Ich kann Ihnen bei folgenden Themen helfen:\n• Website-Angebote\n• Hosting-Informationen\n• Kontaktaufnahme\n• Technischer Support\n\nWas möchten Sie wissen?'
      : 'I can help you with:\n• Website quotes\n• Hosting information\n• Contact us\n• Technical support\n\nWhat would you like to know?';
  }
  
  // Default response
  return lang === 'de'
    ? 'Vielen Dank für Ihre Nachricht! Um Ihnen bestmöglich zu helfen, würde ich Sie gerne an einen unserer Experten weiterleiten. Bitte füllen Sie unser Kontaktformular aus oder rufen Sie uns an.'
    : 'Thank you for your message! To best help you, I would like to connect you with one of our experts. Please fill out our contact form or call us.';
}

// Export for global use
window.chatbotConfig = chatbotConfig;
window.toggleChatbot = toggleChatbot;
window.addMessage = addMessage;