import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { jobAPI } from '../services/api';
import { useAdmin } from '../context/AdminAuth';
import DataTable from '../components/UI/DataTable';

const TYPES = ['full-time', 'part-time', 'contract', 'internship'];

const emptyForm = {
  title: '', slug: '', department: '', location: '', type: 'full-time',
  description: '', requirements: [], responsibilities: [], benefits: [],
  salaryRange: '', experienceLevel: '', isActive: true, closingDate: '',
};

const lines = (value) => Array.isArray(value) ? value.map(v => String(v).trim()).filter(Boolean) : String(value || '').split('\n').map(v => v.trim()).filter(Boolean);
const slugify = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function JobsManager({ addToast }) {
  const { user } = useAdmin();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await jobAPI.getAdminAll('?limit=100');
      setJobs(res.data || []);
    } catch (err) { addToast?.(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (job) => { setEditing(job); setForm({ ...emptyForm, ...job, closingDate: job.closingDate ? job.closingDate.slice(0, 10) : '' }); setModalOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, requirements: lines(form.requirements), responsibilities: lines(form.responsibilities), benefits: lines(form.benefits), closingDate: form.closingDate || undefined };
    try {
      if (editing) { await jobAPI.update(editing._id, payload); addToast?.('Job updated', 'success'); }
      else { await jobAPI.create(payload); addToast?.('Job created', 'success'); }
      setModalOpen(false); setEditing(null); setForm({ ...emptyForm }); await loadJobs();
    } catch (err) { addToast?.(err.message, 'error'); }
  };

  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    try { await jobAPI.delete(job._id); addToast?.('Job deleted', 'success'); loadJobs(); }
    catch (err) { addToast?.(err.message, 'error'); }
  };

  const columns = [
    { key: 'title', label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type', render: v => <span className="capitalize">{v?.replace('-', ' ')}</span> },
    { key: 'isActive', label: 'Status', render: v => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v ? 'Open' : 'Closed'}</span> },
  ];

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Jobs Manager</h1>
      <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> New Job</button>
    </div>
    <DataTable data={jobs} columns={columns} onEdit={openEdit} onDelete={user?.role === 'admin' ? remove : undefined} loading={loading} pageSize={8} />

    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">{editing ? 'Edit Job' : 'New Job'}</h2><button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title" required value={form.title} onChange={v => setForm({ ...form, title: v, ...(editing ? {} : { slug: slugify(v) }) })} />
            <Field label="Slug" required value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
            <Field label="Department" required value={form.department} onChange={v => setForm({ ...form, department: v })} />
            <Field label="Location" required value={form.location} onChange={v => setForm({ ...form, location: v })} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200">{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <Field label="Salary Range" value={form.salaryRange} onChange={v => setForm({ ...form, salaryRange: v })} />
            <Field label="Experience Level" value={form.experienceLevel} onChange={v => setForm({ ...form, experienceLevel: v })} />
            <Field label="Closing Date" type="date" value={form.closingDate} onChange={v => setForm({ ...form, closingDate: v })} />
          </div>
          <TextArea label="Description" required value={form.description} onChange={v => setForm({ ...form, description: v })} />
          <TextArea label="Requirements (one per line)" value={Array.isArray(form.requirements) ? form.requirements.join('\n') : form.requirements} onChange={v => setForm({ ...form, requirements: v })} />
          <TextArea label="Responsibilities (one per line)" value={Array.isArray(form.responsibilities) ? form.responsibilities.join('\n') : form.responsibilities} onChange={v => setForm({ ...form, responsibilities: v })} />
          <TextArea label="Benefits (one per line)" value={Array.isArray(form.benefits) ? form.benefits.join('\n') : form.benefits} onChange={v => setForm({ ...form, benefits: v })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Open and visible on Careers</label>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update Job' : 'Create Job'}</button></div>
        </form>
      </motion.div>
    </div>}
  </div>;
}

function Field({ label, value, onChange, required, type = 'text' }) { return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input required={required} type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" /></div>; }
function TextArea({ label, value, onChange, required }) { return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><textarea required={required} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none min-h-28" /></div>; }
