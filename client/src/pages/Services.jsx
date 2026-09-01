import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../utils/api';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then((res) => setServices(res && res.length > 0 ? res : SERVICES))
      // Backend unreachable — fall back to the full built-in catalog so
      // this page (and every link into it) still works.
      .catch(() => setServices(SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const grouped = SERVICE_CATEGORIES.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category === cat.id),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-primary-950 overflow-hidden">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Our Capabilities</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Comprehensive Industry Solutions</h1>
            <p className="text-primary-200 text-lg">End-to-end services designed to meet the unique challenges of Nigeria's oil, gas, and infrastructure sectors — organized the same way across all {SERVICES.length} capabilities.</p>
          </motion.div>
        </div>
        <div className="tick-rule tick-rule--dark absolute bottom-0 left-0 right-0" aria-hidden="true" />
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-16">
              {grouped.map((category) => (
                <div key={category.id}>
                  <h2 className="font-display text-2xl font-bold text-primary-900 mb-6 pb-3 border-b border-gray-100">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((service, i) => (
                      <motion.div
                        key={service.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i % 3) * 0.08 }}
                      >
                        <Link to={`/services/${service.slug}`} className="group block h-full">
                          <div className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-display text-lg font-bold text-primary-900 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                              <ArrowRight size={18} className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{service.summary || service.shortDescription}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
