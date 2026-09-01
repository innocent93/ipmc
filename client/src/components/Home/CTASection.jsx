import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')] bg-cover bg-center opacity-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-sm font-semibold rounded-full mb-6 border border-accent-500/30">
              Start Your Project Today
            </span>

            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your <br />
              <span className="text-accent-400">Project Outcomes?</span>
            </h2>

            <p className="text-primary-200 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Partner with Nigeria's leading independent project monitoring company. 
              Let's discuss how we can add value to your next project.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/25 active:scale-95"
              >
                Schedule a Consultation
                <ArrowRight size={18} />
              </Link>
              <a 
                href="tel:+2347040269249"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                <Phone size={18} />
                Call Us Now
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center text-primary-300 text-sm">
              <a href="tel:+2347040269249" className="flex items-center gap-2 hover:text-accent-400 transition-colors">
                <Phone size={16} />
                +234 704 026 9249
              </a>
              <a href="mailto:enquiries@ipmc-ng.com" className="flex items-center gap-2 hover:text-accent-400 transition-colors">
                <Mail size={16} />
                enquiries@ipmc-ng.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
