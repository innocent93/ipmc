// Fallback blog content, used whenever the backend API is unreachable or
// returns an empty result (e.g. a static-only deploy with no server behind
// it yet). Titles/dates/categories mirror the real posts published on
// ipmc-ng.com/category/blog; body copy below is written fresh for this
// site, not copied from the source articles.
export const FALLBACK_POSTS = [
  {
    _id: 'fallback-1',
    slug: 'the-business-case-for-esg-how-high-esg-scores-drive-profitability',
    title: 'The Business Case for ESG: How High ESG Scores Drive Profitability',
    excerpt: 'Why strong ESG performance is increasingly tied to profitability for businesses operating in Nigeria.',
    content: `Environmental, Social and Governance performance used to be treated as a compliance checkbox. That view is changing fast. Investors, lenders and regulators now read ESG scores as a proxy for how well a company manages risk, retains talent and plans for the long term.

For Nigerian businesses, the shift matters for practical reasons: multinational partners increasingly require ESG disclosures before signing contracts, development finance institutions price ESG risk into lending terms, and consumers are paying closer attention to how the companies they buy from operate.

A credible ESG programme starts with an honest baseline assessment, followed by a plan with measurable targets, not just a policy document. Companies that treat ESG as a growth strategy rather than a reporting obligation tend to see the clearest returns \u2014 in lower cost of capital, stronger stakeholder trust and better long-term resilience.`,
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b2?w=1200&q=80',
    category: 'esg',
    author: 'IPMC Research Team',
    publishedAt: '2025-11-24',
    readTime: 8,
  },
  {
    _id: 'fallback-2',
    slug: 'are-nigerian-banks-truly-sustainable-or-just-saying-so',
    title: 'Are Nigerian Banks Truly Sustainable, or Just Saying So?',
    excerpt: "A closer look at sustainability claims across Nigeria's banking sector and what genuine ESG commitment requires.",
    content: `Nearly every major Nigerian bank now publishes a sustainability report. Green logos, climate pledges and ESG committees have become standard. The harder question is how much of that activity changes actual lending and operating decisions.

Genuine sustainability commitment shows up in specific places: whether high-carbon lending is genuinely screened and priced for risk, whether disclosures are independently verified rather than self-reported, and whether sustainability targets are tied to executive incentives.

Closing the gap between sustainability messaging and sustainability practice requires third-party ESG assessment, transparent metrics, and a willingness to report the numbers that don't look good yet \u2014 not just the ones that do.`,
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    category: 'industry-news',
    author: 'IPMC Research Team',
    publishedAt: '2025-11-20',
    readTime: 6,
  },
  {
    _id: 'fallback-3',
    slug: '2022-nigeria-top-100-listed-companies-by-financial-metrics-and-ratio-analysis',
    title: '2022 Nigeria Top 100 Listed Companies by Financial Metrics and Ratio Analysis',
    excerpt: "A data-driven ranking of Nigeria's top listed companies based on key financial performance ratios.",
    content: `Ranking listed companies purely on market capitalisation tells only part of the story. A ratio-based view \u2014 profitability, liquidity, leverage and efficiency metrics side by side \u2014 surfaces a different, often more useful, picture of financial health.

This analysis draws on published financial statements across Nigeria's top 100 listed companies, standardising metrics so that a bank, a manufacturer and a telecom can be compared on a level footing. The result is a reference point for investors and analysts who want more than a single headline number.

As with any ratio analysis, context matters: sector norms vary widely, and a ratio that looks weak in isolation may simply reflect the capital intensity of that industry.`,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    category: 'financial',
    author: 'IPMC Research Team',
    publishedAt: '2024-09-30',
    readTime: 9,
  },
  {
    _id: 'fallback-4',
    slug: 'carbon-neutrality-neutral-carbon',
    title: 'Achieving Carbon Neutrality: A Path to Combating Climate Change',
    excerpt: 'Strategies for African enterprises pursuing carbon neutrality while maintaining profitability.',
    content: `Carbon neutrality is often framed as a cost. For companies that plan carefully, it can instead be a source of operating efficiency \u2014 lower energy spend, reduced waste, and access to green financing that isn't available to higher-emission competitors.

A workable path usually starts with a full emissions inventory (Scope 1, 2, and where possible Scope 3), followed by a reduction plan that targets the highest-impact sources first \u2014 typically energy use and transport/logistics for most Nigerian enterprises \u2014 before offsetting whatever remains.

The companies that succeed treat this as a multi-year programme with clear milestones, not a one-off pledge. Independent verification of progress is what turns a carbon-neutrality claim into a credible one.`,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    category: 'esg',
    author: 'IPMC Research Team',
    publishedAt: '2024-09-25',
    readTime: 10,
  },
  {
    _id: 'fallback-5',
    slug: 'the-evolution-of-esg-ratings',
    title: 'The Evolution of ESG Ratings',
    excerpt: 'How ESG rating methodologies have changed and what that means for companies being scored.',
    content: `Early ESG ratings leaned heavily on self-reported disclosures, which made them easy to game. Rating providers have since moved toward frameworks that weight verified data, controversy tracking, and sector-specific materiality more heavily.

For companies, this means the metrics that mattered five years ago aren't always the ones that move a score today. A rating built mostly on policy documents now carries less weight than one backed by audited performance data and independent verification.

Understanding which framework a given rating provider uses \u2014 and what it actually measures \u2014 is the first step to improving a score in a way that reflects real operational change, not just better paperwork.`,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    category: 'esg',
    author: 'IPMC Research Team',
    publishedAt: '2024-01-12',
    readTime: 7,
  },
  {
    _id: 'fallback-6',
    slug: 'the-imperative-for-sustainable-business-practices',
    title: 'The Imperative for Sustainable Business Practices',
    excerpt: 'Why sustainable operations are becoming a baseline expectation rather than a differentiator.',
    content: `Sustainable business practice is shifting from a competitive advantage to a baseline expectation. Regulators are tightening environmental compliance requirements, supply-chain partners increasingly audit upstream sustainability practices, and financing terms are starting to reflect ESG risk directly.

For companies still treating sustainability as optional, the practical risk is falling out of step with the partners and financiers who no longer see it that way. For companies that build it into core operations early, the payoff is fewer compliance surprises and stronger long-term partnerships.

The starting point is the same regardless of sector: an honest assessment of current practice, followed by a plan with real accountability behind it.`,
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    category: 'insights',
    author: 'IPMC Research Team',
    publishedAt: '2023-11-21',
    readTime: 6,
  },
];

export function getFallbackPost(slug) {
  return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
}

export function getFallbackRelated(slug, limit = 3) {
  return FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}
