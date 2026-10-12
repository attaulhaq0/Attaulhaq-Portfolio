export interface CareerMetric {
  value: string;
  label: string;
}

export const freelanceMilestone = {
  platform: 'Fiverr',
  period: 'My first five months',
  title: 'Reached Fiverr Level 2.',
  description: 'Built a freelance practice across AI, software development, automation, product and design work, and document workflows.',
  metrics: [
    { value: '62+', label: 'unique clients' },
    { value: 'PKR 1M+', label: 'earned' },
    { value: '5 months', label: 'to reach Level 2' },
  ] satisfies CareerMetric[],
  image: {
    src: '/images/fiverr-level-overview.webp', width: 1280, height: 638,
    alt: 'Historical Fiverr Level 2 overview with Atta-ul-Haq’s profile photo, the original account-status notice and performance metrics: 4.9 rating, 84 orders, 62 unique clients and PKR 1,291,348 earnings.',
    caption: 'Fiverr overview from my first five months, documenting the milestone and account status at that time.',
  },
};

export const employmentMilestone = {
  role: 'Game Developer',
  company: 'Subrickzz',
  dates: 'January 2024 – January 2025',
  arrangement: 'Full-time · UK remote',
  description: 'Developed and debugged Unreal applications, integrated 3D assets, and worked with designers and artists on interactive environments and gameplay systems.',
  certificate: {
    src: '/images/subrickzz-experience-certificate.webp',
    width: 1356,
    height: 1922,
    alt: 'Subrickzz experience certificate dated 22 January 2025, documenting Atta Ul Haq’s employment as an Unreal Developer from January 2024 to January 2025.',
    caption: 'Experience certificate issued by Subrickzz on 22 January 2025. The certificate records the role as Unreal Developer.',
  },
};
