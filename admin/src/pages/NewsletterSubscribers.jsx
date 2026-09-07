import { useEffect, useState } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { newsletterSubscriberAPI } from '../services/api';
import DataTable from '../components/UI/DataTable';

export default function NewsletterSubscribers({ addToast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const res = await newsletterSubscriberAPI.getAll(true); setRows(res.data || []); } catch (e) { addToast?.(e.message, 'error'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'isSubscribed', label: 'Status', render: v => <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{v ? 'Subscribed' : 'Unsubscribed'}</span> },
    { key: 'source', label: 'Source', render: v => <span className="capitalize">{String(v || 'other').replace('-', ' ')}</span> },
    { key: 'subscribedAt', label: 'Subscribed', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'lastNewsletterSentAt', label: 'Last Email', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1><p className="text-sm text-gray-500 mt-1">Monitor active and unsubscribed email records.</p></div><button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><RefreshCw size={16}/> Refresh</button></div><div className="bg-white rounded-xl border p-5 flex items-center gap-4"><Users className="text-blue-600"/><div><div className="text-2xl font-bold">{rows.filter(r => r.isSubscribed).length}</div><div className="text-sm text-gray-500">Active subscribers</div></div></div><DataTable data={rows} columns={columns} loading={loading} pageSize={12} /></div>;
}
