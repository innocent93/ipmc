import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Lightbulb, Heart, Zap } from 'lucide-react';

const values = [
  { icon: Target, title: 'Precision', description: 'Meticulous attention to detail in every project we undertake.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Cutting-edge solutions that push industry boundaries forward.' },
  { icon: Heart, title: 'Integrity', description: 'Unwavering commitment to ethical practices and transparency.' },
  { icon: Zap, title: 'Impact', description: 'Delivering measurable results that transform businesses.' },
];

export default function AboutSection() {
  return (
    <section className="section-padding bg-primary-950 text-white overflow-hidden">
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
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" 
                alt="IPMC Construction Project"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div 
              className="absolute -bottom-8 -right-8 bg-accent-500 text-primary-900 p-6 rounded-2xl shadow-2xl max-w-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="stat-figure text-4xl mb-1">35+</div>
              <div className="text-sm font-semibold">Years of Industry Excellence</div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent-500/30 rounded-2xl" />
            <div className="absolute -bottom-4 left-1/4 w-16 h-16 bg-primary-600/20 rounded-full blur-xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">About Our Company</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-6 leading-tight">
              Pioneering Excellence in Project Management
            </h2>
            <p className="text-primary-200 text-lg leading-relaxed mb-6">
              IPMC Limited is a leading Nigerian professional services company providing management 
              and consultancy services in the oil and gas industry. As a beneficiary of Project 100, 
              an initiative by NNPC and NCDMB supporting 100 indigenous companies, we bring world-class 
              expertise to every engagement.
            </p>
            <p className="text-primary-300 leading-relaxed mb-8">
              With a team of over 70 engineers, we offer bespoke solutions for a variety of projects, 
              including refineries, cement plants, and large-scale infrastructure developments across 
              Nigeria and West Africa.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <value.icon size={20} className="text-accent-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">{value.title}</div>
                    <div className="text-xs text-primary-300 mt-1">{value.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link 
              to="/about"
              className="inline-flex items-center gap-2 text-accent-400 font-semibold hover:text-accent-300 transition-colors group"
            >
              Learn More About Us
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
