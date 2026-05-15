/* Interactive Timeline JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  const timeline = document.querySelector('.timeline-interactive, .timeline');
  if (!timeline) return;

  initTimeline(timeline);
});

function initTimeline(timeline) {
  const items = timeline.querySelectorAll('.timeline-item');
  const progressBar = timeline.querySelector('.timeline-progress');
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Update progress bar
        updateProgressBar(timeline, items);
        
        itemObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  items.forEach((item, index) => {
    itemObserver.observe(item);
    
    // Add click handler for expand/collapse
    const expandBtn = item.querySelector('.timeline-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        toggleTimelineItem(item);
      });
    }

    // Add click handler for the entire card
    const content = item.querySelector('.timeline-content');
    if (content) {
      content.addEventListener('click', () => {
        toggleTimelineItem(item);
      });
    }
  });

  // Update progress bar on scroll
  if (progressBar) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateProgressBar(timeline, items);
        }
      });
    }, { threshold: 0 });

    items.forEach(item => progressObserver.observe(item));
  }
}

function toggleTimelineItem(item) {
  const wasExpanded = item.classList.contains('expanded');
  
  // Close all items
  document.querySelectorAll('.timeline-item').forEach(i => {
    i.classList.remove('expanded', 'active');
  });

  // Open clicked item
  if (!wasExpanded) {
    item.classList.add('expanded', 'active');
    
    // Close others (accordion behavior)
    // Uncomment next line for accordion mode
    // Close other items if you want only one open
  }
}

function updateProgressBar(timeline, items) {
  const progressBar = timeline.querySelector('.timeline-progress');
  if (!progressBar) return;

  const timelineRect = timeline.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;

  let visibleCount = 0;
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.8) {
      visibleCount++;
    }
  });

  const progress = (visibleCount / items.length) * 100;
  progressBar.style.height = `${progress}%`;
}

// Smooth scroll to timeline item
function scrollToTimelineItem(index) {
  const items = document.querySelectorAll('.timeline-item');
  if (items[index]) {
    const item = items[index];
    item.classList.add('expanded', 'active');
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Timeline data (for dynamic generation)
const timelineData = [
  {
    step: '01',
    icon: 'chat',
    title: 'Kostenloses Erstgespräch',
    description: 'Wir besprechen Ihre Anforderungen und Ziele.',
    details: [
      'Bedürfnis-Analyse',
      'Budget-Kalkulation',
      'Zeitrahmen-Planung'
    ],
    duration: '30 Minuten'
  },
  {
    step: '02',
    icon: 'design',
    title: 'Design & Konzept',
    description: 'Erstellung eines maßgeschneiderten Konzepts.',
    details: [
      'Wireframes & Prototypen',
      'Design-Entwürfe',
      'Feedback-Schleife'
    ],
    duration: '3-5 Tage'
  },
  {
    step: '03',
    icon: 'code',
    title: 'Entwicklung',
    description: 'Technische Umsetzung mit höchster Qualität.',
    details: [
      'Responsive Entwicklung',
      'Performance-Optimierung',
      'Regelmäßige Updates'
    ],
    duration: '2-4 Wochen'
  },
  {
    step: '04',
    icon: 'launch',
    title: 'Launch & Support',
    description: 'Publikation und laufende Betreuung.',
    details: [
      'Go-Live Prozess',
      'Schulung & Dokumentation',
      'Wartung & Support'
    ],
    duration: '1-2 Wochen'
  }
];

// Export for dynamic rendering
window.timelineData = timelineData;
window.scrollToTimelineItem = scrollToTimelineItem;
window.toggleTimelineItem = toggleTimelineItem;