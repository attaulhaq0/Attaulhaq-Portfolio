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
    index: '03',
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
      { name: 'RAG workflows', context: 'Scoped retrieval and AI assistance', projects: ['edeviser', 'aegisops'] },
      { name: 'AI agents & orchestration', context: 'Structured assistance and coordinated AI workflows', projects: [] },
      { name: 'Vector search & embeddings', context: 'Retrieval and vector-database workflows', projects: [] },
      { name: 'PostgreSQL', context: 'Data models in AegisOps and Family OS', projects: ['aegisops', 'family-os'] },
      { name: 'pgvector', context: 'Retrieval in the AegisOps design', projects: ['aegisops'] },
      { name: 'Deno Edge Functions', context: 'Event orchestration in the Family OS design', projects: ['family-os'] },
    ],
  },
  {
    index: '02',
    title: 'Software & delivery',
    description: 'Languages and tools I use to prototype, implement, version and validate software.',
    accent: 'magenta',
    tools: [
      { name: 'Python & JavaScript', context: 'General development and implementation', projects: [] },
      { name: 'Git & GitHub', context: 'Version control and project source', projects: ['survival-game'] },
      { name: 'Docker & CI/CD', context: 'Development environments and delivery workflows', projects: [] },
    ],
  },
];
techStack.sort((a, b) => Number(a.index) - Number(b.index));

export const projectStackNotes: Record<string, string> = {
  'edeviser': 'Retrieval and role-aware assistance form part of my product and architecture work.',
  'aegisops': 'These technologies describe the reporting and retrieval design; they do not imply a verified production deployment.',
  'family-os': 'These tools and model references belong to the current project design.',
  'cosmo-conqueror': 'Tools used across my gameplay development and integration work at Subrickzz.',
  'survival-game': 'The final-year report documents Unreal Engine 5, Blueprint scripting and Git/GitHub in the project workflow.',
};
