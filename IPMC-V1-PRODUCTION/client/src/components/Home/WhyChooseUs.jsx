import { motion } from 'framer-motion';
import { Check, Award, Users, Clock, Shield } from 'lucide-react';

const reasons = [
  { icon: Award, title: '35+ Years Experience', description: 'Decades of proven expertise in project monitoring and management across Nigeria.' },
  { icon: Users, title: '70+ Expert Engineers', description: 'A dedicated team of certified professionals delivering excellence in every project.' },
  { icon: Clock, title: 'Timely Delivery', description: 'We pride ourselves on completing projects within stipulated timelines and budgets.' },
  { icon: Shield, title: 'Regulatory Compliance', description: 'Full compliance with NUPRC, NESREA, DPR, and all relevant regulatory standards.' },
];

const checklist = [
  'ISO-certified quality management systems',
  'End-to-end project lifecycle oversight',
  'Real-time progress reporting & dashboards',
  'Risk mitigation & contingency planning',
  'Environmental impact assessments',
  'Financial audit & fraud prevention',
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80" 
                alt="IPMC Construction Excellence"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
            >
              <div className="stat-figure text-3xl text-primary-600">150+</div>
              <div className="text-sm text-gray-500">Projects Completed</div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Why We Are The Best</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-3 mb-6">
              Delivering Excellence Across Every Sector
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              For over three decades, IPMC has been at the forefront of project monitoring and management 
              in Nigeria. Our multidisciplinary team combines technical expertise with deep industry knowledge 
              to deliver solutions that exceed expectations.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {reasons.map((reason, i) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <reason.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{reason.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {checklist.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
