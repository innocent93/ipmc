import { useState } from 'react';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

export default function NewsletterSubscribeForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.subscribe(email.trim(), 'newsletter-page');
      setSuccess(true);
      setEmail('');
      toast.success('You are subscribed to IPMC Insights.');
    } catch (err) {
      toast.error(err.message || 'Could not subscribe. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-800"><CheckCircle2 size={22} /><div><strong>You're subscribed.</strong><div className="text-sm">A welcome email is on its way.</div></div></div>;

  return <form onSubmit={submit} className={`flex ${compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-3`}>
    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
    <div className="relative flex-1"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input id="newsletter-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" autoComplete="email" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none" /></div>
    <button disabled={loading} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition-colors disabled:opacity-60">{loading ? <Loader2 size={18} className="animate-spin" /> : 'Subscribe'}</button>
  </form>;
}
