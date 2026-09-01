import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

const sampleJobs = [
  {
    id: 1, title: 'Senior Project Monitor', department: 'Project Management', location: 'Lagos', type: 'full-time',
    description: 'Lead project monitoring activities for oil and gas infrastructure projects.',
    requirements: ['B.Sc in Engineering', '10+ years experience', 'PMP Certification'], 
    responsibilities: ['Monitor project progress', 'Prepare reports', 'Stakeholder management'],
    experienceLevel: 'Senior', postedAt: '2024-01-15'
  },
  {
    id: 2, title: 'ESG Consultant', department: 'ESG', location: 'Abuja', type: 'full-time',
    description: 'Provide ESG assessment and consulting services to clients across sectors.',
    requirements: ['B.Sc in Environmental Science', '5+ years experience', 'GRI Certification'],
    responsibilities: ['ESG assessments', 'Report preparation', 'Client presentations'],
    experienceLevel: 'Mid-level', postedAt: '2024-01-10'
  },
  {
    id: 3, title: 'Financial Auditor', department: 'Finance', location: 'Lagos', type: 'full-time',
    description: 'Conduct financial audits and advisory services for energy sector clients.',
    requirements: ['ACA/ACCA', '7+ years experience', 'Oil & Gas sector knowledge'],
    responsibilities: ['Financial audits', 'Compliance checks', 'Risk assessment'],
    experienceLevel: 'Senior', postedAt: '2024-01-08'
  },
  {
    id: 4, title: 'QHSE Officer', department: 'QHSE', location: 'Port Harcourt', type: 'contract',
    description: 'Ensure quality, health, safety, and environmental compliance on project sites.',
    requirements: ['NEBOSH Certificate', '3+ years experience', 'Site safety knowledge'],
    responsibilities: ['Site inspections', 'Safety training', 'Incident investigation'],
    experienceLevel: 'Mid-level', postedAt: '2024-01-05'
  },
  {
    id: 5, title: 'Research Analyst', department: 'Research', location: 'Lagos', type: 'full-time',
    description: 'Conduct industry research and analysis to support consulting projects.',
    requirements: ['B.Sc in Economics/Statistics', '2+ years experience', 'Data analysis skills'],
    responsibilities: ['Market research', 'Data analysis', 'Report writing'],
    experienceLevel: 'Entry-level', postedAt: '2024-01-03'
  },
];

const departments = ['All', 'Project Management', 'ESG', 'Finance', 'QHSE', 'Research', 'Engineering'];
const locations = ['All', 'Lagos', 'Abuja', 'Port Harcourt'];
const types = ['All', 'full-time', 'part-time', 'contract', 'internship'];

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [expandedJob, setExpandedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = sampleJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesDept && matchesLocation && matchesType;
  });

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-primary-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-5f2f3d0e8f6b?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Join Our Team</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Build Your Career With IPMC
            </h1>
            <p className="text-primary-200 text-lg">
              We're always looking for talented professionals who share our passion for excellence 
              and sustainable development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Briefcase, title: 'Professional Growth', desc: 'Continuous learning and career development opportunities.' },
              { icon: Users, title: 'Collaborative Culture', desc: 'Work with diverse experts across multiple disciplines.' },
              { icon: MapPin, title: 'Multiple Locations', desc: 'Offices in Lagos, Abuja, and project sites nationwide.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium"
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {(showFilters || window.innerWidth >= 768) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 outline-none">
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 outline-none">
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                      <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 outline-none">
                        {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6 text-gray-600">
            Showing <span className="font-semibold text-primary-900">{filteredJobs.length}</span> open position{filteredJobs.length !== 1 ? 's' : ''}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-primary-900 mb-1">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">{job.experienceLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{job.postedAt}</span>
                    {expandedJob === job.id ? <ChevronUp size={20} className="text-primary-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                        <p className="text-gray-600 mb-6">{job.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-3">Requirements</h4>
                            <ul className="space-y-2">
                              {job.requirements.map((req, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-3">Responsibilities</h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0" />
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <a href="mailto:careers@ipmc-ng.com" className="btn-primary inline-flex justify-center">
                            Apply Now
                          </a>
                          <button onClick={() => setExpandedJob(null)} className="btn-outline inline-flex justify-center">
                            Close
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
