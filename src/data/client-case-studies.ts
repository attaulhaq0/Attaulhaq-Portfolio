/** Client delivery stories; the collection owns the shared URLs and media. */
export interface ClientCaseStudy {
  slug: string;
  websiteId: string;
  headline: string;
  summary: string;
  brief: string[];
  scope: string;
  ownership: string;
  decisions: { title: string; body: string }[];
  visualTitle: string;
  visualBody: string;
  motionCaption: string;
  engineering: { title: string; body: string }[];
  validation: { title: string; body: string }[];
  outcome: string;
  nextStep: string;
}

export const clientCaseStudies: ClientCaseStudy[] = [
  {
    slug: 'narrcorp',
    websiteId: 'narrcorp',
    headline: 'Connecting the work with the people to deliver it.',
    summary: 'An end-to-end landing page for technology services and specialist talent: clear service content, a layered motion identity and a static Hostinger launch.',
    scope: 'Single landing page · Technology services & talent',
    brief: [
      'Narrcorp needed to explain a broad offer without making visitors navigate a large corporate website. A business team might need a defined software project, help connecting existing systems or additional specialist capacity. The page had to make those engagement options understandable together.',
      'I shaped the supplied business content into one journey: understand the proposition, explore the work offered, consider a relevant delivery context and start an enquiry. The client wanted a simple landing page, so I kept service detail within the page instead of expanding it into separate routes.',
    ],
    ownership: 'I took the work from the client brief through content refinement, visual direction, asset generation and preparation, responsive development, animation, QA, technical SEO and production deployment. I also prepared the source and release instructions for future updates.',
    decisions: [
      {
        title: 'Describe the work before the technology.',
        body: 'I organized eight services around practical needs: technology strategy, workflow automation, software engineering, business system integration, data and applied AI, cloud delivery operations, quality and security, and specialist staffing. Each card explains the scope in plain language and pairs it with a focused enquiry action. This gives a visitor concrete work to discuss with the business.',
      },
      {
        title: 'Keep depth inside a focused page.',
        body: 'Service disclosures, industry tabs and guidance let visitors explore at their own pace. A finance, healthcare or retail context changes the planning discussion without implying a completed customer engagement. I used the same principle for the closing questions: answer decisions about scope and staffing where they help the enquiry, while keeping the primary journey visible.',
      },
      {
        title: 'Give motion a clear job.',
        body: 'The hero connects specialist imagery with interface panels, moving platform badges and delivery cues. It introduces the relationship between technical work and people rather than presenting animation as a separate attraction. Supporting motion guides attention through the headline and sections, with a readable static experience for reduced-motion preferences.',
      },
    ],
    visualTitle: 'A complete visual system, down to the moving edges.',
    visualBody: 'I generated and prepared imagery, refined image crops and designed the green, mint and white composition. The review extended to small details: one portrait per section, a single lower badge ribbon, complete ecosystem icons, clean cursor and pill edges, and continuous hero loops. Mobile and tablet compositions adapt the layers so the message and action remain usable.',
    motionCaption: 'Hero animation export · 16 seconds. The composition brings interface panels, platform badges and specialist imagery into a continuous loop.',
    engineering: [
      {
        title: 'A static site with targeted browser behavior.',
        body: 'I built the page with Astro, TypeScript and CSS, using GSAP and SplitType for browser motion. Typed content separates the service copy from presentation. The production build outputs HTML and assets for Hostinger, with no Node application server required. Navigation, disclosures, industry tabs and the expertise carousel receive their own keyboard and responsive behavior.',
      },
      {
        title: 'An enquiry path that matches the scope.',
        body: 'Contact actions open the visitor’s email application with relevant context. I kept email access in the header and footer and used action labels elsewhere to avoid repeating the address across the page. Consent-based Google Analytics records page views and contact clicks after acceptance; a click is an interaction signal, not confirmation that an enquiry was sent.',
      },
    ],
    validation: [
      {
        title: 'Visuals, content and access',
        body: 'I checked copy fit, image loading, motion loops and carousel endpoints across phone, tablet and desktop widths. Browser checks covered menu and Escape behavior, keyboard tabs, guidance links, JavaScript-free content and reduced motion. Automated accessibility checks complemented the manual interaction review.',
      },
      {
        title: 'Search and measurement',
        body: 'I added a descriptive title and summary, canonical URL, sitemap, social preview and structured service data that agrees with the page. Google Search Console ownership and sitemap processing were verified. Analytics checks covered first-visit blocking, acceptance, withdrawal and event delivery. Indexing and business performance need continued observation after launch.',
      },
      {
        title: 'Production and handover',
        body: 'I verified HTTPS, canonical redirects, genuine missing-page responses, asset loading and video byte-range support on Hostinger. Publication checks kept credentials and private working files out of the public repository and release. A saved release, deployment guide and maintenance checklist provide a path for updates and recovery.',
      },
    ],
    outcome: 'Narrcorp now has a live, focused page that connects service scope, delivery context and an enquiry action. The handover includes the source, static release and documented checks, so the next content update can follow the same build and verification process.',
    nextStep: 'The next review should use actual search queries and enquiries to refine the page, then add client-approved project evidence as it becomes available. This creates a basis for assessing which services attract interest and where visitors need more detail.',
  },
  {
    slug: 'ar-tech-inc',
    websiteId: 'artechsusa',
    headline: 'Two audiences. Clear paths through one business.',
    summary: 'A multi-page technology consulting and staffing website, taken from client content and visual direction through interactive development, PHP forms, QA and launch.',
    scope: '27 routes · Consulting, staffing & careers',
    brief: [
      'AR TECH INC serves people with different reasons to visit. A technology buyer needs to understand services and engagement options; a job seeker needs to reach career information and an application path. Putting both into one undifferentiated message would make the next step harder to find.',
      'I developed a shared site structure with distinct routes through services, industries, staffing and careers. The homepage introduces the business and lets visitors explore a discipline. Detail pages then explain that discipline and connect it to the appropriate project or career action.',
    ],
    ownership: 'My contribution covered the full delivery: improving the client’s content, developing the visual direction, generating and preparing assets, building the pages and motion, integrating PHP forms, checking accessibility and responsive behavior, completing technical SEO and preparing the production handover.',
    decisions: [
      {
        title: 'Separate the visitor’s goal at the point of action.',
        body: 'I gave project enquiries and career exploration distinct destinations while keeping navigation consistent across the site. Services, staffing and industry information support the business journey; career and application pages support the candidate journey. The distinction sits in the information architecture and action labels, so visitors do not have to interpret a generic contact button.',
      },
      {
        title: 'Turn a broad offer into specific explanations.',
        body: 'I refined the supplied content around the practical purpose of each service: maintainable cloud environments, useful data and reporting, better application workflows, dependable IT operations and connected enterprise systems. Staffing content explains the engagement arrangements. Service pages carry the detail, while the homepage gives a concise starting point.',
      },
      {
        title: 'Make exploration change something useful.',
        body: 'The homepage service explorer changes its supporting context and destination when a visitor selects Cloud, Data & AI, Custom Software or Managed IT. I connected each state to a relevant detail page, so the interaction helps someone decide what to explore next. The selected state, text and action stay aligned rather than changing imagery alone.',
      },
    ],
    visualTitle: 'A shared identity with room for service detail.',
    visualBody: 'I designed the page compositions, generated supporting graphics and prepared photography and responsive crops. Shared typography, navigation and motion create continuity across the routes, while each service page gives its own content space. I reviewed entrance timing and the service explorer alongside static content, so the interface remains understandable without animation.',
    motionCaption: 'Browser recording · 18 seconds. The homepage service explorer updates its context and destination as disciplines are selected.',
    engineering: [
      {
        title: 'Browser pages and server-side forms have different jobs.',
        body: 'The deployed frontend uses HTML, CSS and vanilla JavaScript. PHP and PHPMailer handle project enquiries and career applications. Local generation tooling assembles the pages and shared content for release, while the host serves the finished pages and runs the form handlers.',
      },
      {
        title: 'Treat the application flow as a delivery workflow.',
        body: 'I integrated server validation, expiring CSRF tokens, rate limits, PDF résumé handling and SMTP/TLS configuration, keeping credentials outside the public document root. Sixteen local integration tests exercise valid submissions and failure paths, including rejected attachments and certificate errors. Success states depend on the configured mail service accepting delivery. Production inbox checks remain part of acceptance.',
      },
    ],
    validation: [
      {
        title: 'Check the journey across routes',
        body: 'I reviewed desktop and mobile page layouts, navigation destinations, headings, image descriptions and service states. Keyboard and reduced-motion checks complement visual review. The multi-page structure also needs consistent contact and career routes, including usable error and completion states.',
      },
      {
        title: 'Give each page a search purpose',
        body: 'I prepared distinct titles and descriptions, canonical URLs, crawlable content and structured data. The sitemap covers 24 indexable pages, with application, confirmation and error pages excluded from search. Search Console verification and sitemap submission were completed. Consent-gated analytics supports later review of visitor behavior while excluding form details and résumé content.',
      },
      {
        title: 'Prepare the site for operation',
        body: 'The handover distinguishes public website files from private form configuration and documents the build and hosting requirements. Release checks cover links, missing pages, assets and form behavior. Source, configuration guidance and QA records help the owner maintain the site without treating a visual preview as proof of operational email delivery.',
      },
    ],
    outcome: 'The delivered website gives technology buyers a service-led route and candidates a dedicated career path, within one consistent identity. The public source and deployment guidance document both the frontend and PHP requirements, supporting future content changes and operational checks.',
    nextStep: 'The next review should examine actual project enquiries, candidate flow and search data with the business owner. Client-approved project evidence can strengthen the service pages, and observed journey problems can guide the next navigation or content improvement.',
  },
];
