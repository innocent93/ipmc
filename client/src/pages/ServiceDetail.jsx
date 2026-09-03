import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { getServiceBySlug, SERVICE_CATEGORIES, SERVICES } from '../data/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getService(slug)
      .then((res) => setService(res || getServiceBySlug(slug)))
      // Backend unreachable or this service isn't in the CMS yet — fall
      // back to the built-in catalog (data/services.js) rather than
      // showing "Service Not Found" for a page that legitimately exists.
      .catch(() => setService(getServiceBySlug(slug)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-24 flex justify-center py-20">
      <Loader2 size={40} className="animate-spin text-primary-600" />
    </div>
  );

  if (!service) return (
    <div className="pt-24 container-custom py-20 text-center">
      <h2 className="text-2xl font-bold text-primary-900 mb-4">Service Not Found</h2>
      <p className="text-gray-500 mb-6">We couldn't find a service at this address.</p>
      <Link to="/services" className="text-primary-600 hover:underline font-semibold">Back to Services</Link>
    </div>
  );

  const categoryName = SERVICE_CATEGORIES.find((c) => c.id === service.category)?.name;
  const related = SERVICES.filter((s) => s.category === service.category && s.slug !== service.slug).slice(0, 3);
  // API-sourced records may have a rich HTML fullDescription; the local
  // fallback catalog has a plain-text description — support both.
  const bodyHtml = service.fullDescription || `<p>${service.description}</p>`;

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950 overflow-hidden">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/services" className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors mb-6">
              <ArrowLeft size={18} /> Back to Services
            </Link>
            {categoryName && (
              <span className="font-mono text-xs uppercase tracking-wider text-accent-400">{categoryName}</span>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">{service.title}</h1>
            {service.summary && <p className="text-primary-200 text-lg mt-4 max-w-2xl">{service.summary}</p>}
          </motion.div>
        </div>
        <div className="tick-rule tick-rule--dark absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          <aside className="space-y-8">
            <div className="bg-primary-50 rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Ready to get started?</h3>
              <p className="text-sm text-gray-600 mb-5">Tell us about your project and our team will follow up within 24-48 hours.</p>
              <Link to="/proposal" className="btn-primary w-full text-center block">Request a Proposal</Link>
            </div>

            {related.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Related Capabilities</h3>
                <ul className="space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link to={`/services/${r.slug}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors group">
                        <CheckCircle2 size={15} className="text-primary-400 group-hover:text-primary-600 shrink-0" />
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
