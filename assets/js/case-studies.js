/* Case Studies JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initCaseStudies();
});

/**
 * Case Studies Configuration
 */
const caseStudiesConfig = {
  studies: [
    {
      id: 'handwerk-website',
      company: 'Regionaler Handwerksbetrieb',
      industry: 'Handwerk',
      industryLabel: { de: 'Handwerk', en: 'Craft' },
      location: 'Feldkirch, Vorarlberg',
      challenge: { 
        de: 'Veraltete Website, keine Online-Buchungen, wenig Traffic',
        en: 'Outdated website, no online bookings, low traffic'
      },
      solution: { 
        de: 'Neue responsive Website mit Buchungssystem und SEO-Optimierung',
        en: 'New responsive website with booking system and SEO optimization'
      },
      duration: '6 Wochen',
      icon: '🔧',
      results: [
        { value: '+150%', label: { de: 'Online-Buchungen', en: 'Online Bookings' } },
        { value: '-40%', label: { de: 'Telefonanfragen', en: 'Phone Calls' } },
        { value: '3x', label: { de: 'Mehr Traffic', en: 'More Traffic' } },
        { value: '95', label: { de: 'Lighthouse Score', en: 'Lighthouse Score' } }
      ],
      testimonial: {
        text: { 
          de: 'DevMiro hat unsere Online-Präsenz revolutioniert. Innerhalb von 3 Monaten haben wir unsere Buchungen verdoppelt.',
          en: 'DevMiro has revolutionized our online presence. Within 3 months we doubled our bookings.'
        },
        author: 'Max Mustermann',
        role: { de: 'Geschäftsführer', en: 'CEO' }
      }
    },
    {
      id: 'restaurant-website',
      company: 'Restaurant Zentrum',
      industry: 'Gastro',
      industryLabel: { de: 'Gastronomie', en: 'Restaurant' },
      location: 'Dornbirn, Vorarlberg',
      challenge: { 
        de: 'Keine Online-Speisekarte, keine Reservierungsoption',
        en: 'No online menu, no reservation option'
      },
      solution: { 
        de: 'Interaktive Speisekarte mit Online-Reservierung und Social Media Integration',
        en: 'Interactive menu with online reservations and social media integration'
      },
      duration: '4 Wochen',
      icon: '🍽️',
      results: [
        { value: '+80%', label: { de: 'Reservierungen', en: 'Reservations' } },
        { value: '+200%', label: { de: 'Social Media', en: 'Social Media' } },
        { value: '4.8★', label: { de: 'Google Rating', en: 'Google Rating' } },
        { value: '60%', label: { de: 'Mobile Bookings', en: 'Mobile Bookings' } }
      ],
      testimonial: {
        text: { 
          de: 'Die neue Website hat unseren Gästen das Leben leichter gemacht. Unsere Online-Reservierungen sind um 80% gestiegen.',
          en: 'The new website has made life easier for our guests. Our online reservations increased by 80%.'
        },
        author: 'Anna Beispiel',
        role: { de: 'Inhaberin', en: 'Owner' }
      }
    },
    {
      id: 'arztpraxis-website',
      company: 'Arztpraxis Gesunde Medizin',
      industry: 'Gesundheit',
      industryLabel: { de: 'Gesundheit', en: 'Healthcare' },
      location: 'Bregenz, Vorarlberg',
      challenge: { 
        de: 'Patienten mussten für Terminvereinbarung anrufen, lange Wartezeiten',
        en: 'Patients had to call for appointments, long waiting times'
      },
      solution: { 
        de: 'Online-Terminbuchung mit Erinnerungssystem und Patientendaten-Verwaltung',
        en: 'Online appointment booking with reminder system and patient data management'
      },
      duration: '8 Wochen',
      icon: '🏥',
      results: [
        { value: '-60%', label: { de: 'Weniger Anrufe', en: 'Fewer Calls' } },
        { value: '45min', label: { de: 'Gesparte Zeit/Tag', en: 'Time Saved/Day' } },
        { value: '+95%', label: { de: 'Patienten-Zufriedenheit', en: 'Patient Satisfaction' } },
        { value: '24/7', label: { de: 'Terminbuchung', en: 'Booking Available' } }
      ],
      testimonial: {
        text: { 
          de: 'Endlich können Patienten rund um die Uhr Termine buchen. Das hat unsere Telefonwartezeiten drastisch reduziert.',
          en: 'Finally patients can book appointments around the clock. This has drastically reduced our phone waiting times.'
        },
        author: 'Dr. Hans Beispiel',
        role: { de: 'Praktischer Arzt', en: 'General Practitioner' }
      }
    },
    {
      id: 'online-shop',
      company: 'Lokaler Onlineshop',
      industry: 'E-commerce',
      industryLabel: { de: 'E-Commerce', en: 'E-commerce' },
      location: 'Hohenems, Vorarlberg',
      challenge: { 
        de: 'Bestehender Shop mit schlechter Conversion, hohe Abbruchrate',
        en: 'Existing shop with poor conversion, high abandonment rate'
      },
      solution: { 
        de: 'Komplette Shop-Redesign mit UX-Verbesserungen und Performance-Optimierung',
        en: 'Complete shop redesign with UX improvements and performance optimization'
      },
      duration: '10 Wochen',
      icon: '🛒',
      results: [
        { value: '+45%', label: { de: 'Conversion Rate', en: 'Conversion Rate' } },
        { value: '-35%', label: { de: 'Abbruchrate', en: 'Abandonment Rate' } },
        { value: '+60%', label: { de: 'Umsatz', en: 'Revenue' } },
        { value: '98', label: { de: 'Lighthouse Score', en: 'Lighthouse Score' } }
      ],
      testimonial: {
        text: { 
          de: 'Die neue Website hat unsereConversion verdoppelt. Die Investition hat sich in 3 Monaten amortisiert.',
          en: 'The new website doubled our conversion. The investment paid for itself in 3 months.'
        },
        author: 'Thomas Shop',
        role: { de: 'Inhaber', en: 'Owner' }
      }
    }
  ]
};

