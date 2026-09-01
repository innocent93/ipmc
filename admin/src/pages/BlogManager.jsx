import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import { blogAPI, uploadAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const CATEGORIES = ['esg', 'financial', 'project-management', 'environmental', 'industry-news', 'insights'];

export default function BlogManager({ addToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    author: { name: '', avatar: '', role: 'Contributor' },
    category: 'insights', tags: [], isPublished: true, isFeatured: false,
    metaTitle: '', metaDescription: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAll('?limit=100');
      setPosts(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await blogAPI.update(editing._id, form);
        addToast?.('Blog post updated', 'success');
      } else {
        await blogAPI.create(form);
        addToast?.('Blog post created', 'success');
      }
      setModalOpen(false);
      setEditing(null);
      resetForm();
      loadPosts();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await blogAPI.delete(post._id);
      addToast?.('Blog post deleted', 'success');
      loadPosts();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setForm({ ...post, author: post.author || { name: '', avatar: '', role: 'Contributor' } });
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '', slug: '', excerpt: '', content: '', coverImage: '',
      author: { name: '', avatar: '', role: 'Contributor' },
      category: 'insights', tags: [], isPublished: true, isFeatured: false,
      metaTitle: '', metaDescription: ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      setForm(prev => ({ ...prev, coverImage: res.data.url }));
      addToast?.('Image uploaded', 'success');
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setUploading(false);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (v) => <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{v}</span> },
    { key: 'author', label: 'Author', render: (v) => v?.name || '-' },
    { key: 'views', label: 'Views' },
    { key: 'isPublished', label: 'Status', render: (v) => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{v ? 'Published' : 'Draft'}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog Manager</h1>
        <button onClick={() => { setEditing(null); resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} /> New Post
        </button>
      </div>
      <DataTable data={posts} columns={columns} onEdit={handleEdit} onDelete={handleDelete} loading={loading} pageSize={8} />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea required maxLength={300} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input value={form.author.name} onChange={e => setForm({...form, author: {...form.author, name: e.target.value}})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <div className="flex gap-2">
                  <input value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="Image URL" />
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <ImageIcon size={18} /> {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {form.coverImage && <img src={form.coverImage} alt="Preview" className="mt-2 h-20 rounded-lg object-cover" />}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
                  <span className="text-sm">Featured</span>
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
