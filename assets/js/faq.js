/* Interactive FAQ JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initInteractiveFAQ();
});

function initInteractiveFAQ() {
  const faqContainer = document.querySelector('.faq');
  if (!faqContainer) return;

  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearch');
  const searchResults = document.querySelector('.faq-search__results');
  const searchClear = document.querySelector('.faq-search__clear');
  const categoryButtons = document.querySelectorAll('.faq-category');
  const counter = document.querySelector('.faq-counter');
  const expandAllBtn = document.querySelector('[data-action="expand-all"]');
  const collapseAllBtn = document.querySelector('[data-action="collapse-all"]');

  let currentCategory = 'all';
  let searchQuery = '';
  let openItems = new Set();

  // FAQ Data for search
  const faqData = [];

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question span')?.textContent || '';
    const answer = item.querySelector('.faq-answer')?.textContent || '';
    const category = item.dataset.category || 'general';

    faqData.push({
      index,
      question,
      answer,
      category,
      element: item
    });

    // Toggle item
    item.addEventListener('toggle', () => {
      if (item.open) {
        openItems.add(index);
        item.classList.add('active');
      } else {
        openItems.delete(index);
        item.classList.remove('active');
      }
    });

    // Keyboard navigation
    item.querySelector('.faq-question').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.open = !item.open;
      }
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      
      // Show/hide clear button
      if (searchClear) {
        searchClear.classList.toggle('show', searchQuery.length > 0);
      }

      filterFAQs();
    });

    // Clear search
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.classList.remove('show');
        searchResults.classList.remove('show');
        filterFAQs();
      });
    }

    // Search on blur (with delay for click)
    let blurTimeout;
    searchInput.addEventListener('blur', () => {
      blurTimeout = setTimeout(() => {
        searchResults.classList.remove('show');
      }, 200);
    });

    searchInput.addEventListener('focus', () => {
      clearTimeout(blurTimeout);
      if (searchQuery.length > 0) {
        searchResults.classList.add('show');
      }
    });
  }

  // Filter FAQs
  function filterFAQs() {
    let visibleCount = 0;

    faqData.forEach(item => {
      const matchesSearch = searchQuery.length === 0 || 
        item.question.toLowerCase().includes(searchQuery) ||
        item.answer.toLowerCase().includes(searchQuery);
      
      const matchesCategory = currentCategory === 'all' || 
        item.category === currentCategory;
      
      const isVisible = matchesSearch && matchesCategory;
      
      item.element.classList.toggle('hidden', !isVisible);
      
      if (isVisible) {
        visibleCount++;
        
        // Update search result preview
        if (searchQuery.length > 0 && matchesSearch) {
          // Show in search results dropdown
        }
      }
    });

    // Update search results dropdown
    updateSearchResults();

    // Update counter
    if (counter) {
      const total = faqData.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        return matchesCategory;
      }).length;
      
      counter.innerHTML = `<strong>${visibleCount}</strong> von ${total} Fragen beantwortet`;
    }
  }

  // Update search results dropdown
  function updateSearchResults() {
    if (!searchResults || searchQuery.length === 0) {
      if (searchResults) searchResults.classList.remove('show');
      return;
    }

    const matches = faqData.filter(item => 
      item.question.toLowerCase().includes(searchQuery) ||
      item.answer.toLowerCase().includes(searchQuery)
    ).slice(0, 5);

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="faq-search__no-results">
          Keine Ergebnisse für "${searchQuery}" gefunden
        </div>
      `;
    } else {
      searchResults.innerHTML = matches.map(item => {
        const highlighted = highlightMatch(item.question, searchQuery);
        return `
          <div class="faq-search__result" data-index="${item.index}">
            ${highlighted}
          </div>
        `;
      }).join('');

      // Bind click to results
      searchResults.querySelectorAll('.faq-search__result').forEach(result => {
        result.addEventListener('click', () => {
          const index = parseInt(result.dataset.index);
          const item = faqData[index];
          
          // Close all others
          faqItems.forEach(i => i.open = false);
          
          // Open target
          item.element.open = true;
          item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Clear search
          searchInput.value = '';
          searchQuery = '';
          searchResults.classList.remove('show');
          filterFAQs();
        });
      });
    }

    searchResults.classList.add('show');
  }

  // Highlight search match
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  // Escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Category filtering
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterFAQs();
    });
  });

  // Expand/Collapse All
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      faqItems.forEach(item => {
        item.open = true;
      });
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      faqItems.forEach(item => {
        item.open = false;
      });
    });
  }

  // FAQ Feedback
  faqItems.forEach(item => {
    const feedbackContainer = item.querySelector('.faq-feedback');
    if (!feedbackContainer) return;

    const buttons = feedbackContainer.querySelectorAll('.faq-feedback__btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isPositive = btn.classList.contains('positive');
        
        // Remove active from siblings
        buttons.forEach(b => b.classList.remove('active', 'negative'));
        
        // Activate clicked
        btn.classList.add('active');
        if (!isPositive) {
          btn.classList.add('negative');
        }

        // Show thank you
        const thankYou = feedbackContainer.querySelector('.faq-feedback__thank');
        if (thankYou) {
          thankYou.style.display = 'block';
          setTimeout(() => {
            thankYou.style.display = 'none';
          }, 3000);
        }

        // Track feedback
        trackFAQFeedback(isPositive);
      });
    });
  });

  // Track FAQ feedback
  function trackFAQFeedback(isPositive) {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'faq_feedback', {
        event_category: 'engagement',
        event_label: isPositive ? 'helpful' : 'not_helpful'
      });
    }
  }

  // Initialize
  filterFAQs();

  // Open first item by default
  if (faqItems.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Optional: Open first item
    // faqItems[0].open = true;
  }
}

// Export for global use
window.initInteractiveFAQ = initInteractiveFAQ;