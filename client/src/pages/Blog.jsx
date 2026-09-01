import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { FALLBACK_POSTS } from '../data/blogPosts';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts()
      .then(res => setPosts(res && res.length > 0 ? res : FALLBACK_POSTS))
      // Backend unreachable (e.g. static-only deploy) \u2014 fall back to
      // built-in content instead of leaving the page empty.
      .catch(() => setPosts(FALLBACK_POSTS))
      .finally(() => setLoading(false));
  }, []);

  const categoryColors = {
    'esg': 'bg-emerald-100 text-emerald-700',
    'financial': 'bg-blue-100 text-blue-700',
    'project-management': 'bg-amber-100 text-amber-700',
    'environmental': 'bg-teal-100 text-teal-700',
    'industry-news': 'bg-violet-100 text-violet-700',
    'insights': 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Blog & Insights</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Latest News & Analysis</h1>
            <p className="text-primary-200 text-lg">Expert perspectives on project management, ESG, and industry trends.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.length > 0 ? posts.map((post, i) => (
                <motion.article key={post._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                      <div className="relative h-56 overflow-hidden">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                            {post.category.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">Read Article <ArrowUpRight size={16} /></span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )) : (
                <div className="col-span-3 text-center py-20 text-gray-500">No posts found.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
