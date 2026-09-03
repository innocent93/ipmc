import { motion } from 'framer-motion';
import { Leaf, TrendingUp, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const esgServices = [
  { icon: Leaf, title: 'ESG Ratings', description: 'Comprehensive environmental, social, and governance ratings for African enterprises.' },
  { icon: TrendingUp, title: 'Sustainability Consulting', description: 'Strategic guidance to align sustainability objectives with business goals.' },
  { icon: BarChart3, title: 'Carbon Footprint Analysis', description: 'Detailed assessment and reduction strategies for carbon emissions.' },
  { icon: FileText, title: 'ESG Reporting', description: 'Professional ESG report preparation aligned with global standards.' },
];

export default function ESG() {
  return (
    <div className="pt-24">
      <section className="relative py-20 bg-emerald-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">ESG Solutions</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">Driving Sustainable Business in Africa</h1>
            <p className="text-emerald-200 text-lg">Navigate the complex ESG landscape with expert ratings, rankings, and sustainability consulting services.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {esgServices.map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-emerald-50 rounded-2xl p-8 hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center mb-6">
                  <service.icon size={28} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-3">{service.title}</h3>
                <p className="text-emerald-700 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
