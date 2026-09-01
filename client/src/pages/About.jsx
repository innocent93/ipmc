import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Award, Users, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const milestones = [
  { year: '1989', title: 'Company Founded', description: 'IPMC established as a professional services firm in Lagos, Nigeria' },
  { year: '2005', title: 'Sector Expansion', description: 'Expanded core services to oil, gas, and energy infrastructure sectors' },
  { year: '2015', title: 'Project 100', description: 'Selected as beneficiary of NNPC/NCDMB Project 100 initiative' },
  { year: '2020', title: 'ESG Division', description: 'Launched dedicated ESG and sustainability consulting practice' },
  { year: '2024', title: 'Digital Transformation', description: 'Modernized operations with cutting-edge project monitoring technology' },
];

const values = [
  { icon: Target, title: 'Mission', description: 'To deliver world-class project monitoring and consultancy services that drive sustainable development and organizational growth across Africa.' },
  { icon: Eye, title: 'Vision', description: 'To be the most trusted independent project monitoring company in Africa, setting industry benchmarks for excellence, integrity, and innovation.' },
  { icon: Heart, title: 'Values', description: 'Integrity, Excellence, Innovation, and Client-Centricity guide every decision, partnership, and project we undertake.' },
];

const capabilities = [
  'Project Monitoring & Management',
  'Quality, Health, Environment & Safety (QHSE)',
  'ESG Assessments & Ratings',
  'Sustainable Development Goals (SDGs)',
  'Manpower Services & Staffing',
  'Financial Audits & Advisory',
];

export default function About() {
  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Simply Know About</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
              We Help Organizations To Make Ultimate Businesses Growth Success
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed">
              IPMC Limited is a multi-disciplinary professional services company specializing in 
              the provision of management and consultancy services across Nigeria and West Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Multi-Disciplinary Professional Services
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our comprehensive range of services includes Project Monitoring, Quality, Health, 
                  Environment, and Safety (QHSE) services, ESG services, Sustainable Development Goals 
                  (SDGs), Manpower Services, and Financial Audits. We empower organizations across 
                  various sectors to achieve their objectives efficiently and responsibly.
                </p>
                <p>
                  We specialize in project monitoring across diverse sectors. Our experienced team 
                  ensures that projects stay on track, meet milestones, and deliver results. From 
                  inception to completion to usage, we provide comprehensive monitoring services, 
                  enabling successful project execution.
                </p>
                <p>
                  At IPMC, we offer tailored ESG solutions. Our services include ESG assessments, 
                  and ratings consulting services. We monitor ESG performances across various metrics, 
                  thereby enhancing environmental, social, and governance performances across sectors.
                </p>
              </div>

              {/* Capabilities List */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary-50"
                  >
                    <CheckCircle size={18} className="text-primary-600 shrink-0" />
                    <span className="text-sm font-medium text-primary-900">{cap}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Image & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" 
                  alt="IPMC Project"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-accent-500 text-primary-900 p-6 rounded-2xl shadow-2xl max-w-xs"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="stat-figure text-4xl mb-1">35+</div>
                <div className="text-sm font-semibold">Years of Industry Excellence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SDG & Financial Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" 
                alt="Financial Advisory"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Aligned with Global Sustainability Goals
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Aligned with global initiatives, we actively contribute to achieving the United 
                  Nations' SDGs. Our consultants collaborate with clients to incorporate SDGs into 
                  their business models through baseline assessment, monitoring, and evaluation of 
                  their compliance with the goals, and other local and international connected frameworks.
                </p>
                <p>
                  Our financial audit services provide organizations with confidence in their financial 
                  statements. We conduct thorough assessments, ensuring compliance with accounting 
                  standards and regulatory requirements. We also provide certified and qualified experts 
                  to deliver on projects or services for clients.
                </p>
                <p>
                  Our diverse team comprises experts in project management, research, engineering, 
                  sustainability, finance, and technology. To deliver on our mission, we stay updated 
                  and certified, while collaborating with relevant stakeholders.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/services" className="btn-primary">
                  Explore Capabilities
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm tracking-wider uppercase">Our Foundation</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mt-3">What Drives Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors border border-gray-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6">
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-primary-950">
        <div className="container-custom">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Our Journey</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">Timeline of Excellence</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 md:gap-8 mb-10 last:mb-0"
              >
                <div className="w-20 md:w-24 shrink-0 text-right">
                  <span className="stat-figure text-2xl md:text-3xl text-accent-400">{milestone.year}</span>
                </div>
                <div className="relative pl-6 md:pl-8 border-l-2 border-primary-800">
                  <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-accent-500 border-4 border-primary-950" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-primary-300">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award size={48} className="text-accent-500 mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Recognized for Excellence
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              IPMC has been recognized for its excellence in consulting services. Our commitment 
              to quality and client satisfaction sets us apart. At IPMC, we believe in making a 
              difference—one project, one goal at a time.
            </p>
            <Link to="/contact" className="btn-primary mt-8 inline-flex">
              Get In Touch
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
