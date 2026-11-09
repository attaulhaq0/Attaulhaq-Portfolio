export interface ClientWebsite {
  id: string;
  name: string;
  domain: string;
  contribution: string;
  liveUrl: string;
  sourceUrl: string;
  setupUrl: string;
  image: string;
  imageAlt: string;
  evidence: string[];
  setupLabel?: string;
  stack?: string[];
  motion?: { src: string; poster: string; width: number; height: number; caption: string };
  fullHomepage?: { image: string; imageAlt: string; width: number; height: number };
}

export const clientWebsites: ClientWebsite[] = [
  {
    id: 'narrcorp',
    name: 'Narrcorp',
    domain: 'narrcorp.com',
    contribution: 'I designed and built a technology-services website with a layered animated hero, original service copy and a clear email contact journey. I carried the work through responsive QA, technical SEO and the Hostinger launch.',
    liveUrl: 'https://narrcorp.com/',
    sourceUrl: 'https://github.com/attaulhaq0/narrcorp-website',
    setupUrl: 'https://github.com/attaulhaq0/narrcorp-website/blob/main/docs/development-guide.md',
    setupLabel: 'Build & deployment guide',
    image: '/images/client-work/narrcorp-devices.webp',
    imageAlt: 'Narrcorp desktop hero and mobile opening section in a responsive website composition.',
    stack: ['Astro', 'TypeScript', 'CSS'],
    motion: {
      src: '/media/narrcorp-hero-motion.mp4',
      poster: '/images/client-work/narrcorp-hero-poster.webp',
      width: 1200,
      height: 944,
      caption: 'Play the hero animation · 16 seconds · silent',
    },
    evidence: [
      'Art direction: serif headlines, green accents and layered interface motion, with separate desktop, tablet and mobile hero assets.',
      'Content and interactions: eight service areas, industry tabs, an expertise carousel and native guidance disclosures.',
      'Delivery: static Astro output, canonical URLs, sitemap, structured service data and Hostinger configuration.',
      'QA: responsive layout, keyboard navigation, reduced-motion behavior, production links and release-file verification.',
    ],
  },
  {
    id: 'artechsusa',
    name: 'Artechs USA',
    domain: 'artechsusa.com',
    contribution: 'I designed and built responsive service, staffing and careers pages, including the contact and job application interfaces.',
    liveUrl: 'https://artechsusa.com/',
    sourceUrl: 'https://github.com/attaulhaq0/artechsusa-website',
    setupUrl: 'https://github.com/attaulhaq0/artechsusa-website/blob/main/README.md',
    image: '/images/client-work/artechsusa-devices.webp',
    imageAlt: 'Real Artechs USA website UI shown in desktop and mobile compositions.',
    evidence: [
      'Responsive navigation and layouts across services, industries, staffing and careers.',
      'Contact and application page flows, with backend setup documented in the source.',
      'Canonical URLs, sitemap and JSON-LD structured data in the website source.',
    ],
  },
  {
    id: 'arissoft',
    fullHomepage: { image: '/images/client-work/arissoft-homepage-full.webp', width: 1440, height: 4675, imageAlt: 'Actual Arissoft desktop homepage from its opening section to the footer.' },
    name: 'Arissoft',
    domain: 'arissoft.tech',
    contribution: 'I designed and built a responsive company website with connected services, about and contact pages.',
    liveUrl: 'https://arissoft.tech/',
    sourceUrl: 'https://github.com/attaulhaq0/arissoft-website',
    setupUrl: 'https://github.com/attaulhaq0/arissoft-website/blob/main/database/README.md',
    image: '/images/client-work/arissoft-devices.webp',
    imageAlt: 'Real Arissoft desktop homepage and mobile About page shown in a device composition.',
    evidence: [
      'Responsive home, services, about and contact pages with shared navigation.',
      'Contact interface and documented database/backend setup in the source.',
      'Homepage Open Graph and Twitter metadata for shared links.',
    ],
  },
  {
    id: 'sira-studios',
    name: 'Sira Studios',
    domain: 'sirastudios.com',
    contribution: 'I designed and built the responsive studio website across company, brand, investor and careers pages.',
    liveUrl: 'https://sirastudios.com/',
    sourceUrl: 'https://github.com/attaulhaq0/sira-studios-website',
    setupUrl: 'https://github.com/attaulhaq0/sira-studios-website/blob/main/database/README.md',
    image: '/images/client-work/sira-studios-devices.webp',
    imageAlt: 'Real Sira Studios website UI shown in desktop and mobile compositions.',
    evidence: [
      'Responsive company, services, brand and investor information pages.',
      'Contact and careers interfaces, with database/backend setup in the source.',
      'Homepage Open Graph and Twitter metadata for shared links.',
    ],
  },
  {
    id: 'theeb1',
    fullHomepage: { image: '/images/client-work/theeb1-homepage-full.webp', width: 1440, height: 5473, imageAlt: 'Actual The EB1 desktop homepage from its opening section to the footer.' },
    name: 'The EB1',
    domain: 'theeb1.com',
    contribution: 'I designed and built a responsive website with visa service pages, company information and a clear contact interface.',
    liveUrl: 'https://theeb1.com/',
    sourceUrl: 'https://github.com/attaulhaq0/theeb1-website',
    setupUrl: 'https://github.com/attaulhaq0/theeb1-website/blob/main/database/README.md',
    image: '/images/client-work/theeb1-devices.webp',
    imageAlt: 'Real The EB1 website UI shown in desktop and mobile compositions.',
    evidence: [
      'Responsive EB-1A, EB-2 NIW and O-1A service pages, FAQs and company pages.',
      'Contact interface and documented database/backend setup in the source.',
      'Homepage Open Graph and Twitter metadata for shared links.',
    ],
  },
];
