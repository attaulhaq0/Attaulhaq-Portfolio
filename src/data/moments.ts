export interface Moment {
  number: string;
  title: string;
  context: string;
  description: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  position: string;
  date?: string;
  location?: string;
  role?: string;
  details?: string[];
  images?: { src: string; alt: string; width: number; height: number; position?: string }[];
  source?: { url: string; label: string };
}

export const moments: Moment[] = [
  {
    number: '01',
    title: 'Building, together.',
    context: 'Cuevo · Qatar Science & Technology Park',
    description: 'At QSTP with my teammate and the work we are building through E Deviser. Cuevo is our learning-intelligence project in development.',
    image: '/images/moments/qstp-team.webp',
    alt: 'Atta-ul-Haq and his teammate beside a Cuevo banner at Qatar Science and Technology Park.',
    width: 1400,
    height: 847,
    position: '50% 50%',
    date: 'September 2026',
    location: 'QSTP · Doha, Qatar',
    role: 'E Deviser · Co-Founder & Chief Product Officer',
    details: [
      'Cuevo is incubated at Qatar Science & Technology Park.',
      'These photographs bring the team and the project into the same frame, alongside our ongoing product work.',
    ],
    images: [{ src: '/images/portrait-qstp.webp', alt: 'Atta-ul-Haq beside an E Deviser display at Qatar Science and Technology Park.', width: 1200, height: 1600, position: '66% 55%' }],
  },
  {
    number: '02',
    title: 'From possibilities to products.',
    context: 'Google Cloud Summit Doha',
    description: 'A day exploring AI and cloud ideas at the summit, from the Co-Innovation Stage to the keynote and exhibition floor.',
    image: '/images/moments/google-pointing.webp',
    alt: 'Atta-ul-Haq pointing toward the Google Cloud Customers in Action display at Google Cloud Summit Doha.',
    width: 901,
    height: 1600,
    position: '50% 50%',
    date: 'September 2026',
    location: 'Qatar National Convention Centre · Doha',
    role: 'Summit attendee',
    details: [
      'The summit included a keynote on “The AI First Enterprise” and demonstrations across the exhibition floor.',
      'I attended with my E Deviser teammate as part of getting to know Doha’s technology community.',
    ],
    images: [
      { src: '/images/google-cloud.webp', alt: 'Atta-ul-Haq standing in front of the Google Cloud Summit Co-Innovation Stage display.', width: 720, height: 770, position: '55% 48%' },
      { src: '/images/moments/google-keynote.webp', alt: 'A keynote presentation on The AI First Enterprise at Google Cloud Summit Doha.', width: 901, height: 1600, position: '50% 50%' },
      { src: '/images/moments/google-exhibition.webp', alt: 'Demo booths and visitors on the Google Cloud Summit exhibition floor.', width: 720, height: 1110, position: '50% 50%' },
      { src: '/images/moments/google-venue.webp', alt: 'Google Cloud Summit Doha event identity inside Qatar National Convention Centre.', width: 683, height: 1024, position: '50% 50%' },
      { src: '/images/moments/google-foyer.webp', alt: 'Google Cloud Summit Doha exhibition and gathering space inside the venue.', width: 901, height: 1600 },
      { src: '/images/moments/google-auditorium.webp', alt: 'Audience and stage during a Google Cloud Summit Doha session.', width: 1280, height: 853 },
      { src: '/images/moments/google-stage-wide.webp', alt: 'A wide view of the Google Cloud Summit Doha stage and event setting.', width: 1280, height: 960 },
    ],
  },
  {
    number: '03',
    title: 'Coffee & community.',
    context: 'Startup Grind Doha · Coffee & Community',
    description: 'Meeting the people around Qatar’s startup community, one conversation at a time. A personal moment from Coffee & Community.',
    image: '/images/community.webp',
    alt: 'Atta-ul-Haq in a checked shirt, sharing a café group photo with three other people.',
    width: 1600,
    height: 1200,
    position: '51% 42%',
    date: 'September 2026',
    location: 'Doha, Qatar',
    role: 'Community attendee',
    details: [
      'Coffee & Community brings founders and people across the startup ecosystem together in an informal setting.',
      'This group photograph is from the gathering I attended after moving to Qatar.',
    ],
  },
  {
    number: '04',
    title: 'A room for the next question.',
    context: 'AI × Future Summit 2025',
    description: 'I contributed to strategic planning and stakeholder engagement around AI × Future Summit at Bahria University, connecting conversations about AI, education and future skills.',
    image: '/images/moments/bahria-welcome-branded.webp',
    alt: 'The original welcome photograph in a complete E Deviser and Roze News AI X Future Summit branded graphic.',
    width: 1131, height: 1600, position: '50% 50%',
    date: '2025',
    location: 'Bahria University · Islamabad, Pakistan',
    role: 'E Deviser · Planning & ecosystem engagement',
    details: [
      'My work around the summit included strategic planning and engagement with stakeholders, alongside my product role at E Deviser.',
      'The summit brought technology, education and policy perspectives together, with Barrister Daniyal Chaudhry as chief guest.',
      'The Patriot reported the completed summit and separately covered the announced university summit series with Roze News.',
      'A fireside discussion hosted by E Deviser in collaboration with Bahria University brought startup funding, founder mindset, teams and ecosystem support into the summit conversation.',
    ],
    images: [
      { src: '/images/moments/ai-future-fireside-group-branded.webp', alt: 'E Deviser branded fireside group graphic titled Building Startups in the Age of Exponential Change.', width: 1280, height: 1600 },
      { src: '/images/moments/bahria-report.webp', alt: 'The Patriot newspaper report about AI X Future Summit at Bahria University.', width: 1400, height: 1324, position: '50% 50%' },
      { src: '/images/moments/bahria-series.webp', alt: 'The Patriot announcement of the Roze News and E Deviser AI X Future Summit series.', width: 1400, height: 1332, position: '50% 50%' },
    ],
    source: { url: 'https://www.linkedin.com/feed/update/urn:li:activity:7409170356218863616/', label: 'Read the fireside event post' },
  },
  {
    number: '13',
    title: 'Innovation, investment and policy.',
    context: 'AI × Future Summit · E Deviser event record',
    description: 'Part of the wider summit story around my work at E Deviser: a conversation connecting emerging technology with investment, policy and institutional readiness.',
    image: '/images/moments/ai-future-qaiser-welcome-branded.webp',
    alt: 'Branded E Deviser and Roze News graphic announcing Federal Minister Qaiser Ahmed Sheikh at AI X Future Summit.',
    width: 1279, height: 1600, position: '50% 50%',
    date: '2025',
    role: 'E Deviser · Product leadership & ecosystem engagement',
    details: [
      'E Deviser’s published post records Federal Minister Qaiser Ahmed Sheikh’s address on investment, innovation and policy alignment.',
      'The discussion covered an investment-friendly ecosystem, skilled human capital and public-private collaboration. These are useful questions when turning technology into products that fit their wider context.',
      'The photographs and branding belong to the company’s summit record; the minister’s address is distinct from my own contribution.',
    ],
    images: [
      { src: '/images/moments/ai-future-qaiser-coverage-branded.webp', alt: 'Branded collage of Qaiser Ahmed Sheikh speaking, audience seating and a commemorative presentation.', width: 1279, height: 1600 },
      { src: '/images/moments/ai-future-qaiser-moments-branded.webp', alt: 'Branded E Deviser summit collage showing seated participants and a commemorative presentation.', width: 1279, height: 1600 },
    ],
    source: { url: 'https://www.linkedin.com/feed/update/urn:li:activity:7408078590912774147/', label: 'Read the summit event post' },
  },
  {
    number: '06',
    title: 'From opportunity to scale.',
    context: 'QSTP SPRINT F26 Summit',
    description: 'Joining the QSTP founder community at its SPRINT Summit, with a conversation about building companies that last.',
    image: '/images/moments/sprint-panel.webp',
    alt: 'Panel session titled From Opportunity to Scale: Building Companies that Last at QSTP SPRINT F26.',
    width: 1280, height: 853, position: '50% 50%',
    date: 'October 2026',
    location: 'Qatar Science & Technology Park · Doha',
    role: 'Summit attendee',
    details: [
      'The summit marked the culmination of QSTP’s four-week SPRINT phase for its Incubation F26 founders.',
      'The session featured Mohammed Al-Delaimi, with Majed Lababidi moderating the discussion.',
    ],
    images: [{ src: '/images/moments/sprint-group.webp', alt: 'A group photograph from the QSTP SPRINT Summit recap.', width: 1280, height: 683, position: '50% 62%' }],
  },
  {
    number: '07',
    title: 'The people around an idea.',
    context: 'QSTP × YEC Summer Bootcamp',
    description: 'At the closing gathering for the entrepreneurship summer bootcamp, surrounded by the people helping new ideas take shape.',
    image: '/images/moments/yec-closing.webp',
    alt: 'Audience and stage at the QSTP and Young Entrepreneurs Club summer bootcamp closing gathering.',
    width: 901, height: 1600, position: '58% 48%',
    date: 'August 2026',
    location: 'Doha, Qatar',
    role: 'Closing-gathering attendee',
    details: [
      'QSTP and the Young Entrepreneurs Club organized a summer program covering entrepreneurship, product development, market entry and pitching.',
      'The program concluded with a hackathon and a separate closing gathering; this photograph records the closing I attended.',
    ],
  },
  {
    number: '08',
    title: 'A bridge between communities.',
    context: 'Paklaunch Doha Meetup',
    description: 'Meeting founders and business leaders across the Pakistan–Qatar startup community after moving to Doha.',
    image: '/images/moments/paklaunch.webp',
    alt: 'A speaker addressing attendees at the Paklaunch Doha meetup at Nestwork M7.',
    width: 1201, height: 1600, position: '56% 48%',
    date: 'September 2026',
    location: 'Nestwork M7 · Msheireb, Doha',
    role: 'Meetup attendee',
    details: [
      'Paklaunch and Startup Grind Doha brought together founders, investors and business leaders from the two ecosystems.',
      'The gathering focused on market access, cross-border connections and the realities of building in a new environment.',
    ],
  },
  {
    number: '09',
    title: 'Thinking about the next stage.',
    context: 'EO Qatar · 10x Your Business',
    description: 'A learning session with Antony Enright on breaking through growth plateaus and building the systems around a business.',
    image: '/images/moments/eo-qatar.webp',
    alt: 'Antony Enright presenting a business scaling checklist to an audience at the EO Qatar learning event.',
    width: 1400, height: 788, position: '56% 50%',
    date: 'September 2026',
    location: 'Qatar Chamber · Lusail, Qatar',
    role: 'Learning-event attendee',
    details: [
      'The event was titled “10x Your Business: Breaking Through the Next Stage of Growth.”',
      'The discussion connected growth strategy with business systems, teams and clearer ownership.',
    ],
  },
  {
    number: '10',
    title: 'Connecting ideas and industry.',
    context: 'Qatar Event Show 2026',
    description: 'A talk at Qatar Event Show, bringing my perspective as a product builder into the conversation about innovation and the people behind it.',
    image: '/images/moments/qatar-event-show.webp',
    alt: 'Atta-ul-Haq beside the Qatar Event Show podium and event display at DECC.',
    width: 1109, height: 1600, position: '61% 48%',
    date: 'September 2026',
    location: 'Doha Exhibition & Convention Center',
    role: 'Speaker · E Deviser',
    details: [
      'The exhibition brought the events industry together at DECC from September 1–3.',
      'For me, these conversations connect product leadership with the wider professional community: understanding people, exploring ideas and looking for practical ways to work together.',
    ],
  },
  {
    number: '11',
    title: 'Practical questions about AI.',
    context: 'MCIT · AI workshop',
    description: 'A smaller workshop setting to explore practical uses of AI, alongside the larger technology events in Doha.',
    image: '/images/moments/mcit-ai-workshop.webp',
    alt: 'A workshop presenter beside a screen discussing AI for internal business improvements at an MCIT event.',
    width: 1400, height: 788, position: '50% 48%',
    date: 'September 2026',
    location: 'Doha, Qatar',
    role: 'Workshop attendee',
    details: [
      'The photographed session explored AI for internal business improvements, including content creation, research and information analysis.',
      'This workshop was separate from Google Cloud Summit and the later Scale Now government-opportunities panel.',
    ],
  },
  {
    number: '12',
    title: 'Understanding the route to market.',
    context: 'MCIT Scale Now · Government Opportunities',
    description: 'Attending “Unlocking Government Opportunities for Scale-Ups,” a panel about procurement readiness, alliances and enterprise opportunities.',
    image: '/images/moments/scale-now.webp',
    alt: 'Panelists discussing Unlocking Government Opportunities for Scale-Ups at the MCIT Scale Now event.',
    width: 1400, height: 1050, position: '50% 52%',
    date: 'September 2026',
    location: 'Mandarin Oriental · Msheireb, Doha',
    role: 'Panel-session attendee',
    details: [
      'The September 30 panel brought together perspectives from MCIT, Scale AI, AppLab and Malomatia.',
      'The conversation focused on public procurement readiness and positioning technology solutions for enterprise contracts.',
    ],
  },
];

export const immersiveClassroom = {
  title: 'Learning can be a place.',
  status: 'My work at E Deviser · Immersive education',
  description: 'At E Deviser, I work on an immersive classroom experience that brings learning into a shared real-time world. This walkthrough shows the environment I’m developing, connecting interaction and presence with the way people learn together.',
  src: '/media/immersive-classroom.mp4',
  poster: '/images/edeviser-classroom.webp',
  caption: 'A silent walkthrough of my immersive education work at E Deviser: seated avatars, illuminated desks, a teaching screen and a robot assistant. This experience is in development.',
};
