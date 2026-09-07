import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { partnerAPI, uploadAPI } from '../services/api';
import { useAdmin } from '../context/AdminAuth';
import DataTable from '../components/UI/DataTable';

const CATEGORIES = ['regulatory', 'industry', 'international', 'academic'];
const emptyForm = { name: '', logo: '', website: '', description: '', category: 'industry', isActive: true, order: 0 };

export default function PartnersManager({ addToast }) {
  const { user } = useAdmin();
  const [partners, setPartners] = useState([]); const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); const [modalOpen, setModalOpen] = useState(false); const [uploading, setUploading] = useState(false); const [form, setForm] = useState(emptyForm);
  const load = async () => { setLoading(true); try { const res = await partnerAPI.getAdminAll('?limit=100'); setPartners(res.data || []); } catch (e) { addToast?.(e.message, 'error'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const edit = p => { setEditing(p); setForm({ ...emptyForm, ...p }); setModalOpen(true); };
  const submit = async e => { e.preventDefault(); try { if (editing) { await partnerAPI.update(editing._id, form); addToast?.('Partner updated', 'success'); } else { await partnerAPI.create(form); addToast?.('Partner created', 'success'); } setModalOpen(false); setEditing(null); setForm({ ...emptyForm }); load(); } catch (err) { addToast?.(err.message, 'error'); } };
  const remove = async p => { if (!window.confirm(`Delete "${p.name}"?`)) return; try { await partnerAPI.delete(p._id); addToast?.('Partner deleted', 'success'); load(); } catch (e) { addToast?.(e.message, 'error'); } };
  const upload = async e => { const file = e.target.files?.[0]; if (!file) return; setUploading(true); try { const res = await uploadAPI.uploadImage(file); setForm(f => ({ ...f, logo: res.data.url })); addToast?.('Logo uploaded', 'success'); } catch (err) { addToast?.(err.message, 'error'); } finally { setUploading(false); } };
  const columns = [
    { key: 'name', label: 'Partner' },
    { key: 'category', label: 'Category', render: v => <span className="capitalize">{v}</span> },
    { key: 'order', label: 'Order' },
    { key: 'isActive', label: 'Status', render: v => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v ? 'Active' : 'Inactive'}</span> },
  ];
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Partners Manager</h1><button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18}/> New Partner</button></div>
    <DataTable data={partners} columns={columns} onEdit={edit} onDelete={user?.role === 'admin' ? remove : undefined} loading={loading} pageSize={10}/>
    {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><motion.div initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6"><div className="flex justify-between mb-6"><h2 className="text-xl font-bold">{editing ? 'Edit Partner' : 'New Partner'}</h2><button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button></div>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" required value={form.name} onChange={v => setForm({...form,name:v})}/>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Logo</label><div className="flex gap-2"><input required value={form.logo} onChange={e => setForm({...form,logo:e.target.value})} placeholder="https://..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200"/><label className="flex items-center gap-2 px-3 bg-gray-100 rounded-lg cursor-pointer"><ImageIcon size={17}/>{uploading?'...':'Upload'}<input type="file" accept="image/*" className="hidden" onChange={upload}/></label></div>{form.logo && <img src={form.logo} alt="Logo preview" className="mt-2 h-16 max-w-40 object-contain"/>}</div>
        <Field label="Website" value={form.website} onChange={v => setForm({...form,website:v})}/><Field label="Description" value={form.description} onChange={v => setForm({...form,description:v})}/>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div><Field label="Order" type="number" value={form.order} onChange={v=>setForm({...form,order:Number(v)||0})}/></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})}/> Active on website</label>
        <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">{editing?'Update':'Create'}</button></div>
      </form></motion.div></div>}
  </div>;
}
function Field({label,value,onChange,required,type='text'}){return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input required={required} type={type} value={value ?? ''} onChange={e=>onChange(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"/></div>}
