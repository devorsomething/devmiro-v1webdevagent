/* Voice Search Integration JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initVoiceSearch();
});

/**
 * Voice Search Configuration
 */
const voiceConfig = {
  // Speech Recognition API
  continuous: false,
  interimResults: true,
  lang: 'de-DE',
  
  // Commands
  commands: {
    de: {
      'startseite': '/',
      'home': '/',
      'kontakt': '/kontakt',
      'services': '/services',
      'portfolio': '/portfolio',
      'preise': '/preise',
      'blog': '/blog',
      'anfang': 'scroll-top',
      'zurück': 'history-back',
      'weiter': 'history-forward',
      'suche': 'focus-search'
    },
    en: {
      'home': '/',
      'contact': '/contact',
      'services': '/services',
      'portfolio': '/portfolio',
      'pricing': '/pricing',
      'blog': '/blog',
      'top': 'scroll-top',
      'back': 'history-back',
      'forward': 'history-forward',
      'search': 'focus-search'
    }
  },
  
  // Feedback messages
  feedback: {
    de: {
      listening: 'Ich höre...',
      processing: 'Verarbeite...',
      noMatch: 'Befehl nicht erkannt',
      success: 'Ausgeführt!',
      error: 'Fehler bei der Spracherkennung'
    },
    en: {
      listening: 'Listening...',
      processing: 'Processing...',
      noMatch: 'Command not recognized',
      success: 'Executed!',
      error: 'Speech recognition error'
    }
  }
};

/**
 * Voice Search State
 */
let voiceState = {
  isListening: false,
  recognition: null,
  lastTranscript: ''
};

/**
 * Get current language
 */
function getVoiceLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize voice search
 */
function initVoiceSearch() {
  // Check for Web Speech API support
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Speech recognition not supported');
    return;
  }
  
  // Create speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceState.recognition = new SpeechRecognition();
  
  // Configure
  voiceState.recognition.continuous = voiceConfig.continuous;
  voiceState.recognition.interimResults = voiceConfig.interimResults;
  voiceState.recognition.lang = voiceConfig.lang;
  
  // Event handlers
  voiceState.recognition.onstart = () => {
    voiceState.isListening = true;
    updateVoiceUI(true);
    showVoiceFeedback('listening');
  };
  
  voiceState.recognition.onresult = (event) => {
    let transcript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    
    voiceState.lastTranscript = transcript;
    showVoiceFeedback('processing');
    
    // Process final results
    if (event.results[event.results.length - 1].isFinal) {
      processVoiceCommand(transcript);
    }
  };
  
  voiceState.recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    voiceState.isListening = false;
    updateVoiceUI(false);
    
    const lang = getVoiceLang();
    showVoiceFeedback('error');
  };
  
  voiceState.recognition.onend = () => {
    voiceState.isListening = false;
    updateVoiceUI(false);
  };
  
  // Create voice button
  createVoiceButton();
  
  // Add keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleVoiceSearch();
    }
  });
}

/**
 * Create voice button
 */
