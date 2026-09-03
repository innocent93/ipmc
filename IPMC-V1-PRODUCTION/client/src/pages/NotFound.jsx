import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="text-9xl font-display font-bold text-accent-500 mb-4">404</div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-primary-300 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
            <Search size={18} />
            Explore Services
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-800">
          <p className="text-primary-400 text-sm">
            Need help? <Link to="/contact" className="text-accent-400 hover:underline">Contact our team</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
