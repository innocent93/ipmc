import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('newsletter_dismissed');
      const subscribed = localStorage.getItem('newsletter_subscribed');
      if (!dismissed && !subscribed) {
        setIsVisible(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('newsletter_dismissed', 'true');
    setIsVisible(false);
  };

  // Focus trap: move focus into the dialog when it opens, keep Tab cycling
  // within it, and let Escape close it \u2014 without this, keyboard/screen
  // reader users can silently tab into page content hidden behind the
  // overlay.
  useEffect(() => {
    if (!isVisible) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dismiss();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await api.subscribe(email);
      setIsSubmitted(true);
      localStorage.setItem('newsletter_subscribed', 'true');
      setTimeout(() => setIsVisible(false), 3000);
    } catch (error) {
      toast.error('Already subscribed or invalid email.');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
          >
            <div className="relative h-32 bg-primary-950 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80')] bg-cover bg-center opacity-20" />
              <button ref={closeButtonRef} onClick={dismiss} aria-label="Close newsletter signup" className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-6">
                <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center">
                  <Mail size={24} className="text-primary-900" />
                </div>
              </div>
            </div>

            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center py-4" role="status">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 id="newsletter-popup-title" className="font-display text-xl font-bold text-emerald-800 mb-2">You're Subscribed!</h3>
                  <p className="text-emerald-600">Thank you for joining our newsletter.</p>
                </div>
              ) : (
                <>
                  <h3 id="newsletter-popup-title" className="font-display text-xl font-bold text-primary-900 mb-2">
                    Stay Updated with IPMC Insights
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Get the latest industry news, ESG reports, and project management insights delivered to your inbox.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                    </button>
                  </form>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    No spam, unsubscribe anytime. Read our <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
