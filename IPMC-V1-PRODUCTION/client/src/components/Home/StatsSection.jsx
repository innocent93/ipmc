import { motion } from 'framer-motion';
import { useCounter } from '../../hooks/useScrollAnimation';
import { Award, Users, Building2, Globe } from 'lucide-react';

const stats = [
  { icon: Award, value: 35, suffix: '+', label: 'Years Experience', color: 'text-accent-400' },
  { icon: Users, value: 70, suffix: '+', label: 'Expert Engineers', color: 'text-primary-400' },
  { icon: Building2, value: 150, suffix: '+', label: 'Projects Completed', color: 'text-emerald-400' },
  { icon: Globe, value: 10, suffix: '+', label: 'Industry Partners', color: 'text-rose-400' },
];

function StatCard({ stat, index }) {
  const [ref, count] = useCounter(stat.value, 2500);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
        <div className={`w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon size={28} className={stat.color} />
        </div>
        <div className="stat-figure text-4xl md:text-5xl text-primary-900 mb-2">
          {count}{stat.suffix}
        </div>
        <div className="text-gray-500 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-primary-50">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wider uppercase">Our Impact</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mt-3">
            Numbers That Speak Excellence
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
