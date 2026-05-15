/* Blog System JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initBlog();
});

/**
 * Blog Configuration
 */
const blogConfig = {
  posts: [
    {
      id: 'website-kosten-2024',
      slug: 'website-kosten-2024',
      title: {
        de: 'Was kostet eine Website im Jahr 2024?',
        en: 'How much does a website cost in 2024?'
      },
      excerpt: {
        de: 'Eine professionelle Website ist eine wichtige Investition für jedes Unternehmen. Erfahren Sie, welche Faktoren die Kosten beeinflussen und wie Sie das beste Preis-Leistungs-Verhältnis erhalten.',
        en: 'A professional website is a crucial investment for any business. Learn which factors influence costs and how to get the best value for your money.'
      },
      content: {
        de: '<p>Die Kosten für eine Website können stark variieren, abhängig von Ihren Anforderungen und Zielen. In diesem Artikel erfahren Sie alles, was Sie wissen müssen.</p><h2>Factoren, die die Kosten beeinflussen</h2><ul><li>Design-Komplexität</li><li>Funktionalität</li><li>Content-Menge</li><li>SEO-Anforderungen</li></ul>',
        en: '<p>Website costs can vary greatly depending on your requirements and goals. In this article, you will learn everything you need to know.</p><h2>Factors that influence costs</h2><ul><li>Design complexity</li><li>Functionality</li><li>Content amount</li><li>SEO requirements</li></ul>'
      },
      category: 'web-development',
      tags: ['website', 'kosten', 'budget', '2024'],
      author: {
        name: 'Timo Miro Gavanelli',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'Geschäftsführer'
      },
      date: '2024-01-15',
      readTime: 8,
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      featured: true,
      published: true
    },
    {
      id: 'seo-grundlagen',
      slug: 'seo-grundlagen-vorarlberg',
      title: {
        de: 'SEO Grundlagen für Unternehmen in Vorarlberg',
        en: 'SEO basics for businesses in Vorarlberg'
      },
      excerpt: {
        de: 'Lokale SEO ist entscheidend für Unternehmen in Vorarlberg. Erfahren Sie, wie Sie in den lokalen Suchergebnissen ranken und mehr Kunden gewinnen.',
        en: 'Local SEO is crucial for businesses in Vorarlberg. Learn how to rank in local search results and attract more customers.'
      },
      content: {
        de: '<p>Lokale SEO unterscheidet sich von generischer SEO. Hier sind die wichtigsten Faktoren...</p>',
        en: '<p>Local SEO differs from generic SEO. Here are the most important factors...</p>'
      },
      category: 'seo',
      tags: ['seo', 'local', 'vorarlberg', 'google'],
      author: {
        name: 'Timo Miro Gavanelli',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'Geschäftsführer'
      },
      date: '2024-01-10',
      readTime: 6,
      featuredImage: 'https://images.unsplash.com/photo-1432888622757-4f0e0e82e2e3?w=800&h=450&fit=crop',
      featured: false,
      published: true
    },
    {
      id: 'web-hosting-guide',
      slug: 'web-hosting-guide',
      title: {
        de: 'Der ultimativer Web-Hosting Guide',
        en: 'The ultimate web hosting guide'
      },
      excerpt: {
        de: 'Shared, VPS, Cloud oder Dedicated? Erfahren Sie, welches Hosting für Ihre Website am besten geeignet ist.',
        en: 'Shared, VPS, Cloud or Dedicated? Learn which hosting is best for your website.'
      },
      content: {
        de: '<p>Die Wahl des richtigen Hostings ist entscheidend für die Performance Ihrer Website...</p>',
        en: '<p>Choosing the right hosting is crucial for your website performance...</p>'
      },
      category: 'hosting',
      tags: ['hosting', 'server', 'vps', 'cloud'],
      author: {
        name: 'Timo Miro Gavanelli',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'Geschäftsführer'
      },
      date: '2024-01-05',
      readTime: 10,
      featuredImage: 'https://images.unsplash.com/photo-1545972154-9bb223aac798?w=800&h=450&fit=crop',
      featured: false,
      published: true
    },
    {
      id: 'webdesign-trends-2024',
      slug: 'webdesign-trends-2024',
      title: {
        de: 'Die wichtigsten Webdesign Trends 2024',
        en: 'The most important web design trends 2024'
      },
      excerpt: {
        de: 'Von Dark Mode bis AI-generierte Designs – das sind die Trends, die 2024 das Web design revolutionieren werden.',
        en: 'From dark mode to AI-generated designs – these are the trends that will revolutionize web design in 2024.'
      },
      content: {
        de: '<p>Webdesign entwickelt sich ständig weiter. Hier sind die wichtigsten Trends...</p>',
        en: '<p>Web design is constantly evolving. Here are the most important trends...</p>'
      },
      category: 'web-development',
      tags: ['design', 'trends', '2024', 'ui'],
      author: {
        name: 'Timo Miro Gavanelli',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'Geschäftsführer'
      },
      date: '2024-01-01',
      readTime: 7,
      featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      featured: false,
      published: true
    }
  ],
  
  categories: [
    { 
      slug: 'web-development', 
      name: { de: 'Webentwicklung', en: 'Web Development' },
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    },
    { 
      slug: 'seo', 
      name: { de: 'SEO', en: 'SEO' },
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    },
    { 
      slug: 'hosting', 
      name: { de: 'Hosting', en: 'Hosting' },
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    },
    { 
      slug: 'business', 
      name: { de: 'Business', en: 'Business' },
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    }
  ]
};

