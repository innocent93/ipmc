import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Wifi, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { useAdmin } from '../context/AdminAuth';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
      // A failed login is exactly when this diagnostic is most useful —
      // open it automatically instead of making the person hunt for it.
      setShowDiagnostic(true);
    }
    setIsLoading(false);
  };

  // Directly tests the backend connection and shows the *raw* result
  // (status code, content-type, whether the body is real JSON) instead
  // of asking the person to trust a guess about what's wrong. This turns
  // "it's throwing a 405" into something concretely diagnosable without
  // needing browser DevTools.
  const runConnectionTest = async () => {
    setTesting(true);
    setTestResult(null);
    const target = `${API_BASE_URL}/services`; // a real, public, unauthenticated GET endpoint
    try {
      const res = await fetch(target, { method: 'GET' });
      const contentType = res.headers.get('content-type') || '(none)';
      const rawText = await res.text();
      let isJson = false;
      try { JSON.parse(rawText); isJson = true; } catch { /* not JSON */ }

      let verdict, ok;
      if (isJson && res.status < 500) {
        ok = true;
        verdict = 'Reached your Express backend and got a real JSON response. If login still fails, the backend is up but something in the /auth/login route itself is the problem (check backend logs).';
      } else if (!isJson && (res.status === 404 || res.status === 405)) {
        ok = false;
        verdict = `Got a ${res.status} with a non-JSON body — this means the request is being intercepted by a hosting platform layer BEFORE it reaches your Express app at all. On Render, this almost always means the service is deployed as a "Static Site" instead of a "Web Service" — check Render's dashboard for this service's type. It can also mean the URL above has a typo or points at the wrong deployment.`;
      } else {
        ok = false;
        verdict = `Got HTTP ${res.status} with content-type "${contentType}". Unexpected — check your backend's own logs for this request.`;
      }
      setTestResult({ ok, status: res.status, contentType, isJson, verdict, snippet: rawText.slice(0, 200) });
    } catch (err) {
      setTestResult({
        ok: false,
        status: null,
        verdict: `The request never got a response at all (${err.message}). This usually means: the backend URL is unreachable (typo, backend not running, or backend is asleep on a free tier that needs to "wake up" — try again in ~30s), or a CORS rejection (check the backend's CORS_ORIGIN includes this admin app's exact domain).`,
      });
    }
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-bold text-3xl text-white mb-2">IPMC<span className="text-amber-500">∞</span> Admin</div>
          <p className="text-slate-400">Content Management System</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ipmc-ng.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            <a href="/admin/forgot-password" className="text-blue-600 hover:underline font-medium">Forgot your password?</a>
          </p>

          {/* Connection diagnostic — lets the person see exactly what's
              happening (status code, content type, raw body) instead of
              guessing from an error message alone. */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowDiagnostic((v) => !v)}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700"
            >
              <span className="flex items-center gap-2"><Wifi size={15} /> Connection diagnostic</span>
              <ChevronDown size={16} className={`transition-transform ${showDiagnostic ? 'rotate-180' : ''}`} />
            </button>
            {showDiagnostic && (
              <div className="mt-3 space-y-3">
                <div className="text-xs bg-gray-50 rounded-lg p-3 font-mono break-all text-gray-600">
                  API_BASE_URL: {API_BASE_URL}
                </div>
                <button
                  type="button"
                  onClick={runConnectionTest}
                  disabled={testing}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {testing ? <LoadingSpinner size="sm" /> : 'Test Connection to Backend'}
                </button>
                {testResult && (
                  <div className={`p-3 rounded-lg text-sm ${testResult.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      {testResult.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {testResult.status ? `HTTP ${testResult.status}` : 'No response'}
                      {testResult.contentType && <span className="font-normal text-xs opacity-75">({testResult.contentType})</span>}
                    </div>
                    <p className="text-xs leading-relaxed">{testResult.verdict}</p>
                    {testResult.snippet && (
                      <pre className="text-xs mt-2 bg-black/5 rounded p-2 overflow-x-auto whitespace-pre-wrap">{testResult.snippet}</pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