function createVoiceButton() {
  const searchForms = document.querySelectorAll('.search-form, .header__search');
  
  searchForms.forEach(form => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'voice-search__btn';
    btn.setAttribute('aria-label', getVoiceLang() === 'de' ? 'Sprachsuche' : 'Voice Search');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
      </svg>
      <div class="voice-search__wave">
        <div class="voice-search__bar"></div>
        <div class="voice-search__bar"></div>
        <div class="voice-search__bar"></div>
        <div class="voice-search__bar"></div>
        <div class="voice-search__bar"></div>
      </div>
    `;
    btn.onclick = toggleVoiceSearch;
    
    form.appendChild(btn);
  });
}

/**
 * Toggle voice search
 */
function toggleVoiceSearch() {
  if (voiceState.isListening) {
    stopVoiceSearch();
  } else {
    startVoiceSearch();
  }
}

/**
 * Start voice search
 */
function startVoiceSearch() {
  if (voiceState.recognition) {
    // Update language
    voiceState.recognition.lang = getVoiceLang() === 'de' ? 'de-DE' : 'en-US';
    voiceState.recognition.start();
  }
}

/**
 * Stop voice search
 */
function stopVoiceSearch() {
  if (voiceState.recognition) {
    voiceState.recognition.stop();
  }
}

/**
 * Update voice UI
 */
function updateVoiceUI(isListening) {
  const btns = document.querySelectorAll('.voice-search__btn');
  btns.forEach(btn => {
    if (isListening) {
      btn.classList.add('listening');
    } else {
      btn.classList.remove('listening');
    }
  });
}

/**
 * Show voice feedback
 */
function showVoiceFeedback(type) {
  const lang = getVoiceLang();
  const messages = voiceConfig.feedback[lang] || voiceConfig.feedback.de;
  
  let message = '';
  switch (type) {
    case 'listening':
      message = messages.listening;
      break;
    case 'processing':
      message = messages.processing;
      break;
    case 'error':
      message = messages.error;
      break;
    case 'success':
      message = messages.success;
      break;
    case 'no-match':
      message = messages.noMatch;
      break;
  }
  
  // Remove existing feedback
  const existing = document.querySelector('.voice-feedback');
  if (existing) existing.remove();
  
  if (type !== 'success') {
    const feedback = document.createElement('div');
    feedback.className = 'voice-feedback active';
    feedback.innerHTML = `
      <div class="voice-feedback__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" class="voice-feedback__mic">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      </div>
      <span>${message}</span>
    `;
    
    document.body.appendChild(feedback);
    
    // Auto-hide after 3 seconds
    if (type !== 'listening') {
      setTimeout(() => {
        feedback.classList.remove('active');
        setTimeout(() => feedback.remove(), 300);
      }, 3000);
    }
  }
}

/**
 * Process voice command
 */
function processVoiceCommand(transcript) {
  const lang = getVoiceLang();
  const commands = voiceConfig.commands[lang] || voiceConfig.commands.de;
  
  const normalizedTranscript = transcript.toLowerCase().trim();
  
  // Check for command match
  let matchedCommand = null;
  for (const [key, action] of Object.entries(commands)) {
    if (normalizedTranscript.includes(key)) {
      matchedCommand = action;
      break;
    }
  }
  
  if (matchedCommand) {
    executeCommand(matchedCommand);
    showVoiceFeedback('success');
  } else {
    showVoiceFeedback('no-match');
  }
  
  // Hide listening indicator
  updateVoiceUI(false);
}

/**
 * Execute command
 */
function executeCommand(command) {
  switch (command) {
    case 'scroll-top':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'history-back':
      window.history.back();
      break;
    case 'history-forward':
      window.history.forward();
      break;
    case 'focus-search':
      const searchInput = document.querySelector('.search-form input, .header__search input');
      if (searchInput) searchInput.focus();
      break;
    default:
      // Navigate to URL
      if (command.startsWith('/') || command.startsWith('http')) {
        window.location.href = command;
      }
  }
  
  // Track command execution
  if (window.journeyTrack) {
    window.journeyTrack.track('voice_command', { command });
  }
}

/**
 * Search with voice results
 */
function searchWithVoice(query) {
  // Update search input
  const searchInput = document.querySelector('.search-form input, .header__search input');
  if (searchInput) {
    searchInput.value = query;
    searchInput.dispatchEvent(new Event('input'));
  }
  
  // Submit search
  const searchForm = searchInput?.closest('form');
  if (searchForm) {
    searchForm.submit();
  }
}

// Export for global use
window.voiceConfig = voiceConfig;
window.toggleVoiceSearch = toggleVoiceSearch;
window.startVoiceSearch = startVoiceSearch;
window.stopVoiceSearch = stopVoiceSearch;