/**
 * Get current language
 */
function getCaseStudiesLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize case studies
 */
function initCaseStudies() {
  const caseStudiesGrid = document.querySelector('.case-studies__grid');
  
  if (caseStudiesGrid) {
    renderCaseStudies(caseStudiesGrid);
  }
}

/**
 * Render case studies
 */
function renderCaseStudies(container) {
  const lang = getCaseStudiesLang();
  
  container.innerHTML = caseStudiesConfig.studies.map(study => {
    const industryLabel = study.industryLabel[lang] || study.industryLabel.de;
    const challenge = study.challenge[lang] || study.challenge.de;
    const solution = study.solution[lang] || study.solution.de;
    const testimonialText = study.testimonial.text[lang] || study.testimonial.text.de;
    const testimonialRole = study.testimonial.role[lang] || study.testimonial.role.de;
    
    return `
      <article class="case-study" data-study-id="${study.id}">
        <div class="case-study__header">
          <span class="case-study__industry">${industryLabel}</span>
          <span class="case-study__icon">${study.icon}</span>
        </div>
        <div class="case-study__content">
          <h3 class="case-study__company">${study.company}</h3>
          <p class="case-study__location">${study.location}</p>
          
          <p class="case-study__challenge">
            <strong>${lang === 'de' ? 'Herausforderung:' : 'Challenge:'}</strong> ${challenge}<br>
            <strong>${lang === 'de' ? 'Lösung:' : 'Solution:'}</strong> ${solution}<br>
            <small>${lang === 'de' ? 'Dauer:' : 'Duration:'} ${study.duration}</small>
          </p>
          
          <div class="case-study__results">
            ${study.results.map(result => {
              const label = result.label[lang] || result.label.de;
              return `
                <div class="case-study__result">
                  <div class="case-study__result-value">${result.value}</div>
                  <div class="case-study__result-label">${label}</div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="case-study__testimonial">
            <p class="case-study__testimonial-text">"${testimonialText}"</p>
            <p class="case-study__testimonial-author">
              <strong>${study.testimonial.author}</strong>, ${testimonialRole}
            </p>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  // Track impressions
  trackCaseStudiesImpression();
}

/**
 * Track case studies impression
 */
function trackCaseStudiesImpression() {
  if (window.journeyTrack) {
    window.journeyTrack.track('case_studies_view', {
      count: caseStudiesConfig.studies.length,
      page_url: window.location.href
    });
  }
}

/**
 * Get case study by ID
 */
function getCaseStudy(id) {
  return caseStudiesConfig.studies.find(s => s.id === id);
}

// Export for global use
window.caseStudiesConfig = caseStudiesConfig;
window.getCaseStudy = getCaseStudy;