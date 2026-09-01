import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Palette, Search, Share2, Shield } from 'lucide-react';
import { settingsAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const groups = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'social', label: 'Social Media', icon: Share2 },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings({ addToast }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    settingsAPI.getAll().then(res => {
      setSettings(res.data || {});
      setLoading(false);
    }).catch(err => {
      addToast?.(err.message, 'error');
      setLoading(false);
    });
  }, [addToast]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings)
        .filter(([key]) => key.startsWith(activeGroup))
        .map(([key, value]) => ({ key, value, group: activeGroup }));
      await settingsAPI.bulkUpdate(updates);
      addToast?.('Settings saved successfully', 'success');
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setSaving(false);
  };

  const groupSettings = Object.entries(settings).filter(([key]) => key.startsWith(activeGroup));

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {groups.map(g => (
          <button key={g.key} onClick={() => setActiveGroup(g.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeGroup === g.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}>
            <g.icon size={16} /> {g.label}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-3xl">
        {groupSettings.length === 0 && (
          <p className="text-gray-500 text-center py-8">No settings in this category yet.</p>
        )}
        {groupSettings.map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(`${activeGroup}.`, '').replace(/-/g, ' ')}
            </label>
            {typeof value === 'boolean' ? (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={value} onChange={e => handleChange(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            ) : (
              <input type="text" value={value || ''} onChange={e => handleChange(key, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none" />
            )}
          </div>
        ))}
        <div className="pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
