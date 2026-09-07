import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MailX } from 'lucide-react';

export default function NewsletterUnsubscribe() {
  const { token } = useParams();
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.VITE_API_URL || 'https://ipmc.onrender.com/api'}/newsletter/unsubscribe/${encodeURIComponent(token || '')}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || 'This unsubscribe link is invalid or has expired.');
        return data;
      })
      .then((data) => { if (active) { setMessage(data.message); setState('success'); } })
      .catch((error) => { if (active) { setMessage(error.message); setState('error'); } });
    return () => { active = false; };
  }, [token]);

  return (
    <div className="pt-20 lg:pt-24 min-h-[70vh] flex items-center bg-primary-50 dark:bg-slate-950">
      <div className="container-custom max-w-xl py-20 text-center">
        {state === 'loading' && <Loader2 size={44} className="animate-spin mx-auto text-primary-600" />}
        {state === 'success' && <><CheckCircle2 size={56} className="mx-auto text-emerald-600 mb-5" /><h1 className="font-display text-3xl font-bold text-primary-900 dark:text-white">You’re unsubscribed</h1><p className="mt-3 text-gray-600 dark:text-gray-400">{message}</p></>}
        {state === 'error' && <><MailX size={56} className="mx-auto text-gray-400 mb-5" /><h1 className="font-display text-3xl font-bold text-primary-900 dark:text-white">We couldn’t unsubscribe you</h1><p className="mt-3 text-gray-600 dark:text-gray-400">{message}</p></>}
        {state !== 'loading' && <Link to="/" className="inline-flex mt-7 px-5 py-3 rounded-lg bg-primary-700 text-white font-semibold hover:bg-primary-800">Return to IPMC</Link>}
      </div>
    </div>
  );
}
