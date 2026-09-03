import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Users } from 'lucide-react';

const events = [
  {
    id: 1, title: 'ESG Summit Nigeria 2024', date: '2024-03-15', time: '09:00 AM - 04:00 PM',
    location: 'Lagos, Nigeria', type: 'Conference', category: 'esg',
    description: 'Join industry leaders for a comprehensive discussion on ESG practices and sustainable business in Africa.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    attendees: 250, status: 'upcoming'
  },
  {
    id: 2, title: 'Project Management Workshop', date: '2024-02-28', time: '10:00 AM - 02:00 PM',
    location: 'Abuja, Nigeria', type: 'Workshop', category: 'training',
    description: 'Hands-on workshop covering modern project monitoring techniques and tools for the energy sector.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    attendees: 80, status: 'upcoming'
  },
  {
    id: 3, title: 'QHSE Compliance Seminar', date: '2024-01-20', time: '11:00 AM - 03:00 PM',
    location: 'Port Harcourt, Nigeria', type: 'Seminar', category: 'training',
    description: 'Expert-led seminar on the latest QHSE compliance standards and implementation strategies.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
    attendees: 120, status: 'past'
  },
  {
    id: 4, title: 'Financial Audit Masterclass', date: '2024-04-10', time: '09:30 AM - 05:00 PM',
    location: 'Lagos, Nigeria', type: 'Training', category: 'training',
    description: 'Advanced training for finance professionals on audit best practices in the oil and gas industry.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    attendees: 60, status: 'upcoming'
  },
];

const categories = ['All', 'Conference', 'Workshop', 'Seminar', 'Training'];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(e => e.type === activeCategory);

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.status === 'past');

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-primary-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-accent-400 font-semibold text-sm tracking-wider uppercase">Events</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Upcoming Events & Conferences
            </h1>
            <p className="text-primary-200 text-lg">
              Connect with industry leaders, learn from experts, and stay ahead of the curve 
              at IPMC events across Nigeria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-8">Upcoming Events</h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent-500 text-primary-900 text-xs font-bold rounded-full">{event.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} className="text-primary-600" />
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} className="text-primary-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-primary-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={16} className="text-primary-600" />
                        {event.attendees} expected attendees
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
                      Register Now <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No upcoming events in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="section-padding bg-primary-50">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-900 mb-8">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{event.type}</span>
                  <h3 className="font-display text-lg font-bold text-primary-900 mt-2 mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
