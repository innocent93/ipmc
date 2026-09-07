import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUp, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getServiceBySlug } from '../../data/services';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Proposal Request', path: '/proposal' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Blog', path: '/blog' },
];

// Matches the real site's "Other Links" footer group exactly — resolved
// against data/services.js so a renamed/removed service can never leave a
// dangling footer link.
const otherLinkSlugs = ['financial-advisory', 'esg-ratings', 'environmental-service'];
const otherLinks = [
  ...otherLinkSlugs.map((slug) => {
    const svc = getServiceBySlug(slug);
    return { name: svc.title, path: `/services/${svc.slug}` };
  }),
  { name: 'ESG Questionnaire', path: '/esg/questionnaire' },
  { name: 'ESG Advisory Service', path: '/esg/advisory' },
  { name: 'Compare Services', path: '/compare' },
  { name: 'Newsletter Archive', path: '/newsletter' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.subscribe(email.trim(), 'footer');
      setSubscribed(true);
      setEmail('');
      toast.success('You are subscribed to IPMC Insights.');
    } catch (err) {
      toast.error(err.message || 'Could not subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-950 text-white">
      <div className="tick-rule tick-rule--dark" aria-hidden="true" />
      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="font-display font-bold text-3xl text-white">
                IPMC<span className="text-accent-500">∞</span>
              </div>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6">
              A multi-disciplinary professional services company specializing in management 
              and consultancy services across project monitoring, QHSE, ESG, SDGs, and financial audits.
            </p>
            <div className="flex gap-3">
              {[
                ['Facebook', '#'], ['X', '#'], ['Instagram', '#'], ['LinkedIn', '#'], ['YouTube', '#']
              ].map(([social, href]) => (
                <a 
                  key={social}
                  href={href} 
                  className="w-10 h-10 rounded-lg bg-primary-900 hover:bg-primary-600 flex items-center justify-center transition-colors duration-300 text-xs font-bold uppercase"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-accent-400">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-primary-300 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-700 group-hover:bg-accent-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links — mirrors the real site's footer "Other Links" group */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-accent-400">Other Links</h3>
            <ul className="space-y-3">
              {otherLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-primary-300 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-700 group-hover:bg-accent-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-display font-semibold text-lg mb-4 text-accent-400">Stay Informed</h3>
            <p className="text-primary-300 text-sm leading-relaxed mb-5">
              Subscribe to IPMC Insights for practical updates on project monitoring, ESG, sustainability and industry developments.
            </p>
            {subscribed ? (
              <div className="rounded-xl bg-primary-900 border border-primary-800 p-4 flex gap-3 items-start">
                <CheckCircle2 size={20} className="text-accent-400 shrink-0 mt-0.5" />
                <div><p className="text-white font-semibold text-sm">You're subscribed</p><p className="text-primary-300 text-xs mt-1">Check your inbox for a welcome email.</p></div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                <input id="footer-newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-primary-700 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-400" />
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent-500 hover:bg-accent-400 text-primary-950 font-semibold transition-colors disabled:opacity-60">
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : 'Subscribe to IPMC Insights'}
                </button>
                <p className="text-primary-500 text-[11px] leading-relaxed">By subscribing, you agree to receive IPMC email updates. You can unsubscribe anytime.</p>
              </form>
            )}
          </div>

          {/* Contact Info - REAL ADDRESSES FROM SITE */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-accent-400">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-400 shrink-0 mt-0.5" />
                <div className="text-primary-300 text-sm space-y-1">
                  <p><strong className="text-white">Head Office:</strong><br/>18B Olu Holloway Road,<br/>Ikoyi-Lagos, Nigeria</p>
                  <p><strong className="text-white">Abuja:</strong><br/>32 Lusaka Crescent,<br/>Wuse Zone 6, Abuja</p>
                  <p><strong className="text-white">Lagos:</strong><br/>207 Igbosere Road,<br/>Lagos Island, Nigeria</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent-400 shrink-0" />
                <a href="tel:+2347040269249" className="text-primary-300 hover:text-white transition-colors text-sm">
                  +234 704 026 9249
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent-400 shrink-0" />
                <a href="mailto:enquiries@ipmc-ng.com" className="text-primary-300 hover:text-white transition-colors text-sm">
                  enquiries@ipmc-ng.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-accent-400 shrink-0" />
                <span className="text-primary-300 text-sm">Mon - Fri: 8:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-900">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-400 text-sm">
            © {new Date().getFullYear()} IPMC Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            {/* The admin dashboard is a separately deployed app (see
                admin/), not a route within this SPA — a router Link here
                would 404. VITE_ADMIN_URL is set per-deployment. */}
            <a href={import.meta.env.VITE_ADMIN_URL || '/admin'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Admin</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-accent-500 hover:bg-accent-600 text-primary-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
}
