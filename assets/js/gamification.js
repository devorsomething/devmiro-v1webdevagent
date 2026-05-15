/* Gamification & Rewards System JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initGamification();
});

/**
 * Gamification Configuration
 */
const gamificationConfig = {
  enabled: true,
  pointsName: 'Punkte',
  currencyName: 'DevMünzen',
  
  // Level thresholds
  levels: [
    { level: 1, name: 'Neuling', minXP: 0 },
    { level: 2, name: 'Einsteiger', minXP: 100 },
    { level: 3, name: 'Fortgeschritten', minXP: 500 },
    { level: 4, name: 'Experte', minXP: 1000 },
    { level: 5, name: 'Master', minXP: 2500 },
    { level: 6, name: 'Champion', minXP: 5000 },
    { level: 7, name: 'Legend', minXP: 10000 }
  ],
  
  // Achievements
  achievements: [
    { id: 'first_visit', name: 'Willkommen', description: 'Erste Besuch', icon: '👋', points: 10, condition: 'visit' },
    { id: 'explorer', name: 'Entdecker', description: '3 Seiten besucht', icon: '🔍', points: 25, condition: 'pages_3' },
    { id: 'engaged', name: 'Engagiert', description: '5 Minuten auf der Seite', icon: '⏱️', points: 50, condition: 'time_5' },
    { id: 'social_share', name: 'Social Butterfly', description: 'Seite geteilt', icon: '📤', points: 75, condition: 'share' },
    { id: 'contact', name: 'Kontaktfreudig', description: 'Kontakt aufgenommen', icon: '💬', points: 100, condition: 'contact' },
    { id: 'repeat', name: 'Wiederkehrend', description: '3 Tage hintereinander besucht', icon: '🔥', points: 150, condition: 'streak_3' },
    { id: 'newsletter', name: 'Informiert', description: 'Newsletter abonniert', icon: '📧', points: 50, condition: 'newsletter' },
    { id: 'dark_mode', name: 'Nachteule', description: 'Dark Mode aktiviert', icon: '🦉', points: 25, condition: 'dark_mode' }
  ],
  
  // Rewards catalog
  rewards: [
    { id: 'discount_10', name: '10% Rabatt', icon: '🎫', cost: 500, type: 'discount' },
    { id: 'discount_20', name: '20% Rabatt', icon: '🎟️', cost: 1000, type: 'discount' },
    { id: 'free_consultation', name: 'Kostenlose Beratung', icon: '💎', cost: 2000, type: 'service' },
    { id: 'priority_support', name: 'Priority Support (1 Monat)', icon: '⚡', cost: 1500, type: 'subscription' }
  ],
  
  // Points actions
  pointValues: {
    visit: 5,
    page_view: 2,
    time_spent: 1, // per minute
    share: 25,
    contact: 50,
    newsletter_signup: 30,
    referral: 100
  }
};

/**
 * Gamification State
 */
let gamificationState = {
  points: 0,
  level: 1,
  xp: 0,
  streak: 0,
  lastVisit: null,
  achievements: [],
  rewards: [],
  history: []
};

/**
 * Initialize gamification
 */
function initGamification() {
  if (!gamificationConfig.enabled) return;
  
  // Load state
  loadGamificationState();
  
  // Track current visit
  trackVisit();
  
  // Check achievements
  checkAchievements();
  
  // Render UI
  renderGamificationUI();
  
  // Listen for actions
  setupActionListeners();
}

/**
 * Load gamification state
 */
function loadGamificationState() {
  const saved = localStorage.getItem('devmiro_gamification');
  if (saved) {
    gamificationState = { ...gamificationState, ...JSON.parse(saved) };
  }
  
  // Check streak
  checkStreak();
}

/**
 * Save gamification state
 */
function saveGamificationState() {
  localStorage.setItem('devmiro_gamification', JSON.stringify(gamificationState));
}

/**
 * Check daily streak
 */
function checkStreak() {
  const today = new Date().toDateString();
  const lastVisit = gamificationState.lastVisit;
  
  if (lastVisit) {
    const lastVisitDate = new Date(lastVisit).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastVisitDate === yesterday) {
      gamificationState.streak++;
    } else if (lastVisitDate !== today) {
      gamificationState.streak = 0;
    }
  }
}

