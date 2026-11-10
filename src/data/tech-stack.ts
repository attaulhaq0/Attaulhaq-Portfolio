export interface StackTool {
  name: string;
  context: string;
  projects: string[];
}

export interface StackGroup {
  index: string;
  title: string;
  description: string;
  accent: 'cyan' | 'lavender' | 'magenta';
  tools: StackTool[];
}

export const techStack: StackGroup[] = [
  {
    index: '04',
    title: 'Game development foundation',
    description: 'Tools from my earlier Unreal Engine work on interactive systems and game AI.',
    accent: 'cyan',
    tools: [
      { name: 'Unreal Engine 5', context: 'Gameplay and interactive environments', projects: ['cosmo-conqueror', 'survival-game'] },
      { name: 'Blueprints', context: 'Gameplay logic and reusable systems', projects: ['cosmo-conqueror', 'survival-game'] },
      { name: 'Behavior Trees', context: 'Enemy behavior in Cosmo Conqueror', projects: ['cosmo-conqueror'] },
      { name: 'Niagara & Chaos', context: 'Gameplay effects and integration', projects: ['cosmo-conqueror'] },
      { name: 'Motion Warping', context: 'Combat interactions and reactions', projects: ['cosmo-conqueror'] },
    ],
  },
  {
    index: '01',
    title: 'AI & agentic systems',
    description: 'Retrieval, context and controlled actions in my AI and product engineering work.',
    accent: 'lavender',
    tools: [
      { name: 'RAG workflows', context: 'Scoped retrieval and relevant context', projects: ['edeviser', 'aegisops'] },
      { name: 'AI agents & orchestration', context: 'Scoped assistance in Cuevo workflows', projects: ['edeviser'] },
      { name: 'Vector search & embeddings', context: 'Vector retrieval in the AegisOps design', projects: ['aegisops'] },
      { name: 'pgvector', context: 'Retrieval in the AegisOps design', projects: ['aegisops'] },
      { name: 'Deno Edge Functions', context: 'Event orchestration in the Family OS design', projects: ['family-os'] },
    ],
  },
  {
    index: '02',
    title: 'Software & delivery',
    description: 'Interfaces, APIs and tests across product development and client websites.', accent: 'magenta',
    tools: [
      { name: 'TypeScript & JavaScript', context: 'Typed interfaces and browser behavior', projects: ['edeviser'] },
      { name: 'React & Next.js', context: 'Product interfaces and connected page flows', projects: ['edeviser'] },
      { name: 'Astro & Vite', context: 'Static websites and frontend builds', projects: [] },
      { name: 'Node.js & NestJS', context: 'APIs and background processing in Cuevo', projects: ['edeviser'] },
      { name: 'Python', context: 'Automation, asset processing and verification scripts', projects: [] },
      { name: 'Playwright & Vitest', context: 'Responsive, interaction and failure-state testing', projects: ['edeviser'] },
      { name: 'Technical SEO', context: 'Crawlability, metadata and sitemap checks for client websites', projects: [] },
      { name: 'Git & GitHub', context: 'Versioned changes, pull requests and review', projects: ['survival-game', 'edeviser'] },
    ],
  },
  {
    index: '03', title: 'Cloud & operations',
    description: 'Hands-on runtime, model integration and operational checks in current engineering work.', accent: 'cyan',
    tools: [
      { name: 'Azure Container Apps', context: 'API and private worker runtime configuration', projects: ['edeviser'] },
      { name: 'Azure AI Foundry', context: 'Model integration and visual-asset generation', projects: ['edeviser'] },
      { name: 'Azure CLI, Cost Management & Monitor', context: 'Read-only usage, cost and diagnostic investigation', projects: [] },
      { name: 'Supabase & PostgreSQL', context: 'Authentication, data access and private storage', projects: ['edeviser'] },
      { name: 'Docker', context: 'Container environments and release artifacts', projects: ['edeviser'] },
      { name: 'GitHub Actions', context: 'Automated build and validation workflows', projects: ['edeviser'] },
    ],
  },
];
techStack.sort((a, b) => Number(a.index) - Number(b.index));

export const projectStackNotes: Record<string, string> = {
  'edeviser': 'These tools support my product and engineering contributions to Cuevo at E Deviser, which remains in development.',
  'aegisops': 'These technologies describe the reporting and retrieval design; they do not imply a verified production deployment.',
  'family-os': 'These tools and model references belong to the current project design.',
  'cosmo-conqueror': 'Tools used across my gameplay development and integration work at Subrickzz.',
  'survival-game': 'The final-year report documents Unreal Engine 5, Blueprint scripting and Git/GitHub in the project workflow.',
};
