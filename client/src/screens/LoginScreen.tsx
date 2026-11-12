import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto p-6 justify-center border-x-4 border-black">
      <div className="text-center mb-8">
        <h1 className="font-cursive text-3xl font-extrabold text-[#E60023] leading-none mb-1 flex items-center justify-center gap-2">
          <span>DUALO</span>
          <Sparkles className="w-6 h-6 text-[#E60023]" />
        </h1>
        <p className="font-modern font-bold text-xs uppercase text-black">SIGN IN TO BARTER SKILLS</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#E60023] text-white border-3 border-black rounded-xl text-xs font-modern font-black uppercase text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-3 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-3 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark disabled:opacity-50 text-white font-modern font-black text-sm shadow-max-black transition-all active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>SIGN IN</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="font-modern font-bold text-xs uppercase text-black">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#E60023] font-extrabold hover:underline">
            CREATE ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
};