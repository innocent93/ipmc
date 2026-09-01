import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, FileCheck, TrendingUp, Users2, ArrowRight } from 'lucide-react';

const offerings = [
  { icon: Compass, title: 'ESG Strategy Design', description: 'Building an ESG strategy grounded in your actual operations and stakeholder priorities, not a generic template.' },
  { icon: FileCheck, title: 'Disclosure & Reporting', description: 'Preparing sustainability disclosures aligned with recognized international reporting frameworks.' },
  { icon: TrendingUp, title: 'Performance Improvement', description: 'Turning assessment findings into a prioritized roadmap of practical, fundable improvements.' },
  { icon: Users2, title: 'Stakeholder Engagement', description: 'Structuring investor, regulator and community engagement around your ESG commitments.' },
];

export default function EsgAdvisory() {
  return (
    <div className="pt-24">
      <section className="relative py-20 bg-emerald-950">
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">Research &amp; Insights</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">ESG Advisory Service</h1>
            <p className="text-emerald-200 text-lg">
              End-to-end advisory support — from initial ESG strategy through to disclosure and stakeholder
              engagement — for organizations building a credible sustainability program.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {offerings.map((o, i) => (
              <motion.div key={o.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center mb-6">
                  <o.icon size={28} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-3">{o.title}</h3>
                <p className="text-emerald-700 leading-relaxed">{o.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary-950 rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Not sure where to start?</h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">
              Take our ESG self-assessment first — it takes about 3 minutes and gives our advisory team a
              baseline to work from.
            </p>
            <Link to="/esg/questionnaire" className="btn-primary inline-flex items-center gap-2">
              Take the Questionnaire <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
