import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

export default function NewsletterArchive() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsletterArchive()
      .then((data) => setIssues(data || []))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 lg:pt-24">
      <section className="relative py-20 bg-primary-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Newsletter</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Newsletter Archive</h1>
            <p className="text-primary-200 text-lg">Past editions of IPMC Insights — project monitoring, ESG, and industry updates delivered to subscribers.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-primary-600" /></div>
          ) : issues.length === 0 ? (
            <div className="text-center py-20">
              <Mail size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No issues published yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back soon, or subscribe below to get the next one directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {issues.map((issue, i) => (
                <motion.div key={issue._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/newsletter/${issue.slug}`} className="block bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-shadow group h-full">
                    <div className="h-40 bg-gradient-to-br from-primary-700 to-primary-500" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Calendar size={13} />
                        {new Date(issue.sentAt || issue.createdAt).toLocaleDateString()}
                      </div>
                      <h3 className="font-display text-lg font-bold text-primary-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2">{issue.subject}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{issue.summary}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 mt-4">Read Issue <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
