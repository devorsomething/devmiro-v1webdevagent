/* Real-time Collaboration Features JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initCollaboration();
});

/**
 * Collaboration Configuration
 */
const collabConfig = {
  enableLiveCursors: false, // Requires WebSocket
  enableComments: true,
  enablePresence: true,
  enableRealTimeSync: false, // Requires backend
  enableTypingIndicators: false,
  
  // WebSocket settings (for real features)
  wsEndpoint: 'wss://devmiro.at/collab',
  reconnectInterval: 5000,
  
  // Comment settings
  maxCommentsVisible: 5,
  autoSaveInterval: 30000
};

/**
 * Collaboration State
 */
let collabState = {
  connected: false,
  users: [],
  comments: [],
  cursors: {},
  typingUsers: [],
  pendingChanges: []
};

/**
 * Initialize collaboration
 */
function initCollaboration() {
  // Initialize presence
  if (collabConfig.enablePresence) {
    initPresence();
  }
  
  // Initialize comments
  if (collabConfig.enableComments) {
    initComments();
  }
  
  // Initialize typing indicators
  if (collabConfig.enableTypingIndicators) {
    initTypingIndicators();
  }
  
  // Initialize live cursors (mock)
  if (collabConfig.enableLiveCursors) {
    initLiveCursors();
  }
  
  // Create comment thread UI
  createCommentThread();
  
  // Create presence indicators
  createPresenceIndicators();
  
  // Load saved comments
  loadComments();
}

/**
 * Initialize presence
 */
function initPresence() {
  // Generate session ID
  const sessionId = localStorage.getItem('collab_session_id') || 
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('collab_session_id', sessionId);
  
  // Mock current user
  collabState.currentUser = {
    id: sessionId,
    name: 'Gast',
    color: generateUserColor(),
    status: 'online'
  };
  
  // Add to users
  collabState.users.push(collabState.currentUser);
  
  // Broadcast presence (mock)
  console.log('Presence initialized:', collabState.currentUser);
}

/**
 * Generate user color
 */
