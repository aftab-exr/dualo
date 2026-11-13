import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, User, AtSign, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skillsOfferedText, setSkillsOfferedText] = useState('');
  const [skillsWantedText, setSkillsWantedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const skillsOffered = skillsOfferedText.split(',').map((s) => s.trim()).filter(Boolean);
      const skillsWanted = skillsWantedText.split(',').map((s) => s.trim()).filter(Boolean);

      await register({
        fullName,
        handle,
        email,
        password,
        skillsOffered,
        skillsWanted,
      });

      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto p-6 justify-center border-x-4 border-black">
      <div className="text-center mb-6">
        <h1 className="font-cursive text-3xl font-extrabold text-[#E60023] leading-none mb-1 flex items-center justify-center gap-2">
          <span>DUALO</span>
          <Sparkles className="w-6 h-6 text-[#E60023]" />
        </h1>
        <p className="font-modern font-bold text-xs uppercase text-black">JOIN THE SKILL BARTER COMMUNITY</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#E60023] text-white border-3 border-black rounded-xl text-xs font-modern font-black uppercase text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">FULL NAME</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Smith"
                required
                className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">HANDLE</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="alex_dev"
                required
                className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">EMAIL ADDRESS</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">PASSWORD</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">SKILLS YOU TEACH (COMMA-SEPARATED)</label>
          <input
            type="text"
            value={skillsOfferedText}
            onChange={(e) => setSkillsOfferedText(e.target.value)}
            placeholder="React, TypeScript, Figma"
            className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
          />
        </div>

        <div>
          <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">SKILLS YOU WANT TO LEARN (COMMA-SEPARATED)</label>
          <input
            type="text"
            value={skillsWantedText}
            onChange={(e) => setSkillsWantedText(e.target.value)}
            placeholder="Python, Spanish, UI Design"
            className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
          />
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
              <span>COMPLETE REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-5">
        <p className="font-modern font-bold text-xs uppercase text-black">
          Already have an account?{' '}
          <Link to="/login" className="text-[#E60023] font-extrabold hover:underline">
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
};