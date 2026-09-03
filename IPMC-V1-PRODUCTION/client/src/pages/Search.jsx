import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowRight, Loader2, FileText, Users, Briefcase, Calendar } from 'lucide-react';
import { api } from '../utils/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ services: [], posts: [], team: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    // Simulate search across all content
    // In production, this would call a dedicated search API endpoint
    try {
      const [servicesRes, postsRes, teamRes] = await Promise.all([
        api.getServices(),
        api.getPosts(),
        api.getTeam(),
      ]);

      const term = searchTerm.toLowerCase();
      setResults({
        services: (servicesRes.data || []).filter(s => 
          s.title?.toLowerCase().includes(term) || 
          s.shortDescription?.toLowerCase().includes(term)
        ),
        posts: (postsRes.data || []).filter(p => 
          p.title?.toLowerCase().includes(term) || 
          p.excerpt?.toLowerCase().includes(term)
        ),
        team: (teamRes.data || []).filter(t => 
          t.name?.toLowerCase().includes(term) || 
          t.role?.toLowerCase().includes(term)
        ),
      });
    } catch (error) {
      setResults({ services: [], posts: [], team: [] });
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch(query);
  };

  const totalResults = results.services.length + results.posts.length + results.team.length;

  const tabs = [
    { id: 'all', label: 'All Results', count: totalResults },
    { id: 'services', label: 'Services', count: results.services.length, icon: Briefcase },
    { id: 'posts', label: 'Insights', count: results.posts.length, icon: FileText },
    { id: 'team', label: 'Team', count: results.team.length, icon: Users },
  ];

  const getFilteredResults = () => {
    if (activeTab === 'all') return [
      ...results.services.map(r => ({ ...r, type: 'service' })),
      ...results.posts.map(r => ({ ...r, type: 'post' })),
      ...results.team.map(r => ({ ...r, type: 'team' })),
    ];
    if (activeTab === 'services') return results.services.map(r => ({ ...r, type: 'service' }));
    if (activeTab === 'posts') return results.posts.map(r => ({ ...r, type: 'post' }));
    if (activeTab === 'team') return results.team.map(r => ({ ...r, type: 'team' }));
    return [];
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        {/* Search Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-6 text-center">
            Search Results
          </h1>
          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, insights, team..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg bg-white"
            />
          </form>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary-600" />
          </div>
        ) : query && (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
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

            {/* Results */}
            <div className="space-y-4 max-w-4xl mx-auto">
              {getFilteredResults().length > 0 ? getFilteredResults().map((result, i) => (
                <motion.div
                  key={`${result.type}-${result._id || result.id || i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {result.type === 'service' && (
                    <Link to={`/services/${result.slug}`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-start justify-between">
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
                      <div className="flex items-start justify-between">
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
                    <div className="block bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        <img src={result.image} alt={result.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Team Member</span>
                          <h3 className="font-display text-lg font-bold text-primary-900">{result.name}</h3>
                          <p className="text-gray-600 text-sm">{result.role}</p>
                        </div>
                      </div>
                    </div>
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
        )}
      </div>
    </div>
  );
}