function generateUserColor() {
  const colors = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Initialize comments
 */
function initComments() {
  // Create floating comment button
  const commentBtn = document.createElement('button');
  commentBtn.className = 'no-print';
  commentBtn.id = 'collab-comment-btn';
  commentBtn.innerHTML = '💬';
  commentBtn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 9998;
    transition: all 0.3s ease;
  `;
  
  commentBtn.addEventListener('click', toggleCommentThread);
  commentBtn.addEventListener('mouseenter', () => {
    commentBtn.style.transform = 'scale(1.1)';
  });
  commentBtn.addEventListener('mouseleave', () => {
    commentBtn.style.transform = '';
  });
  
  document.body.appendChild(commentBtn);
  
  // Update comment count badge
  updateCommentBadge();
}

/**
 * Create comment thread
 */
function createCommentThread() {
  const thread = document.createElement('div');
  thread.className = 'comment-thread';
  thread.id = 'comment-thread';
  thread.innerHTML = `
    <div class="comment-thread__header">
      💬 Kommentare
      <button onclick="toggleCommentThread()" style="background: none; border: none; cursor: pointer; font-size: 1.25rem;">✕</button>
    </div>
    <div class="comment-thread__messages" id="comment-messages">
      <!-- Comments will be rendered here -->
    </div>
    <div class="comment-thread__input">
      <input type="text" id="comment-input" placeholder="Kommentar schreiben..." onkeypress="handleCommentKeypress(event)">
      <button class="btn btn--primary" onclick="addComment()">Senden</button>
    </div>
  `;
  
  document.body.appendChild(thread);
}

/**
 * Toggle comment thread
 */
function toggleCommentThread() {
  const thread = document.getElementById('comment-thread');
  thread.classList.toggle('active');
  
  if (thread.classList.contains('active')) {
    renderComments();
  }
}

/**
 * Add comment
 */
function addComment() {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  
  if (!text) return;
  
  const comment = {
    id: 'comment_' + Date.now(),
    author: collabState.currentUser.name,
    authorId: collabState.currentUser.id,
    authorColor: collabState.currentUser.color,
    text,
    timestamp: Date.now(),
    resolved: false,
    replies: []
  };
  
  collabState.comments.push(comment);
  saveComments();
  renderComments();
  updateCommentBadge();
  
  input.value = '';
  
  // Show toast
  showCollabToast(comment.author, 'hat einen Kommentar hinzugefügt');
}

/**
 * Handle comment keypress
 */
function handleCommentKeypress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    addComment();
  }
}

/**
 * Render comments
 */
function renderComments() {
  const container = document.getElementById('comment-messages');
  if (!container) return;
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  if (collabState.comments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-6); color: var(--color-text-muted);">
        <p>Noch keine Kommentare.</p>
        <p>Sei der Erste, der einen Kommentar schreibt!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = collabState.comments.map(comment => `
    <div class="comment-message" data-comment-id="${comment.id}">
      <div class="comment-message__header">
        <span class="comment-message__author" style="color: ${comment.authorColor};">
          ${comment.author}
        </span>
        <span class="comment-message__time">${formatTimestamp(comment.timestamp)}</span>
      </div>
      <div class="comment-message__text">${comment.text}</div>
      <div class="comment-message__actions">
        <span class="comment-message__action" onclick="replyToComment('${comment.id}')">
          Antworten
        </span>
        ${comment.authorId === collabState.currentUser?.id ? `
          <span class="comment-message__action" onclick="deleteComment('${comment.id}')">
            Löschen
          </span>
        ` : ''}
      </div>
      
      ${comment.replies.length > 0 ? `
        <div style="margin-top: var(--space-3); padding-left: var(--space-4); border-left: 2px solid var(--color-border);">
          ${comment.replies.map(reply => `
            <div style="margin-bottom: var(--space-2); font-size: 0.8125rem;">
              <strong style="color: ${reply.authorColor};">${reply.author}:</strong> ${reply.text}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Reply to comment
 */
function replyToComment(commentId) {
  const text = prompt('Antwort eingeben:');
  if (!text) return;
  
  const comment = collabState.comments.find(c => c.id === commentId);
  if (!comment) return;
  
  comment.replies.push({
    author: collabState.currentUser.name,
    authorId: collabState.currentUser.id,
    authorColor: collabState.currentUser.color,
    text,
    timestamp: Date.now()
  });
  
  saveComments();
  renderComments();
}

/**
 * Delete comment
 */
function deleteComment(commentId) {
  if (!confirm('Kommentar wirklich löschen?')) return;
  
  collabState.comments = collabState.comments.filter(c => c.id !== commentId);
  saveComments();
  renderComments();
  updateCommentBadge();
}

/**
 * Save comments to localStorage
 */
function saveComments() {
  localStorage.setItem('devmiro_comments', JSON.stringify(collabState.comments));
}

/**
 * Load comments from localStorage
 */
function loadComments() {
  const saved = localStorage.getItem('devmiro_comments');
  if (saved) {
    collabState.comments = JSON.parse(saved);
  }
}

/**
 * Update comment badge
 */
function updateCommentBadge() {
  const btn = document.getElementById('collab-comment-btn');
  if (!btn) return;
  
  const count = collabState.comments.length;
  if (count > 0) {
    btn.innerHTML = `💬<span style="
      position: absolute;
      top: -4px;
      right: -4px;
      background: #EF4444;
      color: white;
      font-size: 0.75rem;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    ">${count}</span>`;
  }
}

/**
 * Initialize typing indicators
 */
function initTypingIndicators() {
  // Create typing indicator element
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typing-indicator';
  indicator.style.display = 'none';
  indicator.innerHTML = `
    <span class="typing-indicator__dots">
      <span class="typing-indicator__dot"></span>
      <span class="typing-indicator__dot"></span>
      <span class="typing-indicator__dot"></span>
    </span>
    <span id="typing-text">jemand tippt...</span>
  `;
  
  document.body.appendChild(indicator);
}

/**
 * Show typing indicator
 */
function showTypingIndicator(userName) {
  const indicator = document.getElementById('typing-indicator');
  if (!indicator) return;
  
  const text = document.getElementById('typing-text');
  if (text) text.textContent = `${userName} tippt...`;
  
  indicator.style.display = 'inline-flex';
  
  // Hide after 3 seconds
  clearTimeout(window.typingTimeout);
  window.typingTimeout = setTimeout(() => {
    indicator.style.display = 'none';
  }, 3000);
}

/**
 * Initialize live cursors (mock)
 */
function initLiveCursors() {
  // Simulate other users' cursors
  const mockUsers = [
    { id: 'user_1', name: 'Max', color: '#3B82F6', x: 100, y: 200 },
    { id: 'user_2', name: 'Anna', color: '#22C55E', x: 500, y: 400 }
  ];
  
  // Create cursor elements
  mockUsers.forEach(user => {
    const cursor = document.createElement('div');
    cursor.className = 'collab-cursor';
    cursor.id = 'cursor-' + user.id;
    cursor.innerHTML = `
      <div class="collab-cursor__pointer" style="border-bottom-color: ${user.color};"></div>
      <div class="collab-cursor__label" style="background: ${user.color};">${user.name}</div>
    `;
    cursor.style.left = user.x + 'px';
    cursor.style.top = user.y + 'px';
    document.body.appendChild(cursor);
    
    // Animate cursor
    animateCursor(user);
  });
}

/**
 * Animate cursor (mock movement)
 */
function animateCursor(user) {
  const cursor = document.getElementById('cursor-' + user.id);
  if (!cursor) return;
  
  let x = user.x;
  let y = user.y;
  
  setInterval(() => {
    x += (Math.random() - 0.5) * 20;
    y += (Math.random() - 0.5) * 20;
    
    x = Math.max(0, Math.min(window.innerWidth - 50, x));
    y = Math.max(0, Math.min(window.innerHeight - 100, y));
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }, 2000);
}

/**
 * Create presence indicators
 */
function createPresenceIndicators() {
  // Create presence panel
  const panel = document.createElement('div');
  panel.className = 'collab-session';
  panel.style.display = 'none';
  panel.id = 'presence-panel';
  panel.innerHTML = `
    <div class="collab-session__header">
      <span class="collab-session__title">👥 Online</span>
      <div class="collab-session__status">
        <span class="collab-session__status-dot"></span>
        <span style="font-size: 0.75rem;">${collabState.users.length} online</span>
      </div>
    </div>
    <div class="collab-session__users" id="presence-users">
      <!-- Users will be rendered here -->
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Render initial users
  renderPresenceUsers();
}

/**
 * Render presence users
 */
function renderPresenceUsers() {
  const container = document.getElementById('presence-users');
  if (!container) return;
  
  container.innerHTML = collabState.users.map(user => `
    <div class="collab-session__user" style="background: ${user.color};" title="${user.name}">
      ${user.name.charAt(0).toUpperCase()}
    </div>
  `).join('');
}

/**
 * Show collaboration toast
 */
function showCollabToast(userName, message) {
  const existing = document.querySelector('.collab-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'collab-toast';
  toast.innerHTML = `
    <div class="collab-toast__avatar">${userName.charAt(0).toUpperCase()}</div>
    <div class="collab-toast__message">
      <strong>${userName}</strong> ${message}
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = (now - date) / 1000;
  
  if (diff < 60) return 'Gerade eben';
  if (diff < 3600) return Math.floor(diff / 60) + 'min';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  return date.toLocaleDateString('de-AT');
}

/**
 * Get collaboration state
 */
function getCollabState() {
  return {
    ...collabState,
    config: collabConfig
  };
}

// Export for global use
window.collabConfig = collabConfig;
window.collabState = collabState;
window.toggleCommentThread = toggleCommentThread;
window.addComment = addComment;
window.replyToComment = replyToComment;
window.deleteComment = deleteComment;
window.handleCommentKeypress = handleCommentKeypress;
window.showTypingIndicator = showTypingIndicator;
window.showCollabToast = showCollabToast;
window.getCollabState = getCollabState;