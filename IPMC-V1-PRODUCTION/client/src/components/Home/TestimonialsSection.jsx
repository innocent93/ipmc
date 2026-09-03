import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "IPMC's project monitoring capabilities have been instrumental in ensuring our infrastructure projects are delivered on time and within budget. Their team's expertise is unmatched.",
    author: 'Engr. Adebayo Johnson',
    role: 'Director of Projects',
    company: 'Federal Ministry of Works',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 2,
    text: "The financial advisory services provided by IPMC helped us navigate complex regulatory requirements and optimize our investment portfolio. Highly recommended.",
    author: 'Dr. Ngozi Okonkwo',
    role: 'Chief Financial Officer',
    company: 'Nigerian National Petroleum Corporation',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
  },
  {
    id: 3,
    text: "Their ESG consulting team helped us achieve full compliance with international sustainability standards. The impact on our operations has been transformative.",
    author: 'Mr. Ibrahim Musa',
    role: 'Head of Sustainability',
    company: 'Dangote Industries',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  {
    id: 4,
    text: "IPMC's QHSE services have significantly improved our safety metrics across all project sites. Their proactive approach to risk management is exceptional.",
    author: 'Engr. Patricia Eze',
    role: 'QHSE Manager',
    company: 'Shell Petroleum Development Company',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Quote size={48} className="text-amber-500 mx-auto mb-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl md:text-2xl leading-relaxed mb-8 font-light">
                "{t.text}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <img src={t.image} alt={t.author} className="w-14 h-14 rounded-full object-cover" />
                <div className="text-left">
                  <div className="font-semibold">{t.author}</div>
                  <div className="text-sm text-gray-400">{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'w-6 bg-amber-500' : 'bg-white/30'}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
