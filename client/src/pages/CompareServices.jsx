import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Plus, ArrowRight, Check } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';

const MAX_COMPARE = 3;

export default function CompareServices() {
  const [selected, setSelected] = useState([]);
  const [picking, setPicking] = useState(false);

  const addService = (slug) => {
    if (selected.length >= MAX_COMPARE || selected.includes(slug)) return;
    setSelected([...selected, slug]);
    setPicking(false);
  };
  const removeService = (slug) => setSelected(selected.filter((s) => s !== slug));

  const selectedServices = selected.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
  const availableToAdd = SERVICES.filter((s) => !selected.includes(s.slug));

  return (
    <div className="pt-20 lg:pt-24">
      <section className="relative py-16 bg-primary-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Compare</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-4 mb-4">Compare Our Capabilities</h1>
            <p className="text-primary-200">Select up to {MAX_COMPARE} services side by side to see how they differ.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className={`grid gap-6 mb-10 ${selectedServices.length === 0 ? 'grid-cols-1' : `grid-cols-1 md:grid-cols-${Math.min(selectedServices.length + 1, 4)}`}`}>
            {selectedServices.map((service) => (
              <div key={service.slug} className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 relative border border-gray-100 dark:border-slate-800">
                <button onClick={() => removeService(service.slug)} aria-label={`Remove ${service.title}`}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-600">
                  {SERVICE_CATEGORIES.find((c) => c.id === service.category)?.name}
                </span>
                <h3 className="font-display text-lg font-bold text-primary-900 dark:text-white mt-2 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.summary}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Full Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}

            {selectedServices.length < MAX_COMPARE && (
              <div className="relative">
                {picking ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-primary-200 dark:border-primary-800 p-4 max-h-96 overflow-y-auto">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="mb-3">
                        <div className="text-[11px] font-mono uppercase text-gray-400 mb-1.5 px-2">{cat.name}</div>
                        {availableToAdd.filter((s) => s.category === cat.id).map((s) => (
                          <button key={s.slug} onClick={() => addService(s.slug)}
                            className="w-full text-left px-2 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Check size={14} className="text-primary-400 opacity-0" />
                            {s.title}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setPicking(true)}
                    className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
                    <Plus size={28} />
                    <span className="text-sm font-medium">Add a service to compare</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedServices.length === 0 && (
            <p className="text-center text-gray-400 text-sm">Nothing selected yet — click "Add a service to compare" above to get started.</p>
          )}
        </div>
      </section>
    </div>
  );
}