/**
 * Get current language for blog
 */
function getBlogLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize blog
 */
function initBlog() {
  const blogGrid = document.querySelector('.blog__grid');
  const blogFilters = document.querySelector('.blog__filters');
  const blogSearch = document.querySelector('.blog__search');
  
  if (blogGrid) {
    renderBlogPosts(blogGrid);
  }
  
  if (blogFilters) {
    renderBlogFilters(blogFilters);
  }
  
  if (blogSearch) {
    initBlogSearch(blogSearch);
  }
  
  initNewsletterForm();
}

/**
 * Render blog posts
 */
function renderBlogPosts(container, category = 'all', searchQuery = '') {
  const lang = getBlogLang();
  const posts = blogConfig.posts.filter(post => {
    if (!post.published) return false;
    
    // Filter by category
    if (category !== 'all' && post.category !== category) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return post.title[lang].toLowerCase().includes(query) ||
             post.excerpt[lang].toLowerCase().includes(query) ||
             post.tags.some(tag => tag.toLowerCase().includes(query));
    }
    
    return true;
  });
  
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="blog-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>${lang === 'de' ? 'Keine Artikel gefunden' : 'No articles found'}</p>
      </div>
    `;
    return;
  }
  
  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);
  
  let html = '';
  
  // Featured post first
  if (featuredPost) {
    html += renderBlogCard(featuredPost, true, lang);
  }
  
  // Regular posts
  regularPosts.forEach(post => {
    html += renderBlogCard(post, false, lang);
  });
  
  container.innerHTML = html;
  
  // Add click handlers
  container.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      window.location.href = `/blog/${slug}.html`;
    });
  });
}

/**
 * Render single blog card
 */
function renderBlogCard(post, featured = false, lang = 'de') {
  const category = blogConfig.categories.find(c => c.slug === post.category);
  const categoryName = category ? category.name[lang] : post.category;
  const title = post.title[lang] || post.title.de;
  const excerpt = post.excerpt[lang] || post.excerpt.de;
  const date = formatDate(post.date, lang);
  const readTime = post.readTime;
  
  return `
    <article class="blog-card ${featured ? 'blog-card--featured' : ''}" data-slug="${post.slug}">
      <div class="blog-card__image">
        <img src="${post.featuredImage}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450/3B82F6/FFFFFF?text=DevMiro+Blog'">
        <span class="blog-card__category">${categoryName}</span>
      </div>
      <div class="blog-card__content">
        <div class="blog-card__meta">
          <span class="blog-card__date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${date}
          </span>
          <span class="blog-card__read-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${readTime} ${lang === 'de' ? 'Min.' : 'min'}
          </span>
        </div>
        <h3 class="blog-card__title">${title}</h3>
        <p class="blog-card__excerpt">${excerpt}</p>
        <div class="blog-card__footer">
          <div class="blog-card__author">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-card__author-avatar" onerror="this.src='https://via.placeholder.com/32/3B82F6/FFFFFF?text=T'">
            <span class="blog-card__author-name">${post.author.name}</span>
          </div>
          <a href="/blog/${post.slug}.html" class="blog-card__link">
            ${lang === 'de' ? 'Weiterlesen' : 'Read more'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render blog filters
 */
function renderBlogFilters(container) {
  const lang = getBlogLang();
  const categories = [{ slug: 'all', name: { de: 'Alle', en: 'All' } }, ...blogConfig.categories];
  
  container.innerHTML = categories.map(cat => `
    <button class="blog__filter ${cat.slug === 'all' ? 'active' : ''}" data-category="${cat.slug}">
      ${cat.name[lang] || cat.name.de}
    </button>
  `).join('');
  
  container.querySelectorAll('.blog__filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.blog__filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      const searchQuery = document.querySelector('.blog__search-input')?.value || '';
      const blogGrid = document.querySelector('.blog__grid');
      if (blogGrid) {
        renderBlogPosts(blogGrid, category, searchQuery);
      }
    });
  });
}

/**
 * Initialize blog search
 */
function initBlogSearch(container) {
  const input = container.querySelector('.blog__search-input');
  const debounceTimer = 500;
  let debounce = null;
  
  input.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const searchQuery = e.target.value;
      const activeCategory = document.querySelector('.blog__filter.active')?.dataset.category || 'all';
      const blogGrid = document.querySelector('.blog__grid');
      if (blogGrid) {
        renderBlogPosts(blogGrid, activeCategory, searchQuery);
      }
    }, debounceTimer);
  });
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
  const form = document.querySelector('.newsletter__form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const btn = form.querySelector('button');
    
    if (!email || !isValidEmail(email)) {
      showToast('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }
    
    // Simulate subscription
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;
    
    setTimeout(() => {
      showToast('Vielen Dank! Sie haben sich erfolgreich angemeldet.', 'success');
      form.reset();
      btn.textContent = 'Anmelden';
      btn.disabled = false;
      
      // Track subscription
      if (window.journeyTrack) {
        window.journeyTrack.track('newsletter_subscribe', { email });
      }
    }, 1500);
  });
}

/**
 * Format date
 */
function formatDate(dateString, lang = 'de') {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', options);
}

/**
 * Validate email
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  } else {
    alert(message);
  }
}

// Export for global use
window.blogConfig = blogConfig;
window.renderBlogPosts = renderBlogPosts;