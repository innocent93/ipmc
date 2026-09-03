import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Layout/Navbar';
import Breadcrumbs from './components/UI/Breadcrumbs';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import ErrorBoundary from './components/UI/ErrorBoundary';
import PageLoader from './components/UI/PageLoader';
import Home from './pages/Home';
import './styles/globals.css';

// Route-level code splitting: only the homepage (the most-requested route)
// ships in the initial bundle. Every other page is fetched on demand,
// which keeps first-load JS small and scales cleanly as more pages are added.
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));
const ESG = lazy(() => import('./pages/ESG'));
const EsgQuestionnaire = lazy(() => import('./pages/EsgQuestionnaire'));
const EsgAdvisory = lazy(() => import('./pages/EsgAdvisory'));
const ProposalRequest = lazy(() => import('./pages/ProposalRequest'));
const Careers = lazy(() => import('./pages/Careers'));
const Events = lazy(() => import('./pages/Events'));
const SearchPage = lazy(() => import('./pages/Search'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          {/* Skip link: first focusable element, only visible on keyboard focus */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <Navbar />
            <Breadcrumbs />
            <main id="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/esg" element={<ESG />} />
                  <Route path="/esg/questionnaire" element={<EsgQuestionnaire />} />
                  <Route path="/esg/advisory" element={<EsgAdvisory />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/proposal" element={<ProposalRequest />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