/**
 * Track visit
 */
function trackVisit() {
  const today = new Date().toDateString();
  
  if (gamificationState.lastVisit !== today) {
    // New day = award daily points
    addPoints(gamificationConfig.pointValues.visit, 'Täglicher Besuch');
    gamificationState.lastVisit = Date.now();
    
    // Increment streak if consecutive
    if (gamificationState.streak > 0) {
      gamificationState.streak++;
    } else {
      gamificationState.streak = 1;
    }
    
    saveGamificationState();
  }
  
  // Track page views
  trackPageView();
}

/**
 * Track page view
 */
function trackPageView() {
  addPoints(gamificationConfig.pointValues.page_view, 'Seitenaufruf');
}

/**
 * Add points
 */
function addPoints(points, reason) {
  gamificationState.points += points;
  gamificationState.xp += points;
  
  // Add to history
  gamificationState.history.push({
    points,
    reason,
    timestamp: Date.now()
  });
  
  // Keep only last 50
  gamificationState.history = gamificationState.history.slice(-50);
  
  // Check level up
  checkLevelUp();
  
  // Update UI
  updatePointsDisplay();
  
  saveGamificationState();
}

/**
 * Check level up
 */
function checkLevelUp() {
  const levels = gamificationConfig.levels;
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (gamificationState.xp >= levels[i].minXP) {
      if (gamificationState.level !== levels[i].level) {
        const oldLevel = gamificationState.level;
        gamificationState.level = levels[i].level;
        
        if (oldLevel < gamificationState.level) {
          showLevelUp(levels[i]);
        }
      }
      break;
    }
  }
}

/**
 * Show level up
 */
function showLevelUp(level) {
  showAchievement({
    icon: '🎉',
    title: `Level ${level.level} erreicht!`,
    description: `Du bist jetzt ein ${level.name}`,
    points: Math.floor(level.minXP / 10)
  });
}

/**
 * Check achievements
 */
function checkAchievements() {
  const pageViews = parseInt(localStorage.getItem('devmiro_page_view_count') || '0');
  const timeSpent = parseInt(sessionStorage.getItem('devmiro_time_spent') || '0');
  
  gamificationConfig.achievements.forEach(achievement => {
    if (gamificationState.achievements.includes(achievement.id)) return;
    
    let unlocked = false;
    
    switch (achievement.condition) {
      case 'visit':
        unlocked = true;
        break;
      case 'pages_3':
        unlocked = pageViews >= 3;
        break;
      case 'time_5':
        unlocked = timeSpent >= 300;
        break;
      case 'share':
        // Check if shared
        break;
      case 'contact':
        // Check if contacted
        break;
      case 'streak_3':
        unlocked = gamificationState.streak >= 3;
        break;
    }
    
    if (unlocked) {
      unlockAchievement(achievement);
    }
  });
}

/**
 * Unlock achievement
 */
function unlockAchievement(achievement) {
  gamificationState.achievements.push(achievement.id);
  addPoints(achievement.points, `Achievement: ${achievement.name}`);
  
  showAchievement(achievement);
  saveGamificationState();
}

/**
 * Show achievement popup
 */
