/* Smart Content Recommendations JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initRecommendations();
});

/**
 * Recommendations Configuration
 */
const recommendationsConfig = {
  maxRecommendations: 8,
  personalizationEnabled: true,
  showTrending: true,
  showAffinity: true,
  refreshInterval: 300000,
  
  // Content categories
  categories: [
    { id: 'services', name: 'Leistungen', weight: 0.3 },
    { id: 'blog', name: 'Blog', weight: 0.25 },
    { id: 'case-studies', name: 'Case Studies', weight: 0.2 },
    { id: 'products', name: 'Produkte', weight: 0.15 },
    { id: 'about', name: 'Über uns', weight: 0.1 }
  ],
  
  // Trending settings
  trending: {
    timeframe: '7d',
    minViews: 100
  }
};

/**
 * Recommendations State
 */
let recommendationsState = {
  recommendations: [],
  trending: [],
  affinity: [],
  personalizedScore: {}
};

/**
 * Initialize recommendations
 */
function initRecommendations() {
  // Load recommendations
  generateRecommendations();
  
  // Render recommendation sections
  renderRecommendationSections();
  
  // Set up auto-refresh
  setInterval(refreshRecommendations, recommendationsConfig.refreshInterval);
}

/**
 * Generate recommendations based on user behavior
 */
function generateRecommendations() {
  // Get user behavior data
  const userData = getUserBehaviorData();
  
  // Generate personalized recommendations
  recommendationsState.recommendations = generatePersonalizedRecs(userData);
  
  // Generate trending content
  recommendationsState.trending = generateTrendingContent();
  
  // Calculate content affinity
  recommendationsState.affinity = calculateContentAffinity();
}

/**
 * Get user behavior data
 */
function getUserBehaviorData() {
  // Get from localStorage
  const views = JSON.parse(localStorage.getItem('devmiro_page_views') || '[]');
  const searches = JSON.parse(localStorage.getItem('devmiro_searches') || '[]');
  const clicks = JSON.parse(localStorage.getItem('devmiro_clicks') || '[]');
  
  return { views, searches, clicks };
}

/**
 * Generate personalized recommendations
 */
function generatePersonalizedRecs(userData) {
  const allContent = getAllContent();
  const userProfile = buildUserProfile(userData);
  
  // Score each piece of content
  const scored = allContent.map(item => {
    let score = 0;
    
    // Category relevance
    const categoryWeight = recommendationsConfig.categories.find(c => c.id === item.category)?.weight || 0;
    score += categoryWeight * 30;
    
    // Recency
    const daysSincePublished = Math.floor((Date.now() - new Date(item.published).getTime()) / (1000 * 60 * 60 * 24));
    score += Math.max(0, 20 - daysSincePublished);
    
    // User affinity
    if (userProfile.interests.includes(item.category)) {
      score += 25;
    }
    
    // Popularity boost
    score += Math.min(item.views / 100, 20);
    
    // Avoid already viewed
    if (userData.views.includes(item.url)) {
      score *= 0.2;
    }
    
    return { ...item, score };
  });
  
  // Sort by score and return top items
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, recommendationsConfig.maxRecommendations);
}

/**
 * Build user profile from behavior
 */
function buildUserProfile(userData) {
  const profile = {
    interests: [],
    intent: null
  };
  
  // Analyze views
  const categories = userData.views.map(url => {
    if (url.includes('service')) return 'services';
    if (url.includes('blog')) return 'blog';
    if (url.includes('case-study')) return 'case-studies';
    if (url.includes('product')) return 'products';
    return 'about';
  });
  
  const categoryCounts = {};
  categories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  profile.interests = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
  
  // Analyze searches for intent
  if (userData.searches.length > 0) {
    const lastSearch = userData.searches[userData.searches.length - 1].toLowerCase();
    
    if (lastSearch.includes('preis') || lastSearch.includes('kost')) {
      profile.intent = 'pricing';
    } else if (lastSearch.includes('kontakt') || lastSearch.includes('anfrag')) {
      profile.intent = 'contact';
    } else if (lastSearch.includes('diens')) {
      profile.intent = 'services';
    }
  }
  
  return profile;
}

/**
 * Get all content
 */
function getAllContent() {
  return [
    {
      id: 1,
      title: 'Professionelle Webentwicklung',
      category: 'services',
      url: '/services/web-development',
      published: '2025-05-10',
      views: 1250,
      image: '/assets/images/services/web-dev.jpg'
    },
    {
      id: 2,
      title: 'Warum Responsive Design wichtig ist',
      category: 'blog',
      url: '/blog/responsive-design',
      published: '2025-05-08',
      views: 890,
      image: '/assets/images/blog/responsive.jpg'
    },
    {
      id: 3,
      title: 'E-Commerce Erfolgsgeschichte: TechStore AT',
      category: 'case-studies',
      url: '/case-studies/techstore',
      published: '2025-05-05',
      views: 650,
      image: '/assets/images/cases/techstore.jpg'
    },
    {
      id: 4,
      title: 'Webhosting & Domains',
      category: 'products',
      url: '/products/hosting',
      published: '2025-05-01',
      views: 2100,
      image: '/assets/images/products/hosting.jpg'
    },
    {
      id: 5,
      title: 'SEO Optimierung Guide 2025',
      category: 'blog',
      url: '/blog/seo-guide',
      published: '2025-04-28',
      views: 1500,
      image: '/assets/images/blog/seo.jpg'
    },
    {
      id: 6,
      title: 'Mobile App Entwicklung',
      category: 'services',
      url: '/services/mobile-app',
      published: '2025-04-25',
      views: 980,
      image: '/assets/images/services/mobile.jpg'
    },
    {
      id: 7,
      title: 'SaaS Transformation: CloudFlow',
      category: 'case-studies',
      url: '/case-studies/cloudflow',
      published: '2025-04-20',
      views: 720,
      image: '/assets/images/cases/cloudflow.jpg'
    },
    {
      id: 8,
      title: 'WordPress Wartung & Support',
      category: 'services',
      url: '/services/wordpress',
      published: '2025-04-15',
      views: 1100,
      image: '/assets/images/services/wordpress.jpg'
    }
  ];
}

