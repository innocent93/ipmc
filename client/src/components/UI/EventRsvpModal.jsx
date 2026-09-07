import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

export default function EventRsvpModal({ event, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!event.slug) throw new Error('This is sample data — connect the backend to accept real RSVPs.');
      await api.rsvpToEvent(event.slug, form);
      setSubmitted(true);
      toast.success('RSVP confirmed!');
    } catch (err) {
      toast.error(err.message || 'Could not submit your RSVP. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog" aria-modal="true" aria-labelledby="rsvp-modal-title"
          className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 relative"
        >
          <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={52} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-primary-900 dark:text-white mb-2">You're on the list!</h3>
              <p className="text-gray-500 dark:text-gray-400">We look forward to seeing you at {event.title}.</p>
            </div>
          ) : (
            <>
              <h3 id="rsvp-modal-title" className="font-display text-xl font-bold text-primary-900 dark:text-white mb-1">
                RSVP: {event.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{event.location}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary-500 outline-none" />
                <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary-500 outline-none" />
                <input placeholder="Phone Number (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary-500 outline-none" />
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Number of Guests</label>
                  <input type="number" min={1} max={10} value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-primary-500 outline-none" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm RSVP'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
