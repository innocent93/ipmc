import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Lagos-Ibadan Expressway Rehabilitation',
    category: 'Infrastructure',
    location: 'Lagos - Ibadan, Nigeria',
    year: '2023',
    description: "Comprehensive project monitoring and quality assurance for Africa's busiest highway rehabilitation project.",
    image: 'https://images.unsplash.com/photo-1590644365607-1c5a0e7e40b6?w=800&q=80',
    stats: { duration: '24 months', budget: '$1.2B', team: '45 engineers' },
  },
  {
    id: 2,
    title: 'NNPC Refinery Modernization',
    category: 'Oil & Gas',
    location: 'Port Harcourt, Nigeria',
    year: '2023',
    description: "Financial audit and advisory services for the rehabilitation of Nigeria's largest oil refinery.",
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    stats: { duration: '36 months', budget: '$2.5B', team: '120 specialists' },
  },
  {
    id: 3,
    title: 'Lekki Deep Sea Port',
    category: 'Maritime',
    location: 'Lekki, Lagos, Nigeria',
    year: '2022',
    description: "End-to-end project monitoring for Nigeria's first deep sea port infrastructure development.",
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    stats: { duration: '48 months', budget: '$1.5B', team: '80 engineers' },
  },
  {
    id: 4,
    title: 'Dangote Fertilizer Plant',
    category: 'Industrial',
    location: 'Lekki Free Trade Zone, Lagos',
    year: '2022',
    description: "Environmental impact assessment and compliance monitoring for Africa's largest fertilizer plant.",
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    stats: { duration: '30 months', budget: '$2.0B', team: '95 specialists' },
  },
  {
    id: 5,
    title: 'Abuja Light Rail Extension',
    category: 'Transportation',
    location: 'Abuja, Nigeria',
    year: '2023',
    description: 'Quality assurance and project monitoring for the Abuja metro rail network expansion.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    stats: { duration: '18 months', budget: '$800M', team: '60 engineers' },
  },
  {
    id: 6,
    title: 'Ajaokuta Steel Complex Revival',
    category: 'Industrial',
    location: 'Ajaokuta, Kogi State, Nigeria',
    year: '2024',
    description: "Comprehensive project monitoring and financial advisory for the revival of Nigeria's steel industry.",
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    stats: { duration: '42 months', budget: '$3.0B', team: '150 specialists' },
  },
];

export default function ProjectGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-3 mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Delivering excellence across Nigeria's most critical infrastructure and energy projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelected(project)}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{project.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative h-64 md:h-80">
                  <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8">
                  <span className="text-sm font-semibold text-blue-600">{selected.category}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{selected.title}</h3>
                  <p className="text-gray-600 mb-6">{selected.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500"><MapPin size={14} /> {selected.location}</span>
                    <span className="flex items-center gap-1 text-gray-500"><Calendar size={14} /> {selected.year}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{selected.stats.duration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{selected.stats.budget}</div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{selected.stats.team}</div>
                      <div className="text-xs text-gray-500">Team Size</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
