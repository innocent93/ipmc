import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { getFallbackPost, getFallbackRelated } from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getPost(slug)
        .then(res => setPost(res || getFallbackPost(slug)))
        // Backend unreachable or post not found there \u2014 try the
        // built-in fallback content before giving up.
        .catch(() => setPost(getFallbackPost(slug))),
      api.getRelatedPosts(slug)
        .then(res => setRelated(res && res.length > 0 ? res : getFallbackRelated(slug)))
        .catch(() => setRelated(getFallbackRelated(slug)))
    ]).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-24 flex justify-center py-20"><Loader2 size={40} className="animate-spin text-primary-600" /></div>;
  if (!post) return <div className="pt-24 container-custom py-20 text-center"><h2 className="text-2xl font-bold text-primary-900 mb-4">Post Not Found</h2><Link to="/blog" className="text-primary-600 hover:underline">Back to Blog</Link></div>;

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${post.coverImage})` }} />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-6"><ArrowLeft size={18} /> Back to Blog</Link>
            <span className="inline-block px-3 py-1 bg-accent-500/20 text-accent-400 text-xs font-semibold rounded-full mb-4 border border-accent-500/30">{post.category.replace('-', ' ').toUpperCase()}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex items-center gap-6 text-primary-200 text-sm">
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime} min read</span>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>
    </div>
  );
}
