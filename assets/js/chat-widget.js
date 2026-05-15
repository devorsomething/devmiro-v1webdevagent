/* Crisp Chat Widget Integration */

/* 
 * DevMiro Chat Widget - Crisp Integration
 * 
 * Setup:
 * 1. Create free account at crisp.chat
 * 2. Get your Website ID from Settings > Website Settings
 * 3. Replace YOUR_WEBSITE_ID below
 * 4. Customize the settings as needed
 */

(function() {
  // Configuration
  const CRISP_WEBSITE_ID = 'YOUR_WEBSITE_ID'; // Replace with your Crisp Website ID
  
  // Only initialize if not already loaded
  if (window.$crisp) return;
  
  // Set up Crisp
  window.$crisp = [];
  
  // Configuration options
  window.CRISP_TOKEN = CRISP_WEBSITE_ID;
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
  
  // Layout settings
  window.CRISP_POP_POSITION = 'right'; // 'right' or 'left'
  window.CRISP_POP_CHAT_HEIGHT = 450;
  window.CRISP_POP_CHAT_WIDTH = 380;
  window.CRISP_POP_OVERLAY_COLOR = 'rgba(59, 130, 246, 0.95)';
  window.CRISP_POP_TOGGLE_COLOR = '#3B82F6';
  window.CRISP_POP_SHOW_DELAY = 0;
  window.CRISP_POP_HIDE_DELAY = 0;
  
  // Button settings
  window.CRISP_BUTTON_HIDE_ON_DESKTOP = false;
  window.CRISP_BUTTON_COLOR = '#3B82F6';
  window.CRISP_BUTTON_ICON_COLOR = '#ffffff';
  
  // Availability
  window.CRISP_AVAILABLE_FOR_LIVE = true;
  
  // Offline message (German)
  window.CRISP_OFFLINE_TEXT = 'Wir sind gerade nicht verfügbar. Hinterlassen Sie eine Nachricht und wir melden uns schnellstmöglich bei Ihnen!';
  
  // Session information
  window.CRISP_SESSION_KEY = 'crisp_session';
  
  // Load Crisp script
  var d = document;
  var s = d.createElement('script');
  s.src = 'https://client.crisp.chat/l.js';
  s.async = 1;
  d.getElementsByTagName('head')[0].appendChild(s);
  
  // Set session data on load
  s.onload = function() {
    // Set user info if available
    setUserInfo();
    
    // Set custom colors
    $crisp.push(['colors', 'theme:primary', '#3B82F6']);
    $crisp.push(['colors', 'theme:primaryContrast', '#ffffff']);
    $crisp.push(['colors', 'theme:secondary', '#6366F1']);
    $crisp.push(['colors', 'theme:secondaryContrast', '#ffffff']);
    
    // Hide Bubble on Mobile
    if (window.innerWidth < 768) {
      $crisp.push(['config', 'hide_on_mobile', true]);
    }
  };
})();

/* User Info Setting (call this when user logs in or provides info) */
function setCrispUserInfo(userData) {
  if (typeof $crisp !== 'undefined') {
    // Email
    if (userData.email) {
      $crisp.push(['set', 'user_email', [userData.email]]);
    }
    
    // Name
    if (userData.name) {
      $crisp.push(['set', 'user_nickname', [userData.name]]);
    }
    
    // Phone
    if (userData.phone) {
      $crisp.push(['set', 'user_phone', [userData.phone]]);
    }
    
    // Company
    if (userData.company) {
      $crisp.push(['set', 'company:name', [userData.company]]); // Not native, used as custom
    }
    
    // Avatar
    if (userData.avatar) {
      $crisp.push(['set', 'user_avatar', [userData.avatar]]);
    }
    
    // Custom data
    $crisp.push(['set', 'session:data', [
      [
        { key: 'source', value: userData.source || 'website' },
        { key: 'lang', value: 'de' }
      ]
    ]]);
  }
}

/* Open Chat Function */
function openCrispChat() {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['do', 'chat:open']);
  }
}

/* Close Chat Function */
function closeCrispChat() {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['do', 'chat:close']);
  }
}

/* Send Message Function */
function sendCrispMessage(message) {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['do', 'message:send', [message]]);
  }
}

/* Show Chat (if hidden) */
function showCrispChat() {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['do', 'chat:show']);
  }
}

/* Hide Chat */
function hideCrispChat() {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['do', 'chat:hide']);
  }
}

/* Track Event */
function crispTrackEvent(eventName, eventData) {
  if (typeof $crisp !== 'undefined') {
    $crisp.push(['track', eventName, eventData]);
  }
}

/* Canned Responses (for DevMiro - German) */
const crispCannedResponses = {
  greeting: [
    'Hallo! Schön, dass Sie sich für DevMiro interessieren. Wie kann ich Ihnen helfen? 😊',
    'Guten Tag! Ich bin hier um zu helfen. Was möchten Sie wissen?'
  ],
  pricing: [
    'Unsere typischen Projektzeiten sind: Landing Page 1-2 Wochen, Business Website 2-4 Wochen, Enterprise 4-8 Wochen.',
    'Wir bieten transparente Festpreise. Welche Art von Projekt haben Sie im Sinn?'
  ],
  contact: [
    'Für ein unverbindliches Erstgespräch können Sie direkt einen Termin buchen unter: devmiro.at/contact',
    'Ich würde mich freuen, Sie in einem kostenlosen 30-Minuten-Gespräch kennenzulernen!'
  ],
  availability: [
    'Wir antworten in der Regel innerhalb von 24 Stunden auf Nachrichten.',
    'Bei dringenden Anliegen erreichen Sie uns auch per WhatsApp: +43 676 1234 567'
  ],
  services: [
    'Wir bieten Website-Erstellung, Web Hosting, Managed Services und Cloud Solutions.',
    'Mehr über unsere Leistungen finden Sie unter: devmiro.at/services'
  ]
};

// Export functions for global use
window.openCrispChat = openCrispChat;
window.closeCrispChat = closeCrispChat;
window.sendCrispMessage = sendCrispMessage;
window.showCrispChat = showCrispChat;
window.hideCrispChat = hideCrispChat;
window.setCrispUserInfo = setCrispUserInfo;
window.crispTrackEvent = crispTrackEvent;
window.crispCannedResponses = crispCannedResponses;