import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function NewsletterUnsubscribe() {
  const [params] = useSearchParams();
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setState('error'); setMessage('This unsubscribe link is incomplete.'); return; }
    api.unsubscribeByToken(token).then((res) => { setState('success'); setMessage(res.message); }).catch((err) => { setState('error'); setMessage(err.message || 'This unsubscribe link is invalid or has expired.'); });
  }, [params]);

  return <div className="pt-20 lg:pt-24 min-h-[70vh] flex items-center bg-gray-50 dark:bg-slate-950"><div className="container-custom max-w-xl text-center"><div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-slate-800">
    {state === 'loading' && <><Loader2 size={44} className="animate-spin text-primary-600 mx-auto mb-5" /><h1 className="font-display text-2xl font-bold">Updating your subscription…</h1></>}
    {state === 'success' && <><CheckCircle2 size={50} className="text-emerald-500 mx-auto mb-5" /><h1 className="font-display text-2xl font-bold text-primary-900 dark:text-white">You're unsubscribed</h1><p className="text-gray-500 dark:text-gray-400 mt-3">{message}</p></>}
    {state === 'error' && <><XCircle size={50} className="text-red-500 mx-auto mb-5" /><h1 className="font-display text-2xl font-bold text-primary-900 dark:text-white">Unable to unsubscribe</h1><p className="text-gray-500 dark:text-gray-400 mt-3">{message}</p></>}
    <Link to="/newsletter" className="btn-primary inline-flex mt-7">Back to Newsletter</Link>
  </div></div></div>;
}