function showAchievement(achievement) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <div class="achievement-popup__icon">${achievement.icon}</div>
    <h3 class="achievement-popup__title">${achievement.title || achievement.name}</h3>
    <p class="achievement-popup__desc">${achievement.description}</p>
    ${achievement.points ? `
      <div class="achievement-popup__points">
        ⭐ +${achievement.points} ${gamificationConfig.pointsName}
      </div>
    ` : ''}
  `;
  
  document.body.appendChild(popup);
  
  // Remove after 4 seconds
  setTimeout(() => {
    popup.style.animation = 'achievementPop 0.3s ease reverse';
    setTimeout(() => popup.remove(), 300);
  }, 4000);
}

/**
 * Render gamification UI
 */
function renderGamificationUI() {
  // Create points badge
  const badge = document.createElement('div');
  badge.className = 'points-badge';
  badge.id = 'points-badge';
  badge.onclick = showGamificationPanel;
  badge.innerHTML = `
    <div class="points-badge__header">${gamificationConfig.pointsName}</div>
    <div class="points-badge__value">
      <span id="points-value">${gamificationState.points.toLocaleString()}</span>
    </div>
    <div class="points-badge__label">Level ${gamificationState.level}</div>
    <div class="points-badge__progress">
      <div class="points-badge__progress-fill" id="points-progress" style="width: ${getLevelProgress()}%;"></div>
    </div>
  `;
  
  document.body.appendChild(badge);
  
  // Show daily streak if active
  if (gamificationState.streak >= 3) {
    showDailyStreak();
  }
}

/**
 * Get level progress
 */
function getLevelProgress() {
  const levels = gamificationConfig.levels;
  const currentLevel = levels.find(l => l.level === gamificationState.level);
  const nextLevel = levels.find(l => l.level === gamificationState.level + 1);
  
  if (!nextLevel) return 100;
  
  const currentXP = gamificationState.xp - currentLevel.minXP;
  const neededXP = nextLevel.minXP - currentLevel.minXP;
  
  return Math.min(100, (currentXP / neededXP) * 100);
}

/**
 * Update points display
 */
function updatePointsDisplay() {
  const valueEl = document.getElementById('points-value');
  const progressEl = document.getElementById('points-progress');
  
  if (valueEl) valueEl.textContent = gamificationState.points.toLocaleString();
  if (progressEl) progressEl.style.width = getLevelProgress() + '%';
}

/**
 * Show daily streak
 */
function showDailyStreak() {
  const streak = document.createElement('div');
  streak.className = 'daily-streak';
  streak.id = 'daily-streak';
  streak.innerHTML = `
    <div class="daily-streak__icon">🔥</div>
    <div class="daily-streak__info">
      <div class="daily-streak__label">Daily Streak</div>
      <div class="daily-streak__count">${gamificationState.streak} Tage</div>
    </div>
    <div class="daily-streak__flames">
      ${Array(Math.min(gamificationState.streak, 7)).fill('🔥').map(f => `<span class="daily-streak__flame">${f}</span>`).join('')}
    </div>
  `;
  
  const badge = document.getElementById('points-badge');
  if (badge) {
    badge.parentNode.insertBefore(streak, badge.nextSibling);
  }
}

/**
 * Show gamification panel
 */
function showGamificationPanel() {
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  const panel = document.createElement('div');
  panel.className = 'modal-overlay active';
  panel.id = 'gamification-panel';
  panel.onclick = (e) => { if (e.target === panel) panel.remove(); };
  
  panel.innerHTML = `
    <div class="modal" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
      <div class="modal__header">
        <h2>🏆 ${lang === 'de' ? 'Deine Erfolge' : 'Your Achievements'}</h2>
        <button class="modal__close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal__body">
        <!-- Level Progress -->
        <div class="level-progress">
          <div class="level-progress__header">
            <div class="level-progress__level">
              <div class="level-progress__badge">${gamificationState.level}</div>
              <span>${getLevelName()}</span>
            </div>
            <div class="level-progress__xp">${gamificationState.xp.toLocaleString()} XP</div>
          </div>
          <div class="level-progress__bar">
            <div class="level-progress__bar-fill" style="width: ${getLevelProgress()}%;"></div>
          </div>
        </div>
        
        <!-- Stats -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-bottom: var(--space-6);">
          <div style="text-align: center; padding: var(--space-4); background: var(--color-background-secondary); border-radius: var(--radius-lg);">
            <div style="font-size: 1.5rem;">⭐</div>
            <div style="font-size: 1.25rem; font-weight: 700;">${gamificationState.points.toLocaleString()}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${gamificationConfig.pointsName}</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--color-background-secondary); border-radius: var(--radius-lg);">
            <div style="font-size: 1.5rem;">🔥</div>
            <div style="font-size: 1.25rem; font-weight: 700;">${gamificationState.streak}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Streak</div>
          </div>
          <div style="text-align: center; padding: var(--space-4); background: var(--color-background-secondary); border-radius: var(--radius-lg);">
            <div style="font-size: 1.5rem;">🏅</div>
            <div style="font-size: 1.25rem; font-weight: 700;">${gamificationState.achievements.length}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Achievements</div>
          </div>
        </div>
        
        <!-- Achievements -->
        <h3 style="margin-bottom: var(--space-4);">🎖️ Achievements</h3>
        <div style="display: grid; gap: var(--space-3); margin-bottom: var(--space-6);">
          ${gamificationConfig.achievements.map(a => {
            const unlocked = gamificationState.achievements.includes(a.id);
            return `
              <div class="achievement-card ${unlocked ? '' : 'locked'}">
                <div class="achievement-card__icon">${a.icon}</div>
                <div class="achievement-card__info">
                  <div class="achievement-card__title">${a.name}</div>
                  <div class="achievement-card__desc">${a.description}</div>
                  ${unlocked ? '' : `<div class="achievement-card__progress"><div class="achievement-card__progress-fill" style="width: 0%;"></div></div>`}
                </div>
                <div style="color: gold; font-weight: 600;">+${a.points}</div>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Rewards -->
        <h3 style="margin-bottom: var(--space-4);">🎁 Rewards</h3>
        <div class="rewards-catalog">
          ${gamificationConfig.rewards.map(r => {
            const affordable = gamificationState.points >= r.cost;
            return `
              <div class="reward-item ${affordable ? '' : 'locked'}" onclick="${affordable ? `redeemReward('${r.id}')` : ''}">
                <div class="reward-item__icon">${r.icon}</div>
                <div class="reward-item__name">${r.name}</div>
                <div class="reward-item__cost ${affordable ? '' : 'unaffordable'}">
                  ⭐ ${r.cost}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
}

/**
 * Get level name
 */
function getLevelName() {
  const level = gamificationConfig.levels.find(l => l.level === gamificationState.level);
  return level ? level.name : 'Neuling';
}

/**
 * Setup action listeners
 */
function setupActionListeners() {
  // Track time spent
  let timeSpent = parseInt(sessionStorage.getItem('devmiro_time_spent') || '0');
  
  setInterval(() => {
    timeSpent++;
    sessionStorage.setItem('devmiro_time_spent', timeSpent.toString());
    
    // Award points for time
    if (timeSpent % 60 === 0) {
      addPoints(gamificationConfig.pointValues.time_spent, '1 Minute aktiv');
    }
  }, 1000);
  
  // Track page views
  let pageViewCount = parseInt(localStorage.getItem('devmiro_page_view_count') || '0');
  localStorage.setItem('devmiro_page_view_count', (pageViewCount + 1).toString());
  
  // Track clicks on share buttons
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      addPoints(gamificationConfig.pointValues.share, 'Seite geteilt');
    });
  });
  
  // Track form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      if (form.dataset.gamify === 'contact') {
        addPoints(gamificationConfig.pointValues.contact, 'Kontaktformular gesendet');
      }
    });
  });
}

/**
 * Redeem reward
 */
function redeemReward(rewardId) {
  const reward = gamificationConfig.rewards.find(r => r.id === rewardId);
  if (!reward) return;
  
  if (gamificationState.points < reward.cost) {
    showToast('Nicht genug Punkte!', 'error');
    return;
  }
  
  if (!confirm(`${reward.name} für ${reward.cost} Punkte einlösen?`)) return;
  
  gamificationState.points -= reward.cost;
  gamificationState.rewards.push(reward);
  
  saveGamificationState();
  updatePointsDisplay();
  
  showAchievement({
    icon: reward.icon,
    title: reward.name,
    description: 'Erfolgreich eingelöst!',
    points: 0
  });
  
  // Close panel
  const panel = document.getElementById('gamification-panel');
  if (panel) panel.remove();
}

/**
 * Get gamification state
 */
function getGamificationState() {
  return {
    ...gamificationState,
    levelName: getLevelName(),
    levelProgress: getLevelProgress(),
    config: gamificationConfig
  };
}

// Export for global use
window.gamificationConfig = gamificationConfig;
window.gamificationState = gamificationState;
window.showGamificationPanel = showGamificationPanel;
window.redeemReward = redeemReward;
window.getGamificationState = getGamificationState;