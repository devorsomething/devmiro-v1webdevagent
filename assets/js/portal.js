/* Customer Portal / Account Area JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPortal();
});

/**
 * Portal Configuration
 */
const portalConfig = {
  apiEndpoint: '/api/portal',
  
  // Demo user for testing
  demoUser: {
    id: 'user-001',
    name: 'Max Mustermann',
    email: 'max@beispiel.at',
    plan: 'Professional',
    avatar: 'MM',
    projects: [
      {
        id: 'proj-001',
        name: 'Firmenwebsite Relaunch',
        status: 'active',
        progress: 75,
        deadline: '2024-03-15',
        budget: 4500
      },
      {
        id: 'proj-002',
        name: 'Online Shop Integration',
        status: 'pending',
        progress: 20,
        deadline: '2024-04-01',
        budget: 2200
      },
      {
        id: 'proj-003',
        name: 'SEO Optimierung',
        status: 'completed',
        progress: 100,
        deadline: '2024-02-28',
        budget: 800
      }
    ]
  }
};

/**
 * Portal State
 */
let portalState = {
  isLoggedIn: false,
  currentUser: null,
  currentSection: 'dashboard'
};

/**
 * Initialize portal
 */
function initPortal() {
  // Check for saved session
  loadPortalSession();
  
  // Render portal if logged in
  if (portalState.isLoggedIn) {
    renderPortal();
  }
}

/**
 * Load portal session from localStorage
 */
function loadPortalSession() {
  const saved = localStorage.getItem('devmiro-portal-session');
  if (saved) {
    try {
      const session = JSON.parse(saved);
      portalState.isLoggedIn = session.isLoggedIn;
      portalState.currentUser = session.user;
    } catch (e) {
      console.log('Could not load portal session');
    }
  }
}

/**
 * Save portal session to localStorage
 */
function savePortalSession() {
  localStorage.setItem('devmiro-portal-session', JSON.stringify({
    isLoggedIn: portalState.isLoggedIn,
    user: portalState.currentUser
  }));
}

/**
 * Render portal
 */
function renderPortal() {
  const portal = document.getElementById('portal');
  if (!portal) return;
  
  portal.innerHTML = `
    <section class="portal">
      <div class="container">
        <div class="portal__header">
          <h1 class="portal__title">${getPortalLang() === 'de' ? 'Kundenportal' : 'Customer Portal'}</h1>
          <p class="portal__subtitle">${getPortalLang() === 'de' ? 'Verwalten Sie Ihre Projekte und Dokumente' : 'Manage your projects and documents'}</p>
        </div>
        
        <div class="portal__grid">
          <!-- Sidebar -->
          <aside class="portal__sidebar">
            <div class="portal__user">
              <div class="portal__avatar">${portalState.currentUser.avatar}</div>
              <div class="portal__name">${portalState.currentUser.name}</div>
              <div class="portal__email">${portalState.currentUser.email}</div>
              <span class="portal__plan">${portalState.currentUser.plan}</span>
            </div>
            
            <nav class="portal__nav">
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link ${portalState.currentSection === 'dashboard' ? 'active' : ''}" onclick="navigatePortalSection('dashboard'); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Dashboard' : 'Dashboard'}
                </a>
              </div>
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link ${portalState.currentSection === 'projects' ? 'active' : ''}" onclick="navigatePortalSection('projects'); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Projekte' : 'Projects'}
                </a>
              </div>
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link ${portalState.currentSection === 'documents' ? 'active' : ''}" onclick="navigatePortalSection('documents'); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Dokumente' : 'Documents'}
                </a>
              </div>
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link ${portalState.currentSection === 'invoices' ? 'active' : ''}" onclick="navigatePortalSection('invoices'); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Rechnungen' : 'Invoices'}
                </a>
              </div>
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link ${portalState.currentSection === 'settings' ? 'active' : ''}" onclick="navigatePortalSection('settings'); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Einstellungen' : 'Settings'}
                </a>
              </div>
              <div class="portal__nav-item">
                <a href="#" class="portal__nav-link" onclick="logoutPortal(); return false;">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  ${getPortalLang() === 'de' ? 'Abmelden' : 'Logout'}
                </a>
              </div>
            </nav>
          </aside>
          
          <!-- Content -->
          <main class="portal__content" id="portalContent">
            ${renderPortalSection(portalState.currentSection)}
          </main>
        </div>
      </div>
    </section>
  `;
}

/**
 * Get current language
 */
function getPortalLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Render portal section content
 */
