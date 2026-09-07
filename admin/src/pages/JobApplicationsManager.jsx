import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, FileText, Mail, Phone } from 'lucide-react';
import { jobApplicationAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const STATUSES = [
  { key: 'submitted', label: 'Submitted', color: 'bg-gray-100 text-gray-700' },
  { key: 'under_review', label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'bg-amber-100 text-amber-700' },
  { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  { key: 'hired', label: 'Hired', color: 'bg-green-100 text-green-700' },
];

export default function JobApplicationsManager({ addToast }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { loadApplications(); }, [filterStatus]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await jobApplicationAPI.getAll(filterStatus ? `?status=${filterStatus}` : '');
      setApplications(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const changeStatus = async (app, status) => {
    try {
      await jobApplicationAPI.updateStatus(app._id, status);
      addToast?.(`Marked as ${status.replace('_', ' ')} \u2014 the applicant has been notified by email`, 'success');
      setSelected(null);
      loadApplications();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete ${app.name}'s application?`)) return;
    try {
      await jobApplicationAPI.delete(app._id);
      addToast?.('Application deleted', 'success');
      setSelected(null);
      loadApplications();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const statusMeta = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : applications.length === 0 ? (
        <p className="text-gray-400 text-sm py-16 text-center">No applications{filterStatus ? ` with status "${filterStatus}"` : ''} yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <button key={app._id} onClick={() => setSelected(app)}
              className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusMeta(app.status).color}`}>{statusMeta(app.status).label}</span>
                <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="font-semibold text-gray-900">{app.name}</div>
              <div className="text-sm text-gray-500">{app.job?.title || 'Position removed'}</div>
              <div className="text-xs text-gray-400 mt-1">{app.email}</div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Applied for {selected.job?.title || 'a removed position'}</p>

            <div className="space-y-2 mb-5 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {selected.email}</div>
              <div className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {selected.phone}</div>
              <a href={selected.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                <FileText size={14} /> View Resume
              </a>
            </div>

            {selected.coverLetter && (
              <div className="mb-5">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Cover Letter</div>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selected.coverLetter}</p>
              </div>
            )}

            <div className="mb-5">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Move to Stage</div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s.key} onClick={() => changeStatus(selected, s.key)}
                    disabled={selected.status === s.key}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity ${s.color} ${selected.status === s.key ? 'opacity-40 cursor-default' : 'hover:opacity-80'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Shortlisted / Interview / Rejected / Hired all trigger an automatic email to the applicant.</p>
            </div>

            <button onClick={() => handleDelete(selected)} className="flex items-center gap-2 text-red-600 text-sm hover:underline">
              <Trash2 size={14} /> Delete Application
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
