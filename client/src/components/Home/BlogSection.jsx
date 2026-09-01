import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

// Titles/dates match the real posts published on ipmc-ng.com/category/blog
const DEFAULT_POSTS = [
  {
    title: 'The Business Case for ESG: How High ESG Scores Drive Profitability',
    excerpt: 'Why strong ESG performance is increasingly tied to profitability for businesses operating in Nigeria.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b2?w=600&q=80',
    category: 'ESG',
    date: 'Nov 24, 2025',
    readTime: 8,
    slug: 'the-business-case-for-esg-how-high-esg-scores-drive-profitability',
  },
  {
    title: 'Are Nigerian Banks Truly Sustainable, or Just Saying So?',
    excerpt: "A closer look at sustainability claims across Nigeria's banking sector and what genuine ESG commitment requires.",
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    category: 'News',
    date: 'Nov 20, 2025',
    readTime: 6,
    slug: 'are-nigerian-banks-truly-sustainable-or-just-saying-so',
  },
  {
    title: 'Achieving Carbon Neutrality: A Path to Combating Climate Change',
    excerpt: 'Strategies for African enterprises pursuing carbon neutrality while maintaining profitability.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    category: 'ESG',
    date: 'Sep 25, 2024',
    readTime: 10,
    slug: 'carbon-neutrality-neutral-carbon',
  },
];

const categoryColors = {
  'Industry News': 'bg-blue-100 text-blue-700',
  'ESG': 'bg-emerald-100 text-emerald-700',
  'Insights': 'bg-amber-100 text-amber-700',
  'Financial': 'bg-violet-100 text-violet-700',
  'Project Management': 'bg-rose-100 text-rose-700',
};

export default function BlogSection() {
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts('?limit=3')
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            title: p.title,
            excerpt: p.excerpt,
            image: p.coverImage,
            category: p.category ? p.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Insights',
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            readTime: p.readTime || 5,
            slug: p.slug,
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container-custom flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Latest Insights</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-3">
              News & Articles
            </h2>
          </div>
          <Link to="/blog" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
            View All Articles <ArrowUpRight size={18} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden mb-5">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
