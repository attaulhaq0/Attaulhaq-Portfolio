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
  coverWidth?: number;
  coverHeight?: number;
  coverSrcSet?: string;
  homeCover?: string;
  homeCoverAlt?: string;
  coverAlt: string;
  // Change these when replacing concept art with approved real captures.
  coverKind?: 'illustration' | 'screenshot' | 'gameplay';
  coverCaption?: string;
  theme: 'light' | 'dark' | 'olive' | 'amber';
  tags: string[];
  featured: boolean;
  homeOrder?: number;
  overview: string;
  contributions: { title: string; body: string }[];
  system: { title: string; body: string }[];
  designConsiderations: { title: string; body: string }[];
  scopeNote: string;
  sectionTitles?: { overview: string; contribution: string; system: string; considerations: string };
  external?: { label: string; url: string };
  media?: {
    src: string;
    poster: string;
    caption: string;
    captions?: string;
    transcript?: string;
    width?: number;
    height?: number;
    durationLabel?: string;
    description?: string;
  };
  gallery?: { src: string; alt: string; caption: string; width: number; height: number }[];
  clips?: { title: string; src: string; poster: string; caption: string; description?: string; width: number; height: number; durationLabel: string }[];
  conceptMotion?: { src: string; poster: string; caption: string; title: string };
  developmentImage?: { src: string; alt: string; caption: string; width: number; height: number; points: string[] };
  developmentNotes?: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: 'edeviser',
    homeOrder: 1,
    sectionTitles: {"overview":"Education from every role.","contribution":"Product direction and bounded AI.","system":"From context to reviewed assistance.","considerations":"Useful assistance, clear boundaries."},
    index: '01',
    name: 'E Deviser',
    category: 'AI-native education',
    year: '2025–present',
    role: 'Chief Product Officer & AI Product Engineer',
    timeframe: 'October 2025–present',
    summary: 'I lead product direction and build role-aware education experiences with AI assistance.',
    description: 'I lead product strategy and contribute to the architecture and development of an AI-native education platform, bringing together outcome-based education, personalized learning and gamification.',
    cover: '/images/case-studies/edeviser-1600.webp',
    coverWidth: 1600, coverHeight: 900,
    coverSrcSet: '/images/case-studies/edeviser-768.webp 768w, /images/case-studies/edeviser-1600.webp 1600w, /images/case-studies/edeviser-3840.webp 3840w',
    coverAlt: 'Original conceptual illustration for E Deviser, an AI-native education project.',
    homeCover: '/images/home/edeviser-illustration.webp',
    homeCoverAlt: 'Original isometric learning illustration with an open book and connected roles.',
    conceptMotion: { src: '/media/education-concept.mp4', poster: '/images/edeviser-render.webp', title: 'Learning, in motion.', caption: 'AI-generated concept animation of light moving through a glass book. A visual metaphor for learning, created with Sora 2.' },
    theme: 'light',
    tags: ['Agentic systems', 'RAG', 'Product strategy', 'Role-based workflows'],
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
    homeOrder: 2,
    sectionTitles: {"overview":"From spoken reports to useful context.","contribution":"Reporting, retrieval and verification.","system":"A report’s path through the workflow.","considerations":"Privacy and operational trust."},
    index: '02',
    name: 'AegisOps',
    category: 'Voice-first operations',
    year: '2026–present',
    role: 'Product & system design',
    timeframe: 'January 2026–present',
    summary: 'My product and system-design work on voice reporting, SOP retrieval and operational context.',
    description: 'My work spans a voice-first reporting experience and system design for security and multi-site operations, connecting multilingual input, sensitive-data handling, SOP retrieval and operational summaries.',
    cover: '/images/case-studies/aegisops-1600.webp',
    coverWidth: 1600, coverHeight: 900,
    coverSrcSet: '/images/case-studies/aegisops-768.webp 768w, /images/case-studies/aegisops-1600.webp 1600w, /images/case-studies/aegisops-3840.webp 3840w',
    coverAlt: 'Original conceptual illustration for AegisOps, a voice-first operations project.',
    homeCover: '/images/home/aegisops-illustration.webp',
    homeCoverAlt: 'Original isometric voice and retrieval illustration with connected operational context.',
    conceptMotion: { src: '/media/aegis-voice-concept.mp4', poster: '/images/aegis-voice-concept-poster.webp', title: 'From voice to context.', caption: 'AI-generated concept animation: a voice signal flows into connected retrieval nodes. This is a visual metaphor, not footage of the AegisOps interface.' },
    theme: 'dark',
    tags: ['Voice workflows', 'RAG', 'PostgreSQL', 'pgvector', 'RBAC'],
    featured: true,
    overview: 'Frontline reports contain valuable context, but spoken observations and operational records serve different purposes. AegisOps explores that transition through agentic AI, retrieval of standard operating procedures, issue correlation and shift synthesis. The design also addresses tenant boundaries, offline synchronization and deployment requirements.',
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
    homeOrder: 3,
    sectionTitles: {"overview":"Coordination starts with relationships.","contribution":"Data models, routines and authorization.","system":"From a request to a checked routine.","considerations":"Flexible plans, predictable rules."},
    index: '03',
    name: 'Family OS',
    category: 'Household coordination',
    year: '2026–present',
    role: 'Founding Product Architect & Core Engineer',
    timeframe: 'January 2026–present',
    summary: 'My work on household data models and reusable AI-assisted routines with explicit human control.',
    description: 'I am designing the core data model and reusable skill-based routines for household coordination, separating conversational reasoning from deterministic checks and authorization.',
    cover: '/images/case-studies/family-os-1600.webp',
    coverWidth: 1600, coverHeight: 900,
    coverSrcSet: '/images/case-studies/family-os-768.webp 768w, /images/case-studies/family-os-1600.webp 1600w, /images/case-studies/family-os-3840.webp 3840w',
    coverAlt: 'Original conceptual illustration for Family OS, a household coordination project.',
    homeCover: '/images/home/family-os-illustration.webp',
    homeCoverAlt: 'Original isometric household coordination illustration with connected homes and a shared calendar.',
    conceptMotion: { src: '/media/family-approval-concept.mp4', poster: '/images/family-approval-concept-poster.webp', title: 'Connected routines.', caption: 'AI-generated concept animation: light moves between connected glass homes. This is a visual metaphor for household coordination, not footage of the Family OS interface.' },
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
    homeOrder: 4,
    sectionTitles: {"overview":"The logic behind the encounter.","contribution":"Combat, behavior and mission design.","system":"How an encounter moves forward.","considerations":"Responsive and readable combat."},
    index: '04',
    name: 'Cosmo Conqueror',
    category: 'Sci-fi action gameplay',
    year: '2024–2025',
    role: 'Game Developer · Subrickzz',
    timeframe: 'January 2024–January 2025',
    summary: 'My gameplay work on combat, enemy behavior and reusable mission systems for a sci-fi action game.',
    description: 'At Subrickzz, I worked on gameplay systems for a dual-perspective sci-fi action shooter, spanning combat, AI behavior, progression and mission design.',
    cover: '/images/cosmo/mission.webp',
    coverAlt: 'Actual Cosmo Conqueror development capture showing an alien player character at a gold gate in the ruined city.',
    homeCover: '/images/home/cosmo-conqueror-illustration.webp',
    homeCoverAlt: 'Original isometric gameplay illustration of a controller, interactive terrain and connected logic.',
    coverKind: 'gameplay',
    coverCaption: 'Actual development footage supplied from my Cosmo Conqueror work.',
    developmentImage: { src: '/images/development/cosmo-blueprint-overview.webp', alt: 'Explanatory Blueprint-style map connecting encounter context, behavior decisions, combat, feedback and mission progression.', width: 1536, height: 1024, caption: 'Explanatory reconstruction based on my documented gameplay work. This is not an Unreal screenshot or an exact project graph.', points: ['Encounter and mission context shape what the gameplay systems need to respond to.', 'Behavior Trees organize enemy decisions; combat and animation provide the response.', 'Player feedback and mission state connect the encounter to progression.'] },
    theme: 'dark',
    tags: ['Gameplay systems', 'Behavior trees', 'Blueprints', 'Mission design'],
    featured: true,
    overview: 'Action gameplay depends on systems responding coherently to the same moment: enemy behavior, combat reactions, animation and mission progression. My work on Cosmo Conqueror connected those layers through reusable gameplay logic. I also designed 33 story-driven missions, with branching narrative and reusable mission frameworks.',
    developmentNotes: [
      { title: 'Behavior and encounter logic', body: 'My documented work connects Behavior Trees, combat interactions and mission state. The development map summarizes that relationship; it is an explanatory reconstruction rather than a capture of the project’s original Blueprint graph.' },
      { title: 'Reusable mission systems', body: 'I designed 33 story-driven missions and reusable mission frameworks. Organizing related gameplay events into shared logic helped structure the work across the human and alien perspectives.' },
      { title: 'Animation and prototype feedback', body: 'Motion Warping, Niagara and Chaos formed part of my integration work. The separate clips show encounter movement, attack feedback and a graybox projectile test. They demonstrate prototype behavior without establishing ownership of every animation or environment asset.' },
    ],
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
    scopeNote: 'The videos are edited silent excerpts from development recordings of my work at Subrickzz. They show gameplay and a separate graybox projectile test, with prototype HUD and diagnostic feedback retained. Individual environment and character assets are part of the wider game. The mission count refers to design work; these recordings do not establish a shipped release or measured performance.',
    media: {
      src: '/media/cosmo-showcase.mp4',
      poster: '/images/cosmo/showcase-trimmed.webp',
      width: 1280, height: 720,
      durationLabel: '44-second showcase',
      caption: 'Edited silent gameplay showcase from my Cosmo Conqueror development recordings.',
      description: 'A brief ruined-city transition, followed by selected Spirit, Iggy/Scorch and Reaper encounters. The edit keeps the original HUD and development context visible.',
    },
    gallery: [
      { src: '/images/cosmo/mission.webp', alt: 'Alien player character and another character at a gold gate in Cosmo Conqueror’s ruined city.', caption: 'Ruined-city traversal and mission context.', width: 1280, height: 720 },
      { src: '/images/cosmo/spirit-boss.webp', alt: 'An alien player character facing the glowing Spirit boss in a misty combat arena.', caption: 'Spirit boss encounter with ranged attacks and player movement.', width: 1280, height: 720 },
      { src: '/images/cosmo/miniboss.webp', alt: 'An armored player aiming toward a fiery enemy in a desert combat encounter.', caption: 'Iggy and Scorch miniboss gameplay in the desert arena.', width: 1280, height: 720 },
    ],
    clips: [
      { title: 'Spirit boss encounter', src: '/media/cosmo-spirit-boss.mp4', poster: '/images/cosmo/spirit-boss.webp', durationLabel: '24 seconds', width: 1280, height: 720, description: 'A closer look at ranged attacks, encounter effects and player movement.', caption: 'Silent excerpt from Alien Vs Spirit Boss Gameplay. Original gameplay HUD is retained.' },
      { title: 'Miniboss combat', src: '/media/cosmo-miniboss.mp4', poster: '/images/cosmo/miniboss.webp', durationLabel: '24 seconds', width: 1280, height: 720, description: 'Aiming, firing and reacting to moving fire attacks in the Iggy/Scorch encounter.', caption: 'Silent excerpt from IggyAndScorchMiniBoss. Development gameplay, with the original HUD.' },
      { title: 'Projectile feedback', src: '/media/cosmo-projectiles.mp4', poster: '/images/cosmo/projectiles.webp', durationLabel: '15 seconds', width: 1280, height: 720, description: 'A graybox test showing projectile effects and visible hit and health feedback.', caption: 'Silent graybox projectile demonstration. Internal diagnostic text is retained; desktop recording controls are removed.' },
      { title: 'Dragon flight and attack', src: '/media/cosmo-dragon-attack.mp4', poster: '/images/cosmo/dragon-attack.webp', durationLabel: '16 seconds', width: 1280, height: 720, description: 'Flight banking, close passes and a fiery approach, showing another encounter in the development build.', caption: 'Dragon flight, close passes and a fiery attack in the Cosmo prototype. Original HUD and navigation-build status are retained.' },
    ],
    external: { label: 'Visit Subrickzz', url: 'https://subrickzz.com/' },
  },
  {
    slug: 'survival-game',
    sectionTitles: {"overview":"A connected survival loop.","contribution":"Gameplay development and validation.","system":"Resources, progression and saved state.","considerations":"When the game’s systems agree."},
    index: '05',
    name: 'Digital Dynasty',
    category: 'Open-world survival · Final-year project',
    year: '2023–2024',
    role: 'Game development & gameplay validation',
    timeframe: '2023–2024 · COMSATS University Islamabad',
    summary: 'My award-winning Unreal Engine 5 final-year survival game, connecting exploration, crafting, construction and progression.',
    description: 'For my computer science final-year project, I worked on Digital Dynasty: an Unreal Engine 5 survival game built with Blueprint scripting. My work connects player interaction with the systems behind exploration, resource gathering, crafting, construction and progression.',
    cover: '/images/digital-dynasty-gameplay.webp',
    coverAlt: 'Actual Digital Dynasty prototype footage showing a river, forested shore and the player’s survival HUD.',
    homeCover: '/images/home/digital-dynasty-illustration.webp',
    homeCoverAlt: 'Original isometric survival-system illustration of gathering, crafting and construction.',
    coverKind: 'gameplay',
    coverCaption: 'Actual frame from the owner-supplied Digital Dynasty final-year presentation.',
    developmentImage: { src: '/images/development/digital-dynasty-blueprint-overview.webp', alt: 'Explanatory Blueprint-style map of inventory, material checks, crafting, placement validation and saved progress.', width: 1536, height: 1024, caption: 'Explanatory reconstruction based on my final-year project report. This is not an Unreal screenshot or an exact Blueprint graph.', points: ['A crafting request checks the recipe against available materials before consuming inventory.', 'Construction previews need terrain and collision validation; blocked placement returns to an adjustment step.', 'Save and load checks verify that inventory and player position are restored consistently.'] },
    theme: 'amber',
    tags: ['Unreal Engine 5', 'Blueprint scripting', 'Crafting & building', 'Survival systems'],
    featured: false,
    overview: 'Digital Dynasty gave me a practical setting for working through the dependencies of a survival game. Resources move through inventory and crafting into tools and structures, while experience and skills shape what a player can do next. The final report documents that loop through design diagrams, interfaces and manual test records. The supplied presentation shows the prototype in action, including inventory, exploration, construction, combat and multiplayer test scenes.',
    developmentNotes: [
      { title: 'Inventory and recipe checks', body: 'The report connects collected resources with recipe requirements and item creation. My recorded validation checks material consumption during crafting; the focused clip shows the inventory, equipment and Stone Hatchet interface in the prototype.' },
      { title: 'Placement validation', body: 'Construction needs to connect inventory with terrain and collision rules. I verified structure placement in the final-year project. The focused construction clip shows placement previews and a timber staircase; the development map explains the checks without claiming it is the exact Blueprint implementation.' },
      { title: 'Progression and persistent state', body: 'My documented checks cover movement, collisions, experience-based leveling and save/load restoration of inventory and position. These are historical project test records; the original showcase remains available alongside the new focused excerpts.' },
    ],
    contributions: [
      { title: 'Gameplay systems and Blueprint development', body: 'I worked on the Unreal Engine 5 project using Blueprint scripting, connecting survival activities, player interactions and persistent game state within the wider game.' },
      { title: 'Crafting and construction', body: 'I verified that creating an item consumes the required materials and that structures can be placed consistently with terrain and collision rules. These checks test how inventory, crafting and the world agree.' },
      { title: 'Player interaction and progression', body: 'I verified movement, collisions and experience-based leveling, connecting immediate player input with the longer progression loop.' },
      { title: 'Saving and restoring progress', body: 'I verified saving and loading progress, including restored inventory and position. I focus on the state changes behind an interaction, as well as the experience the player sees.' },
    ],
    system: [
      { title: 'Explore and gather', body: 'Move through the world, encounter resources and bring collected materials into the inventory.' },
      { title: 'Check a recipe', body: 'Relate the desired item to its resource and progression requirements.' },
      { title: 'Craft and construct', body: 'Consume the required materials to create items, then place structures subject to terrain and collision rules.' },
      { title: 'Develop capabilities', body: 'Connect continued play to experience, leveling and skills that shape later survival activities.' },
      { title: 'Save and return', body: 'Persist player progress and game state so that subsequent play can continue from the saved state.' },
    ],
    designConsiderations: [
      { title: 'Dependencies across the survival loop', body: 'Inventory, recipe requirements, resource consumption and placement rules need to agree. A visible item-creation action is only one part of the state changes behind it.' },
      { title: 'Readable rules in an open world', body: 'Movement, terrain and collision constraints need to feel consistent with what the player sees. The report’s placement and movement tests focus on those boundaries.' },
      { title: 'Prototype evidence and future scope', body: 'The footage includes multiplayer test scenes and tribe interfaces. Expanded multiplayer, VR and cross-platform support remain future extensions in the report; the demonstration does not establish production hosting or large-scale reliability.' },
    ],
    scopeNote: 'Digital Dynasty is my final-year project, developed within a team. The footage shows real gameplay and Unreal Engine demonstrations. The workflow summarizes documented systems, and the report’s manual test records reflect the project at that time.',
    external: { label: 'Source repository', url: 'https://github.com/attaulhaq0/DigitalDynasty' },
    media: {
      src: '/media/digital-dynasty-gameplay.mp4',
      poster: '/images/digital-dynasty-gameplay.webp',
      caption: 'Edited silent excerpt from the Digital Dynasty final-year presentation, showing actual prototype gameplay and Unreal Engine editor demonstrations.',
      width: 1280,
      height: 720,
      durationLabel: '60-second showcase',
      description: 'A selection of exploration, inventory, crafting, construction and multiplayer test moments. Editor interfaces remain visible where they appeared in the supplied recording.',
    },
    gallery: [
      { src: '/images/digital-dynasty/exploration.webp', alt: 'Digital Dynasty river environment with forested shoreline and survival HUD.', caption: 'Exploration and survival context in the prototype world.', width: 1280, height: 720 },
      { src: '/images/digital-dynasty/inventory.webp', alt: 'Digital Dynasty inventory and crafting tabs with character equipment and survival statistics.', caption: 'Inventory, crafting access and the player’s survival state.', width: 1280, height: 720 },
      { src: '/images/digital-dynasty/structures.webp', alt: 'A wooden structure and stairs shown during a Digital Dynasty Unreal Engine building demonstration.', caption: 'Construction demonstrated inside Unreal Engine.', width: 1280, height: 720 },
    ],
    clips: [
      { title: 'Inventory and crafting', src: '/media/digital-dynasty-inventory-crafting.mp4', poster: '/images/digital-dynasty/inventory-crafting.webp', durationLabel: '10 seconds', width: 1280, height: 720, description: 'Inventory, equipment and Stone Hatchet crafting in the original prototype.', caption: 'Inventory, equipment and Stone Hatchet crafting in the Digital Dynasty prototype. Silent excerpt from the original final-year recording.' },
      { title: 'Construction and placement', src: '/media/digital-dynasty-construction.mp4', poster: '/images/digital-dynasty/construction.webp', durationLabel: '11 seconds', width: 1280, height: 720, description: 'Structural placement previews and a timber staircase, with the original development context.', caption: 'Structural placement previews and a timber staircase in the Digital Dynasty prototype. Silent excerpt from the original final-year recording.' },
    ],
  },
];
