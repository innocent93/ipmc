import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

function deviceLabel(userAgent = '') {
  if (/mobile|android|iphone/i.test(userAgent)) return { icon: Smartphone, label: 'Mobile device' };
  return { icon: Monitor, label: 'Desktop / Laptop' };
}

export default function Sessions({ addToast }) {
  const [sessions, setSessions] = useState(null);
  const [revokingId, setRevokingId] = useState(null);

  const load = () => {
    authAPI.listSessions()
      .then((res) => setSessions(res.data))
      .catch(() => addToast('Could not load active sessions.', 'error'));
  };

  useEffect(load, []);

  const handleRevoke = async (id) => {
    setRevokingId(id);
    try {
      await authAPI.revokeSession(id);
      addToast('Session signed out.', 'success');
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      addToast(err.message || 'Could not revoke session.', 'error');
    }
    setRevokingId(null);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Active Sessions</h1>
      <p className="text-gray-500 text-sm mb-6">
        Every device currently signed in to this account. Signing out a device here ends that
        session immediately — it will need to log in again.
      </p>

      {sessions === null ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : sessions.length === 0 ? (
        <p className="text-gray-400 text-sm">No active sessions found.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const { icon: Icon, label } = deviceLabel(s.userAgent);
            return (
              <div key={s.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{label}</span>
                      {s.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={12} /> This device
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{s.userAgent}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Signed in {new Date(s.createdAt).toLocaleDateString()} · Expires {new Date(s.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(s.id)}
                  disabled={revokingId === s.id}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {revokingId === s.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  Sign out
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
