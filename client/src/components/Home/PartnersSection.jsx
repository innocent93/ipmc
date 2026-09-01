import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

const DEFAULT_PARTNERS = [
  { name: 'NUPRC', logo: 'NUPRC', color: 'bg-green-700' },
  { name: 'Lagos State Safety Commission', logo: 'LSSC', color: 'bg-blue-600' },
  { name: 'NESREA', logo: 'NESREA', color: 'bg-emerald-600' },
  { name: 'GRI', logo: 'GRI', color: 'bg-blue-500' },
  { name: 'ISPON', logo: 'ISPON', color: 'bg-orange-600' },
  { name: 'CMD', logo: 'CMD', color: 'bg-green-600' },
  { name: 'Federal Ministry of Environment', logo: 'FME', color: 'bg-red-700' },
  { name: 'Nigerian Environmental Society', logo: 'NES', color: 'bg-green-500' },
  { name: 'LASEPA', logo: 'LASEPA', color: 'bg-teal-600' },
  { name: 'DPR', logo: 'DPR', color: 'bg-blue-700' },
  { name: 'ISO', logo: 'ISO', color: 'bg-amber-600' },
  { name: 'SON', logo: 'SON', color: 'bg-red-600' },
];

export default function PartnersSection() {
  const [partners, setPartners] = useState(DEFAULT_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPartners()
      .then(data => {
        if (data && data.length > 0) {
          setPartners(data.map(p => ({ name: p.name, logo: p.name.substring(0, 4).toUpperCase(), color: 'bg-blue-600' })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Duplicate for seamless infinite scroll
  const duplicated = [...partners, ...partners, ...partners];

  return (
    <section id="partners-section" className="py-16 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container-custom mb-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Trusted By</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-2">
            Regulatory Bodies & Industry Partners
          </h2>
        </motion.div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div 
          className="flex gap-8"
          animate={{ x: [0, -partners.length * 180] }}
          transition={{ 
            x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }
          }}
        >
          {duplicated.map((partner, i) => (
            <div 
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 w-44 h-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center px-4 hover:shadow-md hover:border-blue-200 transition-all cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${partner.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {partner.logo}
                </div>
                <span className="text-sm font-semibold text-gray-700 leading-tight">{partner.name}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
