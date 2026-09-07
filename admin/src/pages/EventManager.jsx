import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Users, Trash2 } from 'lucide-react';
import { eventAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';

const CATEGORIES = ['conference', 'workshop', 'seminar', 'training'];

const emptyForm = {
  title: '', slug: '', description: '', category: 'conference',
  coverImage: '', location: '', startDate: '', endDate: '', capacity: 0, isActive: true,
};

export default function EventManager({ addToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [rsvpModal, setRsvpModal] = useState(null);
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await eventAPI.getAdminAll('?limit=100');
      setEvents(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await eventAPI.update(editing._id, form);
        addToast?.('Event updated', 'success');
      } else {
        await eventAPI.create(form);
        addToast?.('Event created', 'success');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadEvents();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm(`Delete "${ev.title}"? This also removes all its RSVPs.`)) return;
    try {
      await eventAPI.delete(ev._id);
      addToast?.('Event deleted', 'success');
      loadEvents();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleEdit = (ev) => {
    setEditing(ev);
    setForm({ ...ev, startDate: ev.startDate?.slice(0, 16), endDate: ev.endDate?.slice(0, 16) || '' });
    setModalOpen(true);
  };

  const openRsvps = async (ev) => {
    setRsvpModal(ev);
    try {
      const res = await eventAPI.getRsvps(ev._id);
      setRsvps(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const removeRsvp = async (rsvpId) => {
    try {
      await eventAPI.removeRsvp(rsvpModal._id, rsvpId);
      setRsvps((prev) => prev.filter((r) => r._id !== rsvpId));
      addToast?.('RSVP removed', 'success');
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (v) => <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{v}</span> },
    { key: 'startDate', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
    { key: 'rsvpCount', label: 'RSVPs', render: (v, row) => (
        <button onClick={() => openRsvps(row)} className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
          <Users size={14} /> {v || 0}{row.capacity > 0 ? ` / ${row.capacity}` : ''}
        </button>
      ) },
    { key: 'isActive', label: 'Status', render: (v) => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Event Manager</h1>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} /> New Event
        </button>
      </div>
      <DataTable data={events} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} pageSize={8} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input required type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (0 = unlimited)</label>
                  <input type="number" min={0} value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-sm">Active (visible on the public Events page)</span>
              </label>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {rsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">RSVPs \u2014 {rsvpModal.title}</h2>
              <button onClick={() => setRsvpModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            {rsvps.length === 0 ? (
              <p className="text-gray-400 text-sm py-8 text-center">No RSVPs yet.</p>
            ) : (
              <div className="space-y-2">
                {rsvps.map((r) => (
                  <div key={r._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{r.name} <span className="text-gray-400 font-normal">&times;{r.guests}</span></div>
                      <div className="text-xs text-gray-500">{r.email} {r.phone && `\u00b7 ${r.phone}`}</div>
                    </div>
                    <button onClick={() => removeRsvp(r._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
