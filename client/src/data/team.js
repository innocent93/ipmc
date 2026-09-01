// Real IPMC personnel — names and roles extracted directly from
// ipmc-ng.com/about; bios below are written fresh for this project.
// Used as a fallback whenever the /api/team endpoint is unreachable or
// has no records yet, same pattern as data/services.js and data/blogPosts.js.
export const FALLBACK_TEAM = [
  {
    name: 'Robert Ade-Odiachi, FCA',
    role: 'Chief Executive Officer',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    bio: 'Leads IPMC with three decades of experience across finance, engineering and project consulting.',
  },
  {
    name: 'Adebayo Ajao, MSc Economics',
    role: 'Head of Research',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bio: 'Directs research and economic analysis behind IPMC\u2019s advisory and ESG work.',
  },
  {
    name: 'Chika Onyekwere, B.Eng',
    role: 'Environmental Consultant',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Leads environmental impact assessments and compliance across client projects.',
  },
  {
    name: 'Agatha Afemike, BSc, ACA, GRI',
    role: 'ESG Consultant',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bio: 'Guides clients through ESG assessment, ratings and sustainability reporting.',
  },
  {
    name: 'Ayodeji Adeniran, MDSS, ACIS',
    role: 'Governance Specialist',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    bio: 'Advises clients on board governance structure and regulatory compliance frameworks.',
  },
  {
    name: 'Samuel Amoo, M.Sc Information Technology',
    role: 'Data Analyst',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&q=80',
    bio: 'Builds the analytical models behind IPMC\u2019s project monitoring dashboards.',
  },
  {
    name: 'Omolara Afeni',
    role: 'Environmental Scientist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    bio: 'Specializes in natural and environmental science assessments for field projects.',
  },
  {
    name: 'Adelokun Timilehin',
    role: 'Marketing & Corporate Communications',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&q=80',
    bio: 'Leads marketing strategy and corporate communications for IPMC.',
  },
  {
    name: 'Yusuf Suleiman, B.Sc Statistics',
    role: 'Statistician',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Applies statistical methods to project monitoring and evaluation data.',
  },
  {
    name: 'Michael Farominiyi',
    role: 'Lead Statistician',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Leads the statistics team supporting monitoring and evaluation engagements.',
  },
  {
    name: 'Ehikioya Joseph',
    role: 'Data Extraction Specialist',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    bio: 'Manages data extraction and processing workflows across client engagements.',
  },
];

// The homepage teaser only shows leadership — the first four entries.
export const FEATURED_TEAM = FALLBACK_TEAM.slice(0, 4);
