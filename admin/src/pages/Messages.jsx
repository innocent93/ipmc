import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Reply, Trash2, X, Search, Filter } from 'lucide-react';
import { contactAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function Messages({ addToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll('?limit=100');
      setMessages(res.data || []);
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setLoading(false);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setReplying(true);
    try {
      await contactAPI.reply(selected._id, replyText);
      addToast?.('Reply sent successfully', 'success');
      setReplyText('');
      setSelected(null);
      loadMessages();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
    setReplying(false);
  };

  const handleMarkRead = async (msg) => {
    try {
      await contactAPI.markAsRead(msg._id);
      addToast?.('Marked as read', 'success');
      loadMessages();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(msg._id);
      addToast?.('Message deleted', 'success');
      if (selected?._id === msg._id) setSelected(null);
      loadMessages();
    } catch (err) {
      addToast?.(err.message, 'error');
    }
  };

  const filtered = filter === 'all' ? messages : filter === 'unread' ? messages.filter(m => !m.isRead) : messages.filter(m => m.isReplied);

  const columns = [
    { key: 'name', label: 'From' },
    { key: 'email', label: 'Email', render: (v) => <span className="text-xs text-gray-500">{v}</span> },
    { key: 'subject', label: 'Subject' },
    { key: 'isRead', label: 'Status', render: (v, row) => (
      <div className="flex items-center gap-1">
        {v ? <MailOpen size={14} className="text-green-500" /> : <Mail size={14} className="text-amber-500" />}
        <span className="text-xs">{v ? 'Read' : 'New'}</span>
        {row.isReplied && <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">Replied</span>}
      </div>
    )},
    { key: 'createdAt', label: 'Date', render: (v) => <span className="text-xs text-gray-500">{new Date(v).toLocaleDateString()}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none">
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataTable data={filtered} columns={columns}
            onView={(row) => { setSelected(row); if (!row.isRead) handleMarkRead(row); }}
            onDelete={handleDelete} loading={loading} pageSize={10} />
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Message Details</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500">From:</span> <span className="font-medium">{selected.name}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.email}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone || 'N/A'}</span></div>
                <div><span className="text-gray-500">Company:</span> <span className="font-medium">{selected.company || 'N/A'}</span></div>
                <div><span className="text-gray-500">Subject:</span> <span className="font-medium">{selected.subject}</span></div>
                <div><span className="text-gray-500">Service Interest:</span> <span className="font-medium">{selected.serviceInterest || 'N/A'}</span></div>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-700">{selected.message}</div>
                {selected.replyMessage && (
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-800">
                    <span className="text-xs font-medium text-blue-600">Your Reply:</span>
                    <p className="mt-1">{selected.replyMessage}</p>
                  </div>
                )}
              </div>
              {!selected.isReplied && (
                <div className="mt-4 space-y-2">
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none h-24 text-sm" />
                  <button onClick={handleReply} disabled={replying || !replyText.trim()}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <Reply size={16} /> {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
