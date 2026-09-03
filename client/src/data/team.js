// Real IPMC personnel — names, roles, and photo URLs extracted directly
// from the live "Meet Our Specialized Team" section at
// ipmc-ng.com/about; bios below are written fresh for this project.
//
// Photos are hotlinked from IPMC's own WordPress/Jetpack CDN
// (i0.wp.com/ipmc-ng.com/...) rather than downloaded and self-hosted —
// this sandbox has no ability to fetch and save binary image data (a
// hard tool limitation, not a permissions one; confirmed directly: a
// fetch of one of these exact URLs returns "Image content is not
// supported" even once the URL itself is reachable). Real team photos
// hotlinked from the source is still a meaningful improvement over the
// generic Unsplash stock photos used previously. To self-host these
// instead, run scripts/ipmc-team-images/download-team-images.js
// anywhere with normal internet access, then point `image` below at the
// downloaded files.
//
// Used as a fallback whenever the /api/team endpoint is unreachable or
// has no records yet, same pattern as data/services.js and data/blogPosts.js.
export const FALLBACK_TEAM = [
  {
    name: 'Robert Ade-Odiachi, FCA',
    role: 'Chief Executive Officer',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2024/06/IMG-20240627-WA0001.jpg?ssl=1',
    bio: 'Leads IPMC with three decades of experience across finance, engineering and project consulting.',
  },
  {
    name: 'Adebayo Ajao, MSc Economics',
    role: 'Head of Research',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Adebayo_Ajao.jpg?ssl=1',
    bio: 'Directs research and economic analysis behind IPMC\u2019s advisory and ESG work.',
  },
  {
    name: 'Chika Onyekwere, B.Eng',
    role: 'Environmental Consultant',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Chika_Onyekwere.jpg?ssl=1',
    bio: 'Leads environmental impact assessments and compliance across client projects.',
  },
  {
    name: 'Agatha Afemike, BSc, ACA, GRI',
    role: 'ESG Consultant',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/newAgatha-1.jpg?ssl=1',
    bio: 'Guides clients through ESG assessment, ratings and sustainability reporting.',
  },
  {
    name: 'Ayodeji Adeniran, MDSS, ACIS',
    role: 'Governance Specialist',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Ayodeji_Adeniran.jpg?ssl=1',
    bio: 'Advises clients on board governance structure and regulatory compliance frameworks.',
  },
  {
    name: 'Samuel Amoo, M.Sc Information Technology',
    role: 'Data Analyst',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Samuel.jpg?ssl=1',
    bio: 'Builds the analytical models behind IPMC\u2019s project monitoring dashboards.',
  },
  {
    name: 'Omolara Afeni',
    role: 'Environmental Scientist',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Omolara_Afeni.jpg?ssl=1',
    bio: 'Specializes in natural and environmental science assessments for field projects.',
  },
  {
    name: 'Adelokun Timilehin',
    role: 'Marketing & Corporate Communications',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Adelokun_Timilehin.jpg?ssl=1',
    bio: 'Leads marketing strategy and corporate communications for IPMC.',
  },
  {
    name: 'Yusuf Suleiman, B.Sc Statistics',
    role: 'Statistician',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Yusuf_Suleiman.jpg?ssl=1',
    bio: 'Applies statistical methods to project monitoring and evaluation data.',
  },
  {
    name: 'Michael Farominiyi',
    role: 'Lead Statistician',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Michael_Farominiyi_Statistics.jpg?ssl=1',
    bio: 'Leads the statistics team supporting monitoring and evaluation engagements.',
  },
  {
    name: 'Ehikioya Joseph',
    role: 'Data Extraction Specialist',
    image: 'https://i0.wp.com/ipmc-ng.com/wp-content/uploads/2023/11/Ehikioya_Joseph_ACCOUNTING.jpg?ssl=1',
    bio: 'Manages data extraction and processing workflows across client engagements.',
  },
];

// The homepage teaser only shows leadership — the first four entries.
export const FEATURED_TEAM = FALLBACK_TEAM.slice(0, 4);

// Generates a deterministic initials-avatar data URL as an <img onError>
// fallback — if IPMC's CDN is ever briefly unreachable, real users see a
// clean placeholder instead of a broken-image icon.
export function initialsAvatar(name) {
  const initials = name.split(',')[0].split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#0B1830"/><text x="100" y="115" font-family="Georgia, serif" font-size="72" fill="#C8862B" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(svg) : Buffer.from(svg).toString('base64')}`;
}
