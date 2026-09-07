import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowRight, Loader2, FileText, Users, Briefcase, Leaf, Building2 } from 'lucide-react';
import { api } from '../utils/api';

const EMPTY_RESULTS = { services: [], blogs: [], esg: [], jobs: [], team: [], total: 0 };

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');

  const performSearch = async (searchTerm) => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setResults(EMPTY_RESULTS);
      setHasSearched(false);
      setError('Enter at least 2 characters to search.');
      return;
    }

    setError('');
    setLoading(true);
    setHasSearched(true);

    try {
      const data = await api.search(term, 20);
      setResults({
        services: Array.isArray(data?.services) ? data.services : [],
        blogs: Array.isArray(data?.blogs) ? data.blogs : [],
        esg: Array.isArray(data?.esg) ? data.esg : [],
        jobs: Array.isArray(data?.jobs) ? data.jobs : [],
        team: Array.isArray(data?.team) ? data.team : [],
        total: Number(data?.total) || 0,
      });
    } catch (err) {
      setError(err.message || 'Search is temporarily unavailable. Please try again.');
      setResults(EMPTY_RESULTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setResults(EMPTY_RESULTS);
      setHasSearched(false);
      setError('');
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (term.length < 2) {
      setError('Enter at least 2 characters to search.');
      return;
    }
    setSearchParams({ q: term });
  };

  const tabs = [
    { id: 'all', label: 'All Results', count: results.total || (results.services.length + results.blogs.length + results.esg.length + results.jobs.length + results.team.length) },
    { id: 'services', label: 'Services', count: results.services.length, icon: Briefcase },
    { id: 'blogs', label: 'Insights', count: results.blogs.length, icon: FileText },
    { id: 'team', label: 'Team', count: results.team.length, icon: Users },
    { id: 'esg', label: 'ESG', count: results.esg.length, icon: Leaf },
    { id: 'jobs', label: 'Careers', count: results.jobs.length, icon: Building2 },
  ];

  const filteredResults = useMemo(() => {
    const groups = [
      ...results.services.map((r) => ({ ...r, type: 'service' })),
      ...results.blogs.map((r) => ({ ...r, type: 'post' })),
      ...results.team.map((r) => ({ ...r, type: 'team' })),
      ...results.esg.map((r) => ({ ...r, type: 'esg' })),
      ...results.jobs.map((r) => ({ ...r, type: 'job' })),
    ];

    if (activeTab === 'all') return groups;
    const typeMap = { services: 'service', blogs: 'post', team: 'team', esg: 'esg', jobs: 'job' };
    return groups.filter((result) => result.type === typeMap[activeTab]);
  }, [activeTab, results]);

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6 text-center">
            Search Results
          </h1>
          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, insights, team, ESG, careers..."
              className="w-full pl-12 pr-28 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg bg-white"
              aria-label="Search"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
          {error && <p role="alert" className="text-red-600 text-sm mt-3 text-center">{error}</p>}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary-600" />
          </div>
        ) : hasSearched && !error ? (
          <>
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.icon && <tab.icon size={16} />}
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredResults.length > 0 ? filteredResults.map((result, i) => (
                <motion.div
                  key={`${result.type}-${result._id || result.slug || i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {result.type === 'service' && (
                    <Link to={`/services/${result.slug}`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Service</span>
                          <h3 className="font-display text-lg font-bold text-primary-900 mt-1">{result.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{result.shortDescription}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 shrink-0" />
                      </div>
                    </Link>
                  )}

                  {result.type === 'post' && (
                    <Link to={`/blog/${result.slug}`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Insight</span>
                          <h3 className="font-display text-lg font-bold text-primary-900 mt-1">{result.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{result.excerpt}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 shrink-0" />
                      </div>
                    </Link>
                  )}

                  {result.type === 'team' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        {result.image && <img src={result.image} alt={result.name} className="w-12 h-12 rounded-full object-cover" />}
                        <div>
                          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Team Member</span>
                          <h3 className="font-display text-lg font-bold text-primary-900">{result.name}</h3>
                          <p className="text-gray-600 text-sm">{result.role}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.type === 'esg' && (
                    <Link to={`/esg`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">ESG</span>
                          <h3 className="font-display text-lg font-bold text-primary-900 mt-1">{result.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{result.description}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 shrink-0" />
                      </div>
                    </Link>
                  )}

                  {result.type === 'job' && (
                    <Link to="/careers" className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Career</span>
                          <h3 className="font-display text-lg font-bold text-primary-900 mt-1">{result.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{result.department} · {result.location}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 shrink-0" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              )) : (
                <div className="text-center py-16">
                  <SearchIcon size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">Try a different search term or browse our services.</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