function renderPortalSection(section) {
  const lang = getPortalLang();
  const user = portalState.currentUser;
  
  switch (section) {
    case 'dashboard':
      return `
        <div class="portal__stats">
          <div class="portal__stat-card">
            <div class="portal__stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div class="portal__stat-value">${user.projects.length}</div>
            <div class="portal__stat-label">${lang === 'de' ? 'Aktive Projekte' : 'Active Projects'}</div>
          </div>
          <div class="portal__stat-card">
            <div class="portal__stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div class="portal__stat-value">${user.projects.filter(p => p.status === 'completed').length}</div>
            <div class="portal__stat-label">${lang === 'de' ? 'Abgeschlossen' : 'Completed'}</div>
          </div>
          <div class="portal__stat-card">
            <div class="portal__stat-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <div class="portal__stat-value">€${user.projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</div>
            <div class="portal__stat-label">${lang === 'de' ? 'Gesamtbudget' : 'Total Budget'}</div>
          </div>
        </div>
        
        <div class="project-list">
          <div class="project-list__header">
            <h2 class="project-list__title">${lang === 'de' ? 'Ihre Projekte' : 'Your Projects'}</h2>
            <a href="#" class="btn btn--primary" onclick="navigatePortalSection('projects'); return false;">
              ${lang === 'de' ? 'Alle anzeigen' : 'View All'}
            </a>
          </div>
          
          ${user.projects.slice(0, 2).map(project => `
            <div class="project-card">
              <div class="project-card__header">
                <span class="project-card__title">${project.name}</span>
                <span class="project-card__status project-card__status--${project.status}">
                  ${getStatusLabel(project.status, lang)}
                </span>
              </div>
              <div class="project-card__meta">
                <span class="project-card__meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                  </svg>
                  ${new Date(project.deadline).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
                </span>
                <span class="project-card__meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                  €${project.budget.toLocaleString()}
                </span>
              </div>
              <div style="margin-top: var(--space-3);">
                <div style="height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden;">
                  <div style="width: ${project.progress}%; height: 100%; background: var(--color-primary);"></div>
                </div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: var(--space-1);">${project.progress}% ${lang === 'de' ? 'abgeschlossen' : 'complete'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
    case 'projects':
      return `
        <h2>${lang === 'de' ? 'Alle Projekte' : 'All Projects'}</h2>
        ${user.projects.map(project => `
          <div class="project-card">
            <div class="project-card__header">
              <span class="project-card__title">${project.name}</span>
              <span class="project-card__status project-card__status--${project.status}">
                ${getStatusLabel(project.status, lang)}
              </span>
            </div>
            <div class="project-card__meta">
              <span class="project-card__meta-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                </svg>
                ${new Date(project.deadline).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}
              </span>
              <span class="project-card__meta-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                €${project.budget.toLocaleString()}
              </span>
            </div>
          </div>
        `).join('')}
      `;
      
    case 'settings':
      return `
        <h2>${lang === 'de' ? 'Konto-Einstellungen' : 'Account Settings'}</h2>
        <form class="auth-form" onsubmit="updatePortalSettings(event)">
          <div class="auth-form__fields">
            <div class="auth-form__field">
              <label>${lang === 'de' ? 'Name' : 'Name'}</label>
              <input type="text" value="${user.name}" name="name" required>
            </div>
            <div class="auth-form__field">
              <label>${lang === 'de' ? 'E-Mail' : 'Email'}</label>
              <input type="email" value="${user.email}" name="email" required>
            </div>
          </div>
          <button type="submit" class="auth-form__submit">
            ${lang === 'de' ? 'Speichern' : 'Save'}
          </button>
        </form>
      `;
      
    default:
      return `<p>${lang === 'de' ? 'Section coming soon...' : 'Section coming soon...'}</p>`;
  }
}

/**
 * Get status label
 */
function getStatusLabel(status, lang) {
  const labels = {
    active: lang === 'de' ? 'Aktiv' : 'Active',
    pending: lang === 'de' ? 'Ausstehend' : 'Pending',
    completed: lang === 'de' ? 'Abgeschlossen' : 'Completed'
  };
  return labels[status] || status;
}

/**
 * Navigate portal section
 */
function navigatePortalSection(section) {
  portalState.currentSection = section;
  renderPortal();
}

/**
 * Update portal settings
 */
function updatePortalSettings(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  // Update user
  portalState.currentUser.name = formData.get('name');
  portalState.currentUser.email = formData.get('email');
  portalState.currentUser.avatar = formData.get('name').split(' ').map(n => n[0]).join('').toUpperCase();
  
  savePortalSession();
  renderPortal();
  
  showNotificationToast(
    getPortalLang() === 'de' ? 'Einstellungen gespeichert' : 'Settings saved',
    getPortalLang() === 'de' ? 'Ihre Änderungen wurden erfolgreich gespeichert.' : 'Your changes have been saved successfully.',
    'success'
  );
}

/**
 * Logout from portal
 */
function logoutPortal() {
  portalState.isLoggedIn = false;
  portalState.currentUser = null;
  savePortalSession();
  
  // Reload page
  window.location.reload();
}

/**
 * Show notification toast
 */
function showNotificationToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'notification-toast active';
  toast.innerHTML = `
    <div class="notification-toast__icon notification-toast__icon--${type}">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
    <div class="notification-toast__content">
      <div class="notification-toast__title">${title}</div>
      <div class="notification-toast__message">${message}</div>
    </div>
    <button class="notification-toast__close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 5000);
}

/**
 * Login for demo (for testing)
 */
function demoLoginPortal() {
  portalState.isLoggedIn = true;
  portalState.currentUser = portalConfig.demoUser;
  savePortalSession();
  renderPortal();
}

// For demo purposes - auto login
if (new URLSearchParams(window.location.search).has('demo')) {
  setTimeout(demoLoginPortal, 500);
}

// Export for global use
window.portalConfig = portalConfig;
window.navigatePortalSection = navigatePortalSection;
window.logoutPortal = logoutPortal;
window.demoLoginPortal = demoLoginPortal;