/**
 * Generate trending content
 */
function generateTrendingContent() {
  const allContent = getAllContent();
  
  return allContent
    .filter(item => item.views >= recommendationsConfig.trending.minViews)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}

/**
 * Calculate content affinity
 */
function calculateContentAffinity() {
  return recommendationsConfig.categories.map(cat => ({
    category: cat.name,
    score: Math.floor(Math.random() * 40) + cat.weight * 100
  })).sort((a, b) => b.score - a.score);
}

/**
 * Render recommendation sections
 */
function renderRecommendationSections() {
  // Find or create recommendations section
  let section = document.getElementById('recommendations-section');
  
  if (!section) {
    section = document.createElement('section');
    section.id = 'recommendations-section';
    section.className = 'recommendation-section';
    
    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(section, footer);
    }
  }
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  section.innerHTML = `
    <div class="container">
      <h2 class="section__title" style="text-align: center; margin-bottom: var(--space-8);">
        ✨ ${lang === 'de' ? 'Für Sie empfohlen' : 'Recommended for You'}
      </h2>
      
      <!-- Recommendation Carousel -->
      <div class="recommendation-carousel">
        <div class="recommendation-track" id="recommendation-track">
          ${renderRecommendationCards()}
        </div>
        
        <button class="carousel-btn carousel-btn--prev" onclick="slideRecommendations(-1)" style="
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          cursor: pointer;
          z-index: 10;
        ">←</button>
        
        <button class="carousel-btn carousel-btn--next" onclick="slideRecommendations(1)" style="
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          cursor: pointer;
          z-index: 10;
        ">→</button>
      </div>
      
      <!-- Trending Now -->
      ${recommendationsConfig.showTrending ? `
        <div class="trending-section">
          <h3 class="section__subtitle">🔥 ${lang === 'de' ? 'Aktuell beliebt' : 'Trending Now'}</h3>
          <div class="trending-list">
            ${recommendationsState.trending.map(item => `
              <div class="trending-item" onclick="navigateTo('${item.url}')">
                <div class="trending-item__rank">#${item.rank}</div>
                <div class="trending-item__title">${item.title}</div>
                <div class="trending-item__views">${item.views.toLocaleString()} ${lang === 'de' ? 'Aufrufe' : 'views'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Content Affinity -->
      ${recommendationsConfig.showAffinity ? `
        <div class="affinity-section">
          <h3 class="section__subtitle">📊 ${lang === 'de' ? 'Ihre Interessen' : 'Your Interests'}</h3>
          <div class="affinity-bars">
            ${recommendationsState.affinity.map(item => `
              <div class="affinity-bar">
                <span class="affinity-bar__label">${item.category}</span>
                <div class="affinity-bar__track">
                  <div class="affinity-bar__fill" style="width: ${item.score}%;"></div>
                </div>
                <span class="affinity-bar__value">${item.score}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render recommendation cards
 */
function renderRecommendationCards() {
  return recommendationsState.recommendations.map(item => `
    <div class="recommendation-card" onclick="navigateTo('${item.url}')">
      <div class="recommendation-card__image" style="background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
        ${item.category === 'services' ? '⚙️' : item.category === 'blog' ? '📝' : item.category === 'case-studies' ? '📊' : item.category === 'products' ? '📦' : 'ℹ️'}
      </div>
      <div class="recommendation-card__content">
        <div class="recommendation-card__category">${item.category}</div>
        <h4 class="recommendation-card__title">${item.title}</h4>
        <div class="recommendation-card__meta">
          <span>${item.views.toLocaleString()} ${getCurrentLang() === 'de' ? 'Aufrufe' : 'views'}</span>
          <span class="recommendation-card__score">⭐ ${Math.round(item.score)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Slide recommendations
 */
let currentSlide = 0;
const slideAmount = 3;

function slideRecommendations(direction) {
  const track = document.getElementById('recommendation-track');
  if (!track) return;
  
  const maxSlide = Math.max(0, recommendationsState.recommendations.length - 3);
  
  currentSlide = Math.max(0, Math.min(maxSlide, currentSlide + direction));
  
  const translateX = currentSlide * (33.333 + 1);
  track.style.transform = `translateX(-${translateX}%)`;
}

/**
 * Navigate to content
 */
function navigateTo(url) {
  // Track click
  const clicks = JSON.parse(localStorage.getItem('devmiro_clicks') || '[]');
  clicks.push({ url, timestamp: Date.now() });
  localStorage.setItem('devmiro_clicks', JSON.stringify(clicks.slice(-50)));
  
  // Navigate
  window.location.href = url;
}

/**
 * Refresh recommendations
 */
function refreshRecommendations() {
  generateRecommendations();
  renderRecommendationSections();
}

/**
 * Get recommendations state
 */
function getRecommendationsState() {
  return {
    recommendations: recommendationsState.recommendations,
    trending: recommendationsState.trending,
    affinity: recommendationsState.affinity
  };
}

// Export for global use
window.recommendationsConfig = recommendationsConfig;
window.recommendationsState = recommendationsState;
window.slideRecommendations = slideRecommendations;
window.navigateTo = navigateTo;
window.getRecommendationsState = getRecommendationsState;