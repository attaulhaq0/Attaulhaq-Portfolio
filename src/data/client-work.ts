export interface ClientWebsite {
  id: string; name: string; category: string; domain: string;
  need: string; contribution: string; decision: string; boundary: string;
  liveUrl: string; sourceUrl: string; setupUrl: string; setupLabel?: string;
  image: string; imageAlt: string; responsiveCaption: string;
  evidence: string[]; stack: string[];
  motion: { src: string; poster: string; width: number; height: number; duration: number; caption: string };
  detail: { image: string; alt: string; width: number; height: number; title: string; caption: string };
  fullHomepage?: { image: string; imageAlt: string; width: number; height: number };
}

export const clientWebsites: ClientWebsite[] = [
  {
    "id": "narrcorp",
    "name": "Narrcorp",
    "category": "Technology services & specialist talent",
    "need": "Bring consulting, engineering and staffing into one service narrative, with a direct way to start an enquiry.",
    "contribution": "I created the service copy and visual direction, built the static Astro website and carried it through responsive QA, technical SEO and the Hostinger launch.",
    "decision": "Service cards connect each offering to a concrete task and a relevant enquiry action. The layered hero introduces the same connection between systems and specialist skills.",
    "boundary": "Contact actions open the visitor's email application. The industry scenarios describe potential engagements, rather than completed client projects.",
    "evidence": [
      "Static output with canonical URLs, sitemap, structured service data and Hostinger configuration.",
      "Industry tabs, expertise carousel and native guidance disclosures; responsive and keyboard interaction checks."
    ],
    "stack": [
      "Astro",
      "TypeScript",
      "CSS"
    ],
    "responsiveCaption": "The desktop and mobile openings preserve the headline and primary action while adapting the layered composition.",
    "domain": "narrcorp.com",
    "liveUrl": "https://narrcorp.com/",
    "sourceUrl": "https://github.com/attaulhaq0/narrcorp-website",
    "setupUrl": "https://github.com/attaulhaq0/narrcorp-website/blob/main/docs/development-guide.md",
    "image": "/images/client-work/narrcorp-devices.webp",
    "imageAlt": "Narrcorp desktop homepage and mobile opening view in a responsive composition.",
    "detail": {
      "image": "/images/client-work/narrcorp-detail.webp",
      "alt": "Narrcorp software engineering card with service description, enquiry button and plan, build, test and release visual.",
      "width": 1136,
      "height": 600,
      "title": "From service to enquiry",
      "caption": "Software delivery: a complete service card pairs the work offered with its stages and a focused enquiry action."
    },
    "setupLabel": "Build & deployment guide",
    "motion": {
      "src": "/media/narrcorp-hero-motion.mp4",
      "poster": "/images/client-work/narrcorp-hero-poster.webp",
      "width": 1200,
      "height": 944,
      "duration": 16,
      "caption": "Layered hero: moving interface panels, platform badges and specialist imagery introduce the service offer."
    }
  },
  {
    "id": "artechsusa",
    "name": "AR TECH INC",
    "category": "Technology consulting & staffing",
    "need": "Give technology buyers and job seekers clear routes through services, industry information, staffing and careers.",
    "contribution": "I developed the service, industry, staffing and careers pages, with shared navigation, responsive layouts and PHP-backed enquiry and application interfaces.",
    "decision": "The opening service explorer changes its supporting context when a visitor chooses a discipline. Separate project and career actions serve the site's two audiences.",
    "boundary": "The source includes form handlers and local integration tests. These captures demonstrate the interface; live email and résumé delivery require the server configuration.",
    "evidence": [
      "Shared service, industry, staffing and career routes with contact and application interfaces.",
      "Source includes canonical URLs, sitemap, JSON-LD and documented form handlers."
    ],
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP"
    ],
    "responsiveCaption": "The opening pairs service exploration with separate project and career actions; mobile reorganizes the navigation.",
    "domain": "artechsusa.com",
    "liveUrl": "https://artechsusa.com/",
    "sourceUrl": "https://github.com/attaulhaq0/artechsusa-website",
    "setupUrl": "https://github.com/attaulhaq0/artechsusa-website/blob/main/README.md",
    "image": "/images/client-work/artechsusa-devices.webp",
    "imageAlt": "AR TECH INC desktop homepage and mobile opening view in a responsive composition.",
    "detail": {
      "image": "/images/client-work/artechsusa-detail.webp",
      "alt": "AR TECH INC cloud and DevOps service page with a service heading and supporting content.",
      "width": 1425,
      "height": 990,
      "title": "One service, explained",
      "caption": "The cloud-service page gives one discipline its own explanation and contact route, beyond the homepage overview."
    },
    "motion": {
      "src": "/media/artechsusa-motion.mp4",
      "poster": "/images/client-work/artechsusa-poster.webp",
      "width": 1200,
      "height": 750,
      "duration": 18,
      "caption": "Service explorer: selecting Cloud, Data & AI, Custom Software or Managed IT changes the context and destination."
    }
  },
  {
    "id": "arissoft",
    "name": "Arissoft",
    "category": "Software & IT services",
    "need": "Present an IT company's services and industry contexts, then connect that overview to company information and contact.",
    "contribution": "I built four connected pages in React and TypeScript, including the animated three-slide hero, responsive navigation and contact feedback.",
    "decision": "Three opening messages share one navigation and action pattern. Supporting pages carry the introduction into company context and detailed services.",
    "boundary": "Database-backed content and contact delivery require the documented PHP/MySQL setup. A visual preview does not establish successful message delivery.",
    "evidence": [
      "Connected home, services, About and contact routes with reusable layouts.",
      "PHP content and contact endpoints, with the database setup documented in the repository."
    ],
    "stack": [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PHP"
    ],
    "responsiveCaption": "Desktop homepage and mobile About view: the opening presentation gives way to readable company information.",
    "domain": "arissoft.tech",
    "liveUrl": "https://arissoft.tech/",
    "sourceUrl": "https://github.com/attaulhaq0/arissoft-website",
    "setupUrl": "https://github.com/attaulhaq0/arissoft-website/blob/main/database/README.md",
    "image": "/images/client-work/arissoft-devices.webp",
    "imageAlt": "Arissoft desktop homepage and mobile About page in a responsive composition.",
    "detail": {
      "image": "/images/client-work/arissoft-detail.webp",
      "alt": "Arissoft About page showing company information beneath the shared website navigation.",
      "width": 1425,
      "height": 990,
      "title": "Beyond the opening",
      "caption": "The About view places the company profile and three value cards beneath the shared navigation."
    },
    "motion": {
      "src": "/media/arissoft-motion.mp4",
      "poster": "/images/client-work/arissoft-poster.webp",
      "width": 1200,
      "height": 750,
      "duration": 24,
      "caption": "Three-slide opening: headlines, highlighted text and image masks transition together while the Find Talent and Find Job actions remain available."
    },
    "fullHomepage": {
      "image": "/images/client-work/arissoft-homepage-full.webp",
      "imageAlt": "Complete Arissoft desktop homepage.",
      "width": 1440,
      "height": 4675
    }
  },
  {
    "id": "sira-studios",
    "name": "Sira Studios",
    "category": "Creative production & brand content",
    "need": "Give prospective clients, investors and job applicants distinct entry points within one studio website.",
    "contribution": "I developed the studio, services, brand-work, investor and careers routes, pairing a photographic opening with a creative-work carousel and enquiry interfaces.",
    "decision": "A browsable creative-work strip establishes the studio's visual identity. Audience-specific navigation leads into more detailed services, investor and careers information.",
    "boundary": "The captures show public pages. Private account records and submitted enquiries are excluded from this showcase.",
    "evidence": [
      "Seven public routes support studio, services, brands, investors, careers and contact journeys.",
      "The source includes enquiry, application and account APIs with documented server setup."
    ],
    "stack": [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PHP"
    ],
    "responsiveCaption": "Desktop and mobile openings show how the photographic hero and primary project action adapt across screen sizes.",
    "domain": "sirastudios.com",
    "liveUrl": "https://sirastudios.com/",
    "sourceUrl": "https://github.com/attaulhaq0/sira-studios-website",
    "setupUrl": "https://github.com/attaulhaq0/sira-studios-website/blob/main/database/README.md",
    "image": "/images/client-work/sira-studios-devices.webp",
    "imageAlt": "Sira Studios desktop homepage and mobile opening view in a responsive composition.",
    "detail": {
      "image": "/images/client-work/sira-studios-detail.webp",
      "alt": "Sira Studios services page with the studio navigation and categorized creative offerings.",
      "width": 1425,
      "height": 990,
      "title": "Creative work to services",
      "caption": "The services view groups the studio's offering into categories, giving visitors a route beyond the visual introduction."
    },
    "motion": {
      "src": "/media/sira-studios-motion.mp4",
      "poster": "/images/client-work/sira-studios-poster.webp",
      "width": 1200,
      "height": 750,
      "duration": 13,
      "caption": "Creative-work carousel: previous and next controls move between visual content without leaving the page."
    }
  },
  {
    "id": "theeb1",
    "name": "theEb1",
    "category": "Immigration guidance & consultation",
    "need": "Organize EB-1A, EB-2 NIW and O-1A service information so visitors can explore a relevant route before making a consultation enquiry.",
    "contribution": "I built visa-service, FAQ, company and consultation pages using reusable content sections, animated headings and responsive navigation.",
    "decision": "The rotating opening introduces separate visa routes, while dedicated service and FAQ pages accommodate the detail needed before an enquiry.",
    "boundary": "Local review uses fallback content and simulated form success. Production enquiries require the PHP integration; published client claims are not measured outcomes of my website work.",
    "evidence": [
      "Twelve public routes include visa information, FAQs, company content and consultation.",
      "Reusable interface sections and PHP content/form endpoints are included in the source."
    ],
    "stack": [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PHP"
    ],
    "responsiveCaption": "Desktop and mobile openings keep the service introduction and profile-evaluation action visible at each size.",
    "domain": "theeb1.com",
    "liveUrl": "https://theeb1.com/",
    "sourceUrl": "https://github.com/attaulhaq0/theeb1-website",
    "setupUrl": "https://github.com/attaulhaq0/theeb1-website/blob/main/database/README.md",
    "image": "/images/client-work/theeb1-devices.webp",
    "imageAlt": "theEb1 desktop homepage and mobile opening view in a responsive composition.",
    "detail": {
      "image": "/images/client-work/theeb1-detail.webp",
      "alt": "theEb1 EB-1A page showing the visa definition, USCIS criteria and consultation navigation.",
      "width": 1425,
      "height": 990,
      "title": "EB-1A, explained",
      "caption": "The EB-1A view separates the visa definition from a scannable criteria list, with consultation access in the shared navigation."
    },
    "motion": {
      "src": "/media/theeb1-motion.mp4",
      "poster": "/images/client-work/theeb1-poster.webp",
      "width": 1200,
      "height": 584,
      "duration": 21,
      "caption": "Rotating service headline: the opening moves through EB1A, O1A and EB2-NIW messages above the enquiry action."
    },
    "fullHomepage": {
      "image": "/images/client-work/theeb1-homepage-full.webp",
      "imageAlt": "Complete theEb1 desktop homepage.",
      "width": 1440,
      "height": 5473
    }
  }
];
