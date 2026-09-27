export type Project = {
  slug: string;
  index: string;
  name: string;
  category: string;
  year: string;
  role: string;
  timeframe: string;
  summary: string;
  description: string;
  cover: string;
  coverAlt: string;
  theme: 'light' | 'dark' | 'olive' | 'amber';
  tags: string[];
  featured: boolean;
  overview: string;
  contributions: { title: string; body: string }[];
  system: { title: string; body: string }[];
  designConsiderations: { title: string; body: string }[];
  scopeNote: string;
  external?: { label: string; url: string };
  media?: {
    src: string;
    poster: string;
    caption: string;
    captions?: string;
    transcript?: string;
  };
};

export const projects: Project[] = [
  {
    slug: 'edeviser',
    index: '01',
    name: 'E Deviser',
    category: 'AI-native education',
    year: '2025–present',
    role: 'Co-Founder & Chief Product Officer',
    timeframe: 'February 2025–present',
    summary: 'Connecting learning goals, role-aware experiences and AI assistance in education.',
    description: 'I lead product strategy and contribute to the architecture and development of an AI-native education platform, bringing together outcome-based education, personalized learning and gamification.',
    cover: '/images/edeviser.svg',
    coverAlt: 'Original conceptual illustration for E Deviser, an AI-native education project.',
    theme: 'light',
    tags: ['Product strategy', 'Education', 'RAG', 'Role-based workflows'],
    featured: true,
    overview: 'An education platform serves people with different responsibilities: administrators, coordinators, teachers, students and parents. My work at E Deviser connects those perspectives through Arabic and English workflows, with attention to relevant learning context, scoped retrieval and approval-gated AI actions.',
    contributions: [
      { title: 'Product direction', body: 'I lead product strategy across outcome-based education, personalized learning and gamification.' },
      { title: 'Role-aware experiences', body: 'I contribute to architecture and development for workflows shaped around educational roles and Arabic/English use.' },
      { title: 'Bounded AI assistance', body: 'My work includes agentic and retrieval-augmented systems with controlled autonomy, alongside testing, security and observability practices.' },
    ],
    system: [
      { title: 'Role context', body: 'Start with the person’s educational role and the task they need to complete.' },
      { title: 'Permitted workflow', body: 'Frame the task within the information and actions relevant to that role.' },
      { title: 'Scoped retrieval', body: 'Bring permitted learning or institutional context into the request.' },
      { title: 'Proposed assistance', body: 'Connect that context to a suggested response or action.' },
      { title: 'Approval boundary', body: 'Place human approval between sensitive proposals and their execution.' },
    ],
    designConsiderations: [
      { title: 'Relevance without overexposure', body: 'Personalization is most useful when the context remains appropriate to the person’s role. More retrieved information is not necessarily better information.' },
      { title: 'Assistance without unchecked autonomy', body: 'An AI suggestion and permission to act are separate concerns. Sensitive educational workflows benefit from an explicit review boundary.' },
      { title: 'Clarity across languages', body: 'Arabic and English experiences call for consistent meaning and role expectations, not only translated interface labels.' },
    ],
    scopeNote: 'The system sequence is a conceptual summary of role-aware assistance, not a deployment diagram. The cover is original concept art; the considerations describe design tensions rather than a record of specific implementation decisions.',
    external: { label: 'Visit E Deviser', url: 'https://edeviser.com/' },
  },
  {
    slug: 'aegisops',
    index: '02',
    name: 'AegisOps',
    category: 'Voice-first operations',
    year: '2026–present',
    role: 'Product & system design',
    timeframe: 'January 2026–present',
    summary: 'Exploring how frontline voice reports become useful operational context.',
    description: 'My work spans a voice-first reporting experience and system design for security and multi-site operations, connecting multilingual input, sensitive-data handling, SOP retrieval and operational summaries.',
    cover: '/images/aegisops.svg',
    coverAlt: 'Original conceptual illustration for AegisOps, a voice-first operations project.',
    theme: 'dark',
    tags: ['Voice workflows', 'RAG', 'PostgreSQL', 'pgvector', 'RBAC'],
    featured: true,
    overview: 'Frontline reports contain valuable context, but spoken observations and operational records serve different purposes. AegisOps explores that transition through agentic AI, retrieval of standard operating procedures, issue correlation and shift synthesis. The design also addresses tenant boundaries, offline synchronization and cloud or sovereign deployment options.',
    contributions: [
      { title: 'Reporting experience', body: 'I work on the relationship between multilingual voice input, structured reports and the context needed by operational teams.' },
      { title: 'Operational intelligence', body: 'My system-design work connects RAG-based SOP retrieval, issue correlation, verification and shift summaries.' },
      { title: 'Data and access boundaries', body: 'The project’s design includes PII sanitization, multi-tenant access controls, PostgreSQL/pgvector and offline synchronization concerns.' },
    ],
    system: [
      { title: 'Voice report', body: 'Begin with a frontline observation expressed in the reporter’s language.' },
      { title: 'Processing and sanitization', body: 'Organize the report and consider which sensitive details belong in subsequent processing.' },
      { title: 'Operational context', body: 'Connect the observation with relevant SOP material and related issues.' },
      { title: 'Verification', body: 'Introduce a review boundary before treating generated interpretations as operational facts.' },
      { title: 'Shift summary', body: 'Bring the reviewed context into a concise view for operational follow-through.' },
    ],
    designConsiderations: [
      { title: 'Detail versus privacy', body: 'Reports need enough detail to be actionable without unnecessarily propagating personal information into retrieval and summaries.' },
      { title: 'Capture versus synchronization', body: 'Offline reporting raises questions about duplicate records, ordering and conflicts when connectivity returns.' },
      { title: 'Fluency versus verification', body: 'A clear AI-generated summary can still misinterpret a report. Verification matters independently of how confident the language sounds.' },
    ],
    scopeNote: 'The sequence is a conceptual summary of a report-to-summary workflow and simplifies the architecture. It does not depict exact processing order, offline behavior or deployment topology; the considerations frame design questions, not confirmed implementation choices.',
  },
  {
    slug: 'family-os',
    index: '03',
    name: 'Family OS',
    category: 'Household coordination',
    year: '2026–present',
    role: 'Founding Product Architect & Core Engineer',
    timeframe: 'January 2026–present',
    summary: 'Modeling connected routines with AI assistance and explicit human control.',
    description: 'I am designing the core data model and reusable skill-based routines for household coordination, separating conversational reasoning from deterministic checks and authorization.',
    cover: '/images/family-os.svg',
    coverAlt: 'Original conceptual illustration for Family OS, a household coordination project.',
    theme: 'olive',
    tags: ['Data modeling', 'PostgreSQL', 'Deno', 'AI orchestration'],
    featured: true,
    overview: 'Household coordination involves people, relationships and shared resources—not just isolated tasks. Family OS explores how a structured model of those dependencies can support recurring routines and proactive briefings while keeping financial or irreversible actions subject to explicit authorization.',
    contributions: [
      { title: 'Relationship and resource modeling', body: 'I am designing a PostgreSQL schema that represents people, their relationships and the dependencies between shared resources.' },
      { title: 'Reusable Family Skills', body: 'My architecture work includes versioned executable routines, deterministic conflict and policy layers, and explicit authorization boundaries.' },
      { title: 'AI and event orchestration', body: 'The design combines Deno Edge Functions with DeepSeek-V3 for conversational processing and DeepSeek-R1 for logistical optimization, alongside event-, webhook- and cron-driven briefings.' },
    ],
    system: [
      { title: 'Request or event', body: 'Begin with a household request or a relevant scheduled or external event.' },
      { title: 'Household context', body: 'Relate the request to people, responsibilities and resource dependencies.' },
      { title: 'Proposed plan', body: 'Form a candidate routine or plan using the available context.' },
      { title: 'Deterministic checks', body: 'Evaluate the proposal against conflict rules and policy boundaries.' },
      { title: 'Authorized action', body: 'Keep sensitive or irreversible execution behind explicit permission.' },
    ],
    designConsiderations: [
      { title: 'Flexible requests, predictable boundaries', body: 'Natural language makes requests expressive, while deterministic checks can provide a separate basis for deciding whether a proposed action is permitted.' },
      { title: 'Proactive without intrusive', body: 'A briefing is useful when it supports a real coordination need. Timing, relevance and the cost of interruption deserve consideration alongside automation.' },
      { title: 'Reusable without ambiguity', body: 'Versioned routines raise an important question: which behavior should an existing schedule retain when a skill changes?' },
    ],
    scopeNote: 'The system sequence is a conceptual summary, not an exact execution trace. It simplifies the relationship between reasoning, policy and authorization; the considerations discuss architectural tensions rather than claim particular deployed behavior.',
  },
  {
    slug: 'cosmo-conqueror',
    index: '04',
    name: 'Cosmo Conqueror',
    category: 'Sci-fi action gameplay',
    year: '2024–2025',
    role: 'Game Developer · Subrickzz',
    timeframe: 'January 2024–February 2025',
    summary: 'Connecting responsive combat, enemy behavior and reusable mission systems.',
    description: 'At Subrickzz, I worked on gameplay systems for a dual-perspective sci-fi action shooter, spanning combat, AI behavior, progression and mission design.',
    cover: '/images/cosmo-conqueror.svg',
    coverAlt: 'Original conceptual illustration for Cosmo Conqueror, a sci-fi action game.',
    theme: 'dark',
    tags: ['Gameplay systems', 'Behavior trees', 'Blueprints', 'Mission design'],
    featured: true,
    overview: 'Action gameplay depends on systems responding coherently to the same moment: enemy behavior, combat reactions, animation and mission progression. My work on Cosmo Conqueror connected those layers through reusable gameplay logic. I also designed 33 story-driven missions, with branching narrative and reusable mission frameworks.',
    contributions: [
      { title: 'Combat and enemy behavior', body: 'I worked on behavior trees, enemy and combat systems, including melee interactions, dodging, hit reactions and Motion Warping.' },
      { title: 'Mission and progression design', body: 'I designed 33 story-driven missions and worked on branching narrative, reusable mission frameworks and progression systems.' },
      { title: 'Gameplay integration', body: 'My contributions included gameplay architecture, Blueprint optimization and work with Chaos and Niagara.' },
    ],
    system: [
      { title: 'Encounter context', body: 'Frame the current objective and the player’s interaction with an encounter.' },
      { title: 'Behavior response', body: 'Represent how enemy behavior can respond to the encounter’s changing state.' },
      { title: 'Combat interaction', body: 'Connect player and enemy actions with movement, contact and reactions.' },
      { title: 'Gameplay feedback', body: 'Relate those interactions to animation and effects that communicate the moment.' },
      { title: 'Mission progression', body: 'Connect relevant gameplay events to the broader objective and progression loop.' },
    ],
    designConsiderations: [
      { title: 'Responsiveness versus coordination', body: 'Combat feels responsive when input, movement and reactions agree. Coordinating them becomes more demanding as interactions overlap.' },
      { title: 'Reusable logic, distinct encounters', body: 'Shared mission logic can support consistency, while encounter pacing and narrative context still need room for variation.' },
      { title: 'Readable behavior', body: 'Enemy behavior needs to serve the player-facing encounter as well as the internal logic. Clear reactions help make changing combat states understandable.' },
    ],
    scopeNote: 'This conceptual system summary connects gameplay concerns without reproducing proprietary Blueprints or an exact mission state machine. The mission count refers to design work, not a release count, and the cover is original concept art rather than gameplay footage.',
    external: { label: 'Visit Subrickzz', url: 'https://subrickzz.com/' },
  },
  {
    slug: 'survival-game',
    index: '05',
    name: 'Digital Dynasty',
    category: 'Open-world survival',
    year: 'University project',
    role: 'Final-year project contributor',
    timeframe: 'University project',
    summary: 'Bringing procedural worlds, crafting and character progression into one gameplay loop.',
    description: 'For my computer science final-year project at COMSATS University Islamabad, I worked on Digital Dynasty, an Unreal Engine 5 survival game with procedural environments and interconnected gameplay systems.',
    cover: '/images/survival-game.svg',
    coverAlt: 'Original conceptual illustration for Digital Dynasty, a university open-world survival game.',
    theme: 'amber',
    tags: ['Unreal Engine 5', 'Procedural generation', 'Crafting', 'Multiplayer'],
    featured: false,
    overview: 'The project brought together procedural generation across three biomes, crafting, building and skill trees, alongside AI, combat and multiplayer features including clans and voice. It provided a setting for working with the dependencies between exploration, resources and character progression.',
    contributions: [
      { title: 'Interconnected gameplay', body: 'I contributed to a final-year game project that connected exploration with crafting, building and character progression.' },
      { title: 'Procedural world context', body: 'The project’s scope included procedural environments across three biomes, creating varied contexts for the survival loop.' },
      { title: 'Shared survival systems', body: 'The wider project combined multiplayer, clans and voice features with AI and combat; these describe the project scope rather than sole authorship.' },
    ],
    system: [
      { title: 'Explore', body: 'Encounter the world and the resources distributed across its biomes.' },
      { title: 'Gather', body: 'Connect exploration to the materials available for survival activities.' },
      { title: 'Craft and build', body: 'Turn resources into tools and structures within the survival loop.' },
      { title: 'Develop skills', body: 'Relate continued play to character progression and available capabilities.' },
      { title: 'Return to the world', body: 'Connect those capabilities back to exploration, encounters and shared play.' },
    ],
    designConsiderations: [
      { title: 'Variation versus coherence', body: 'Procedural variation is most useful when the resulting environment still supports readable navigation and a coherent resource loop.' },
      { title: 'Interconnected progression', body: 'Crafting and skills shape each other. Their relationship deserves consideration so that one system does not make another irrelevant.' },
      { title: 'Shared-world consistency', body: 'Multiplayer adds questions about how changes to resources, structures and combat state are represented consistently for different players.' },
    ],
    scopeNote: 'The sequence is a conceptual gameplay-loop summary, not a world-generation pipeline or networking diagram. It describes the university project’s scope without assigning every system to one contributor; the cover is original concept art.',
    external: { label: 'Source repository', url: 'https://github.com/attaulhaq0/DigitalDynasty' },
  },
];
