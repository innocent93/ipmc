import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, MessageSquare, Mail, TrendingUp, Eye, Clock, BarChart3 } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function Dashboard({ addToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analyticsAPI.getDashboard();
        setStats(res.data);
      } catch (err) {
        addToast?.(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard</div>;

  const cards = [
    { label: 'Blog Posts', value: stats.totalBlogs, icon: FileText, color: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Services', value: stats.totalServices, icon: TrendingUp, color: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Team Members', value: stats.totalTeam, icon: Users, color: 'bg-violet-500', text: 'text-violet-600' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'bg-rose-500', text: 'text-rose-600' },
    { label: 'Subscribers', value: stats.totalSubscribers, icon: Mail, color: 'bg-cyan-500', text: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} /> {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm text-gray-700">Unread Messages</span>
              <span className="font-bold text-amber-600">{stats.unreadMessages}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Total Blog Views</span>
              <span className="font-bold text-blue-600">{stats.totalViews.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
