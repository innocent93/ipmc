import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Send, Loader2 } from 'lucide-react';
import { newsletterIssueAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';

const emptyForm = { subject: '', slug: '', summary: '', content: '', coverImage: '' };

export default function NewsletterManager({ addToast }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => { loadIssues(); }, []);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await newsletterIssueAPI.getAll();
      setIssues(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await newsletterIssueAPI.update(editing._id, form);
        addToast?.('Issue updated', 'success');
      } else {
        await newsletterIssueAPI.create(form);
        addToast?.('Issue saved as draft', 'success');
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadIssues();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (issue) => {
    if (!window.confirm(`Delete "${issue.subject}"?`)) return;
    try {
      await newsletterIssueAPI.delete(issue._id);
      addToast?.('Issue deleted', 'success');
      loadIssues();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleEdit = (issue) => {
    setEditing(issue);
    setForm({ ...issue });
    setModalOpen(true);
  };

  const handleSend = async (issue) => {
    if (issue.sentAt) return;
    if (!window.confirm(`Send "${issue.subject}" to every active subscriber now? This can't be undone.`)) return;
    setSendingId(issue._id);
    try {
      const res = await newsletterIssueAPI.send(issue._id);
      addToast?.(res.message, 'success');
      loadIssues();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setSendingId(null);
  };

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'sentAt', label: 'Status', render: (v) => v
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Sent {new Date(v).toLocaleDateString()}</span>
      : <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Draft</span> },
    { key: '_id', label: 'Action', render: (_, row) => (
        <button onClick={() => handleSend(row)} disabled={!!row.sentAt || sendingId === row._id}
          className="flex items-center gap-1 text-blue-600 hover:underline text-sm disabled:opacity-40 disabled:no-underline">
          {sendingId === row._id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {row.sentAt ? 'Sent' : 'Send Now'}
        </button>
      ) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Issues</h1>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} /> New Issue
        </button>
      </div>
      <DataTable data={issues} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} pageSize={8} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Edit Issue' : 'New Newsletter Issue'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                  <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (for the public archive URL)</label>
                  <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary (shown in the archive listing)</label>
                <input required value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-48 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="https://..." />
              </div>
              <p className="text-xs text-gray-400">Saving here only creates a draft \u2014 it won't be emailed or appear in the public archive until you click "Send Now" from the list.</p>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Save Draft'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
