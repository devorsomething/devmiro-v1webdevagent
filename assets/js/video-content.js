/* Video Content JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initVideoContent();
});

/**
 * Video Content Configuration
 */
const videoContentConfig = {
  defaultVideoId: 'dQw4w9WgXcQ', // Replace with actual video ID
  videos: [
    {
      id: 'intro',
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: { de: 'DevMiro Intro', en: 'DevMiro Intro' },
      duration: '1:30',
      description: { de: 'Lernen Sie DevMiro kennen', en: 'Get to know DevMiro' }
    },
    {
      id: 'services',
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: { de: 'Unsere Leistungen', en: 'Our Services' },
      duration: '2:45',
      description: { de: 'Was wir für Sie tun können', en: 'What we can do for you' }
    },
    {
      id: 'case-study',
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: { de: 'Case Study: KMU Website', en: 'Case Study: SME Website' },
      duration: '3:20',
      description: { de: 'Ein Projekt von Anfang bis Ende', en: 'A project from start to finish' }
    },
    {
      id: 'testimonial',
      videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: { de: 'Kundenstimme', en: 'Customer Testimonial' },
      duration: '1:15',
      description: { de: 'Was unsere Kunden sagen', en: 'What our customers say' }
    }
  ]
};

/**
 * Get current language
 */
function getVideoLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize video content
 */
function initVideoContent() {
  const videoMain = document.querySelector('.video-main');
  const videoPlaylist = document.querySelector('.video-playlist');
  
  if (videoMain && videoPlaylist) {
    renderVideoPlaylist(videoPlaylist);
    initVideoThumbnails();
    initVideoPoster();
    
    // Track video impressions
    trackVideoImpression('intro');
  }
}

/**
 * Render video playlist
 */
function renderVideoPlaylist(container) {
  const lang = getVideoLang();
  
  container.innerHTML = videoContentConfig.videos.map((video, index) => `
    <button class="video-thumb ${index === 0 ? 'active' : ''}" data-video-id="${video.id}" data-video-src="${video.videoId}">
      <span class="video-thumb__number">${index + 1}</span>
      <div class="video-thumb__content">
        <span class="video-thumb__title">${video.title[lang] || video.title.de}</span>
        <span class="video-thumb__duration">${video.duration}</span>
      </div>
      <svg class="video-thumb__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </button>
  `).join('');
}

/**
 * Initialize video thumbnails
 */
function initVideoThumbnails() {
  const thumbs = document.querySelectorAll('.video-thumb');
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      
      // Get video ID
      const videoId = thumb.dataset.videoId;
      const videoSrc = thumb.dataset.videoSrc;
      
      // Load video
      loadVideo(videoId, videoSrc);
      
      // Track click
      trackVideoClick(videoId);
    });
  });
}

/**
 * Load video
 */
function loadVideo(videoId, videoSrc) {
  const iframe = document.querySelector('.video-container iframe');
  const poster = document.querySelector('.video-poster');
  
  if (iframe) {
    iframe.src = `https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0`;
  }
  
  if (poster) {
    poster.classList.add('hidden');
  }
  
  // Find video config
  const video = videoContentConfig.videos.find(v => v.id === videoId);
  if (video) {
    document.title = `${video.title[getVideoLang()] || video.title.de} | DevMiro`;
  }
}

/**
 * Initialize video poster (click to play)
 */
function initVideoPoster() {
  const poster = document.querySelector('.video-poster');
  
  if (poster) {
    poster.addEventListener('click', () => {
      const iframe = document.querySelector('.video-container iframe');
      const firstVideo = videoContentConfig.videos[0];
      
      if (iframe && firstVideo) {
        loadVideo(firstVideo.id, firstVideo.videoId);
        trackVideoClick(firstVideo.id);
      }
    });
  }
}

/**
 * Track video impression
 */
function trackVideoImpression(videoId) {
  if (window.journeyTrack) {
    window.journeyTrack.track('video_impression', {
      video_id: videoId,
      page_url: window.location.href
    });
  }
  
  // Google Analytics event (if available)
  if (window.gtag) {
    window.gtag('event', 'video_impression', {
      video_id: videoId,
      page_location: window.location.href
    });
  }
}

/**
 * Track video click
 */
function trackVideoClick(videoId) {
  if (window.journeyTrack) {
    window.journeyTrack.track('video_click', {
      video_id: videoId,
      page_url: window.location.href
    });
  }
  
  // Google Analytics event (if available)
  if (window.gtag) {
    window.gtag('event', 'video_click', {
      video_id: videoId,
      page_location: window.location.href
    });
  }
}

/**
 * Track video complete
 */
function trackVideoComplete(videoId) {
  if (window.journeyTrack) {
    window.journeyTrack.track('video_complete', {
      video_id: videoId,
      page_url: window.location.href
    });
  }
  
  // Google Analytics event (if available)
  if (window.gtag) {
    window.gtag('event', 'video_complete', {
      video_id: videoId,
      page_location: window.location.href
    });
  }
}

// Export for global use
window.videoContentConfig = videoContentConfig;
window.loadVideo = loadVideo;
window.trackVideoComplete = trackVideoComplete;