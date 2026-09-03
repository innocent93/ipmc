import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, TrendingUp, Leaf, BarChart3, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

const DEFAULT_SERVICES = [
  {
    icon: BarChart3,
    title: 'Project Administration',
    description: 'Comprehensive project administration ensuring your projects stay on track, within budget, and meet all objectives.',
    features: ['Progress Tracking', 'Budget Control', 'Risk Assessment', 'Milestone Management'],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    slug: 'project-administration',
  },
  {
    icon: TrendingUp,
    title: 'Financial Advisory',
    description: 'Strategic financial guidance tailored for businesses and individuals in the oil, gas, and energy sectors.',
    features: ['Investment Analysis', 'Risk Management', 'Financial Planning', 'Due Diligence'],
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    slug: 'financial-advisory',
  },
  {
    icon: Leaf,
    title: 'Environmental Services',
    description: 'Research, evaluation, and compliance solutions delivered by our team of environmental specialists.',
    features: ['Impact Assessment', 'Compliance Audits', 'Remediation Planning', 'Sustainability Reports'],
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    slug: 'environmental',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Rigorous quality control and assurance protocols to ensure project deliverables meet the highest standards.',
    features: ['ISO Compliance', 'Process Audits', 'Quality Control', 'Standards Review'],
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    slug: 'quality-assurance',
  },
  {
    icon: AlertTriangle,
    title: 'Forensic Audit',
    description: 'Advanced fraud detection and prevention systems to safeguard your operations and investments.',
    features: ['Risk Assessment', 'Forensic Analysis', 'Compliance Monitoring', 'Investigation'],
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    slug: 'forensic-audit',
  },
  {
    icon: CheckCircle,
    title: 'ESG Ratings & Rankings',
    description: 'Comprehensive ESG ratings and sustainability reporting to help you meet global standards.',
    features: ['ESG Scoring', 'Sustainability Reports', 'Compliance', 'Benchmarking'],
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    slug: 'esg-ratings',
  },
];

export default function ServicesSection() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices('?limit=6')
      .then(data => {
        if (data && data.length > 0) {
          // Map API data to component format
          const mapped = data.map(s => ({
            icon: BarChart3, // Default icon
            title: s.title,
            description: s.shortDescription,
            features: s.features || [],
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            slug: s.slug,
          }));
          setServices(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container-custom flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-3 mb-4">
            Comprehensive Solutions for Complex Challenges
          </h2>
          <p className="text-gray-600 leading-relaxed">
            From project monitoring to ESG compliance, we deliver end-to-end solutions that drive measurable results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.slug || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/services/${service.slug}`} className="group block h-full">
                <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon size={28} className={service.textColor} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle size={14} className={service.textColor} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
