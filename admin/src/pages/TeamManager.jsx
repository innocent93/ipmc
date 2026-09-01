import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { teamAPI, uploadAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const DEPARTMENTS = ['leadership', 'engineering', 'consulting', 'environmental', 'finance'];

export default function TeamManager({ addToast }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', role: '', title: '', bio: '', image: '',
    email: '', linkedin: '', twitter: '',
    isActive: true, order: 0, department: 'consulting'
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await teamAPI.getAll('?limit=100');
      setMembers(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await teamAPI.update(editing._id, form);
        addToast?.('Team member updated', 'success');
      } else {
        await teamAPI.create(form);
        addToast?.('Team member created', 'success');
      }
      setModalOpen(false);
      setEditing(null);
      resetForm();
      loadMembers();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete "${member.name}"?`)) return;
    try {
      await teamAPI.delete(member._id);
      addToast?.('Team member deleted', 'success');
      loadMembers();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleEdit = (member) => {
    setEditing(member);
    setForm({ ...member });
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '', role: '', title: '', bio: '', image: '',
      email: '', linkedin: '', twitter: '',
      isActive: true, order: 0, department: 'consulting'
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      setForm(prev => ({ ...prev, image: res.data.url }));
      addToast?.('Image uploaded', 'success');
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setUploading(false);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department', render: (v) => <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{v}</span> },
    { key: 'isActive', label: 'Status', render: (v) => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Team Manager</h1>
        <button onClick={() => { setEditing(null); resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} /> New Member
        </button>
      </div>
      <DataTable data={members} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} pageSize={8} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Edit Member' : 'New Team Member'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input required value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea required value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="flex gap-2">
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="Image URL" />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <ImageIcon size={18} /> {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {form.image && <img src={form.image} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
