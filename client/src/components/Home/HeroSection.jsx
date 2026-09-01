import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../utils/api';
import LoadingSpinner from '../UI/LoadingSpinner';

// Mirrors the three rotating hero messages on ipmc-ng.com's homepage
// (Financial Advisory / ESG Launch / Environmental Services).
const DEFAULT_SLIDES = [
  {
    title: 'Financial Advisory',
    subtitle: 'Leading the Future of Project Management in Nigeria',
    description: 'IPMC is the go-to source for top-notch financial advisory services, backed by 35 years of excellence in project monitoring across the oil & gas sector.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
    cta: { text: 'Explore Our Services', link: '/services' },
    secondaryCta: { text: 'Watch Our Story', link: '#' },
  },
  {
    title: 'IPMC ESG Launch',
    subtitle: 'Pioneering Environmental Excellence',
    description: 'See the full report and insights from our ESG launch event, and discover the ratings, rankings and consulting services behind it.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80',
    cta: { text: 'Discover ESG Services', link: '/esg' },
    secondaryCta: { text: 'Read Our Reports', link: '/blog' },
  },
  {
    title: 'Environmental Services',
    subtitle: 'Trusted Partners in Sustainable Growth',
    description: 'Research and evaluation delivered by our environmental specialists \u2014 the people behind our technology make all the difference.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80',
    cta: { text: 'Our Environmental Services', link: '/services' },
    secondaryCta: { text: 'Contact Us', link: '/contact' },
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch featured services/posts for dynamic slides
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, postsRes] = await Promise.all([
          api.getServices('?limit=3'),
          api.getPosts('?featured=true&limit=1'),
        ]);

        // If we have real data, we could construct dynamic slides
        // For now, keep defaults but mark as loaded
        setLoading(false);
      } catch (err) {
        console.log('Using default hero slides');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  if (loading) {
    return (
      <section className="relative h-[90vh] min-h-[600px] bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </section>
    );
  }

  return (
    <section 
      className="relative h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Brand-gradient fallback, revealed if the hotlinked image fails to load */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchpriority={currentSlide === 0 ? 'high' : 'auto'}
            width={1920}
            height={1080}
            onError={(e) => {
              // Hero images are hotlinked from an external host today; if that
              // host is ever unreachable, fall back to the brand gradient
              // above instead of showing a broken image icon.
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full container-custom flex items-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6 border border-amber-500/30">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                {slide.title}
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to={slide.cta.link}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-900 rounded-xl font-semibold hover:bg-amber-400 transition-all hover:gap-3"
                >
                  {slide.cta.text} <ArrowRight size={20} />
                </Link>
                {slide.secondaryCta.link !== '#' && (
                  <Link 
                    to={slide.secondaryCta.link}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20"
                  >
                    <Play size={18} fill="currentColor" /> {slide.secondaryCta.text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 right-4 z-20 flex justify-between pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-10 bg-accent-500' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Tick-Rule: the site's signature measurement-instrument divider,
          marking the hero/content boundary */}
      <div className="tick-rule tick-rule--dark absolute bottom-0 left-0 right-0 z-20" aria-hidden="true" />

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
