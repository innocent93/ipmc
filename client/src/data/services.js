// Every entry here corresponds to a real page in IPMC's live capability
// menu (ipmc-ng.com/[Capabilities]) — extracted directly from the site's
// navigation so nothing in this app's own nav links to a route that
// doesn't exist. Descriptions below are written fresh for this project,
// not copied or paraphrased from the source site's page text.

export const SERVICE_CATEGORIES = [
  { id: 'engineering', name: 'Engineering Services' },
  { id: 'advisory', name: 'Advisory Services' },
  { id: 'data', name: 'Data Management' },
  { id: 'manpower', name: 'Manpower Supply Services' },
  { id: 'qhse', name: 'Quality, Health, Safety & Environment' },
  { id: 'esg', name: 'ESG Services' },
  { id: 'aimps', name: 'Asset Integrity Management & Pipeline Maintenance' },
];

export const SERVICES = [
  // Engineering Services
  {
    slug: 'project-administration',
    title: 'Project Administration',
    category: 'engineering',
    summary: 'Progress tracking, budget control and milestone management for complex projects.',
    description: 'IPMC provides end-to-end project administration — scheduling, budget tracking, milestone reporting and stakeholder coordination — so project owners have a clear, independent view of progress at every stage, from mobilization through close-out.',
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    category: 'engineering',
    summary: 'Independent oversight keeping projects on time, on budget, and to specification.',
    description: 'Our project management team applies structured planning, risk management and change-control processes across the project lifecycle, giving clients confidence that scope, cost and schedule stay aligned with the original business case.',
  },
  {
    slug: 'qa-qc',
    title: 'QA/QC (Third Party Inspection)',
    category: 'engineering',
    summary: 'Independent quality assurance, quality control and third-party inspection.',
    description: 'IPMC combines quality assurance planning, on-site quality control inspection, and independent third-party verification to catch defects early, confirm regulatory compliance, and give clients an objective record of project quality.',
  },
  {
    slug: 'cost-engineering',
    title: 'Cost Engineering',
    category: 'engineering',
    summary: 'Cost estimation, control and forecasting across the project lifecycle.',
    description: 'From early-stage cost estimation through to cost control and variance analysis during execution, IPMC\u2019s cost engineering practice helps clients plan realistic budgets and catch cost overruns before they become material.',
  },

  // Advisory Services
  {
    slug: 'value-for-money-audit',
    title: 'Value for Money Audit',
    category: 'advisory',
    summary: 'Identifying savings and efficiency gains without compromising project outcomes.',
    description: 'Our value-for-money audits examine procurement, contracting and execution decisions against comparable market benchmarks, surfacing concrete opportunities for cost savings and efficiency improvements for our clients.',
  },
  {
    slug: 'forensic-audit',
    title: 'Forensic Audit',
    category: 'advisory',
    summary: 'Investigating financial irregularities and strengthening fraud controls.',
    description: 'IPMC\u2019s forensic audit team investigates suspected financial irregularities, traces the movement of funds, and produces findings that can support internal disciplinary action, recovery efforts, or legal proceedings — while also recommending controls to prevent recurrence.',
  },
  {
    slug: 'assurance-services',
    title: 'Assurance Services',
    category: 'advisory',
    summary: 'Independent assurance over financial, operational and compliance processes.',
    description: 'We provide independent assurance reviews of financial reporting, internal controls and operational processes, giving boards, investors and regulators confidence that what\u2019s reported reflects what\u2019s actually happening on the ground.',
  },
  {
    slug: 'monitoring-and-evaluation',
    title: 'Monitoring and Evaluation',
    category: 'advisory',
    summary: 'Tracking program outcomes against defined objectives and indicators.',
    description: 'IPMC designs and runs monitoring and evaluation frameworks that track program and project outcomes against agreed indicators, giving funders and implementers evidence-based insight into what\u2019s working and what needs to change.',
  },
  {
    slug: 'financial-advisory',
    title: 'Financial Advisory',
    category: 'advisory',
    summary: 'Investment analysis, risk management and due diligence for energy-sector clients.',
    description: 'IPMC has established itself as a trusted source of financial advisory services for Nigeria\u2019s energy sector — supporting investment appraisal, financial due diligence, and risk assessment for clients structuring major project finance decisions.',
  },

  // Data Management
  {
    slug: 'data-science-and-analysis',
    title: 'Data Science and Analysis',
    category: 'data',
    summary: 'Turning raw project and operational data into decision-ready insight.',
    description: 'Our data science team builds analytical models and dashboards that convert raw operational, financial and project data into clear, decision-ready insight for clients across the oil, gas and infrastructure sectors.',
  },
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    category: 'data',
    summary: 'Applied AI for forecasting, anomaly detection and process automation.',
    description: 'IPMC applies machine learning and AI techniques to practical problems our clients face — predictive maintenance, anomaly detection in operational data, and automation of repetitive analysis and reporting workflows.',
  },
  {
    slug: 'data-visualization',
    title: 'Data Visualizations',
    category: 'data',
    summary: 'Interactive dashboards that make complex data easy to act on.',
    description: 'We design interactive dashboards and reporting tools that translate complex, multi-source datasets into visuals that executives and project teams can actually use to make faster, better-informed decisions.',
  },
  {
    slug: 'software-development',
    title: 'Software Development',
    category: 'data',
    summary: 'Custom tools and systems built around our clients\u2019 specific workflows.',
    description: 'IPMC\u2019s software development team builds custom internal tools and systems — from project tracking platforms to compliance databases — tailored to the specific workflows of the organizations we serve.',
  },

  // Manpower Supply Services
  {
    slug: 'manpower-supply-technical',
    title: 'Manpower Supply (Technical)',
    category: 'manpower',
    summary: 'Vetted technical and engineering personnel for project deployment.',
    description: 'IPMC sources and supplies vetted technical and engineering personnel — from field engineers to specialist inspectors — for clients who need qualified staff deployed quickly and reliably to active projects.',
  },
  {
    slug: 'manpower-supply-admin',
    title: 'Manpower Supply (Administration)',
    category: 'manpower',
    summary: 'Qualified administrative and support staff for project and office teams.',
    description: 'Beyond technical roles, IPMC supplies qualified administrative and support personnel, helping client organizations scale project and office teams up or down without carrying the full overhead of direct recruitment.',
  },

  // Quality, Health, Safety & Environment
  {
    slug: 'safety-health',
    title: 'Safety, Health & Environment (COSHH)',
    category: 'qhse',
    summary: 'Workplace safety and hazardous-substance control frameworks.',
    description: 'IPMC develops and audits Safety, Health and Environment frameworks — including control of substances hazardous to health (COSHH) — that keep client worksites compliant and protect the people working on them.',
  },
  {
    slug: 'quality-management',
    title: 'Quality Management Systems',
    category: 'qhse',
    summary: 'ISO-aligned quality management system design and audit.',
    description: 'We help clients design, implement and audit quality management systems aligned with recognized international standards, embedding consistent quality practice across the organization rather than a single project.',
  },
  {
    slug: 'environmental-management',
    title: 'Environmental Management Systems',
    category: 'qhse',
    summary: 'Structured environmental compliance and impact management.',
    description: 'Our environmental management systems work helps clients structure their environmental compliance programs — from impact assessment through ongoing monitoring — in line with Nigerian regulatory requirements.',
  },
  {
    slug: 'safety-protection',
    title: 'Safety, Protection, Security & Firefighting',
    category: 'qhse',
    summary: 'Site safety, security and fire-protection system audits.',
    description: 'IPMC audits and advises on site safety, physical security and fire-protection systems for industrial and infrastructure clients, helping ensure both regulatory compliance and genuine operational readiness.',
  },
  {
    slug: 'environmental-service',
    title: 'Environmental Services',
    category: 'qhse',
    summary: 'Impact assessments, compliance audits, and sustainability reporting.',
    description: 'IPMC\u2019s environmental services span impact assessment, compliance auditing and sustainability reporting — helping clients understand and manage their environmental footprint across the project lifecycle.',
  },

  // ESG Services
  {
    slug: 'esg-ratings',
    title: 'ESG Ratings and Rankings',
    category: 'esg',
    summary: 'Independent ESG scoring to help businesses align sustainability with profit.',
    description: 'In an increasingly ESG-focused world, our ratings and rankings services help businesses benchmark their sustainability performance against peers and align environmental, social and governance objectives with commercial strategy.',
  },
  {
    slug: 'esg-consulting',
    title: 'ESG Consulting & Reporting',
    category: 'esg',
    summary: 'End-to-end ESG strategy, disclosure and reporting support.',
    description: 'We work with clients from initial ESG strategy design through to disclosure and reporting, helping them build credible sustainability programs that hold up to investor, regulator and public scrutiny.',
  },

  // Asset Integrity Management & Pipeline Maintenance Services
  {
    slug: 'aimps-what-we-do',
    title: 'Asset Integrity Management — What We Do',
    category: 'aimps',
    summary: 'Overview of IPMC\u2019s asset integrity and pipeline maintenance practice.',
    description: 'IPMC\u2019s Asset Integrity Management and Pipeline Maintenance Services practice covers the full lifecycle of critical infrastructure integrity — from inspection planning through remediation — for oil and gas operators.',
  },
  {
    slug: 'aimps-scope',
    title: 'Scope of Our Asset Integrity & Inspection',
    category: 'aimps',
    summary: 'The range of inspection disciplines covered under our AIMPS practice.',
    description: 'Our asset integrity and inspection scope spans pipeline pre-commissioning and maintenance, process inspection, in-line inspection services, and integrity assessments across upstream and midstream infrastructure.',
  },
  {
    slug: 'aimps-methodology',
    title: 'Asset Integrity Management Methodology',
    category: 'aimps',
    summary: 'The risk-based methodology behind our integrity assessments.',
    description: 'IPMC applies a risk-based asset integrity methodology — prioritizing inspection and maintenance effort toward the assets and failure modes that pose the greatest operational and safety risk.',
  },
  {
    slug: 'aimps-audit',
    title: 'Asset Integrity Audit',
    category: 'aimps',
    summary: 'Independent audit of asset integrity management programs.',
    description: 'We conduct independent audits of client asset integrity management programs, verifying that inspection, maintenance and risk-management practices are actually being followed as documented — not just on paper.',
  },
];

export function getServiceBySlug(slug) {
  return SERVICES.find((s) => s.slug === slug) || null;
}

export function getServicesByCategory(categoryId) {
  return SERVICES.filter((s) => s.category === categoryId);
}
