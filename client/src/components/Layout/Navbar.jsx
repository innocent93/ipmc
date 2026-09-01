import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, Phone, Mail, MapPin } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES } from '../../data/services';

// Mirrors the capability categories on ipmc-ng.com (Engineering, Advisory,
// Data Management, Manpower, QHSE, ESG, Asset Integrity) so the refactor's
// information architecture matches the live site — every category and
// every service below corresponds to a real page in the source nav, built
// from data/services.js so this list and the actual service pages can
// never drift out of sync.
const capabilityGroups = SERVICE_CATEGORIES.map((cat) => ({
  category: cat.name,
  items: SERVICES.filter((s) => s.category === cat.id).map((s) => ({ name: s.title, path: `/services/${s.slug}` })),
}));

const navLinks = [
  {
    name: 'Who We Are',
    dropdown: [
      { name: 'About IPMC', path: '/about' },
      { name: 'Proposal Request', path: '/proposal' },
      { name: 'Contact Us', path: '/contact' },
    ]
  },
  {
    name: 'Capabilities',
    groups: capabilityGroups,
    viewAllPath: '/services',
  },
  {
    name: 'Research & Insights',
    dropdown: [
      { name: 'ESG', path: '/esg' },
      { name: 'ESG Questionnaire', path: '/esg/questionnaire' },
      { name: 'ESG Advisory Service', path: '/esg/advisory' },
      { name: 'Blog', path: '/blog' },
    ]
  },
  { name: 'Careers', path: '/careers' },
  { name: 'Events', path: '/events' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMobile, setExpandedMobile] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setExpandedMobile({});
  }, [location]);

  // Lock background scroll while the full-screen mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleMobileExpand = (name) => {
    setExpandedMobile(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Top Info Bar - Desktop */}
      <div className={`hidden lg:block bg-primary-950 text-white transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="container-custom flex justify-between items-center py-2 text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-primary-300">
              <MapPin size={12} />
              18B Olu Holloway Road, Ikoyi-Lagos
            </span>
            <a href="tel:+2347040269249" className="flex items-center gap-2 hover:text-accent-400 transition-colors">
              <Phone size={12} />
              +234 704 026 9249
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-400">35 Years of Excellence</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' 
            : 'bg-transparent py-4 lg:py-5'
        }`}
        style={{ top: isScrolled ? 0 : undefined }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group z-50">
              <div className={`flex items-center font-display font-bold text-2xl md:text-3xl transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-primary-900' : 'text-white'
              }`}>
                IPMC<span className="text-accent-500">∞</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => (link.dropdown || link.groups) && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.path ? (
                    <Link
                      to={link.path}
                      aria-current={location.pathname === link.path ? 'page' : undefined}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        location.pathname === link.path
                          ? isScrolled ? 'text-primary-600 bg-primary-50' : 'text-accent-400 bg-white/10'
                          : isScrolled ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === link.name}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1 ${
                        isScrolled ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {/* Mega-menu: used for Capabilities (7 categories, 24
                      services) — a plain dropdown couldn't fit this
                      without either truncating the real capability list
                      or breaking the 404-free nav requirement. */}
                  <AnimatePresence>
                    {link.groups && activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[860px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100 p-6 grid grid-cols-4 gap-x-6 gap-y-5"
                      >
                        {link.groups.map((group) => (
                          <div key={group.category}>
                            <div className="text-[11px] font-mono uppercase tracking-wider text-accent-600 mb-2">{group.category}</div>
                            <ul className="space-y-1.5">
                              {group.items.map((item) => (
                                <li key={item.path}>
                                  <Link to={item.path} className="text-sm text-gray-700 hover:text-primary-600 transition-colors leading-snug block">
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="col-span-4 pt-3 border-t border-gray-100">
                          <Link to={link.viewAllPath} className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                            View All Capabilities →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors border-b border-gray-50 last:border-0"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`hidden md:flex w-10 h-10 items-center justify-center rounded-lg transition-colors ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                <Search size={20} />
              </button>

              {/* CTA */}
              <Link 
                to="/contact"
                className={`hidden lg:inline-flex px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20' 
                    : 'bg-white text-primary-600 hover:bg-accent-400 hover:text-primary-900'
                }`}
              >
                Get a Quote
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors z-50 ${
                  isMobileMenuOpen ? 'text-primary-900' : (isScrolled ? 'text-primary-900 hover:bg-gray-100' : 'text-white hover:bg-white/10')
                }`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-6"
            >
              <div className="container-custom">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services, insights, team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu - Full Screen Slide */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="h-full flex flex-col pt-20 pb-8 px-6 overflow-y-auto">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-primary-50 text-primary-900 placeholder-primary-400 outline-none"
                />
              </form>

              {/* Mobile Nav Links */}
              <nav className="flex-1 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-gray-100">
                    {link.path && !link.dropdown && !link.groups ? (
                      <Link
                        to={link.path}
                        className="block py-4 text-lg font-medium text-primary-900 hover:text-primary-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleMobileExpand(link.name)}
                          className="w-full flex items-center justify-between py-4 text-lg font-medium text-primary-900"
                        >
                          {link.name}
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            expandedMobile[link.name] ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600'
                          }`}>
                            {expandedMobile[link.name] ? <X size={16} /> : <ChevronDown size={16} className="rotate-[-90deg]" />}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expandedMobile[link.name] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4 pl-4 space-y-4 max-h-[50vh] overflow-y-auto">
                                {link.groups ? (
                                  link.groups.map((group) => (
                                    <div key={group.category}>
                                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-600 mb-1.5">{group.category}</div>
                                      <div className="space-y-1.5">
                                        {group.items.map((item) => (
                                          <Link key={item.path} to={item.path} className="block py-1 text-sm text-primary-700 hover:text-primary-600 transition-colors">
                                            {item.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  link.dropdown.map((item) => (
                                    <Link
                                      key={item.name}
                                      to={item.path}
                                      className="block py-2 text-primary-700 hover:text-primary-600 transition-colors"
                                    >
                                      {item.name}
                                    </Link>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
                <a href="mailto:enquiries@ipmc-ng.com" className="flex items-center gap-3 text-primary-700">
                  <Mail size={18} className="text-primary-600" />
                  enquiries@ipmc-ng.com
                </a>
                <a href="tel:+2347040269249" className="flex items-center gap-3 text-primary-700">
                  <Phone size={18} className="text-primary-600" />
                  +234 704 026 9249
                </a>
                <div className="flex gap-4 pt-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                    <a key={social} href="#" className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors">
                      <span className="text-xs font-bold uppercase">{social[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
