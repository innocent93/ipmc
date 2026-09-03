import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ipmc_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('ipmc_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem('ipmc_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="container-custom py-4 md:py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Cookie size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1">We value your privacy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    <a href="/privacy" className="text-primary-600 hover:underline ml-1">Learn more</a>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={decline} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Decline
                </button>
                <button onClick={accept} className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                  Accept All
                </button>
                <button onClick={decline} className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
