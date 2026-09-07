import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function NewsletterIssueDetail() {
  const { slug } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsletterIssue(slug)
      .then(setIssue)
      .catch(() => setIssue(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-24 flex justify-center py-20"><Loader2 size={40} className="animate-spin text-primary-600" /></div>;
  if (!issue) return (
    <div className="pt-24 container-custom py-20 text-center">
      <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Issue Not Found</h2>
      <Link to="/newsletter" className="text-primary-600 hover:underline">Back to Archive</Link>
    </div>
  );

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Link to="/newsletter" className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-6">
              <ArrowLeft size={18} /> Back to Archive
            </Link>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">{issue.subject}</h1>
            <div className="flex items-center gap-2 text-primary-200 text-sm">
              <Calendar size={16} /> {new Date(issue.sentAt || issue.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: issue.content }} />
        </div>
      </section>
    </div>
  );
}
