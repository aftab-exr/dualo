import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  ShieldAlert,
  Flame,
  RefreshCw,
  LogOut,
  X,
  MapPin,
  Mail,
  CheckCircle2,
  Loader2,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  isPhoneVerified: boolean;
  phoneNumber?: string;
  streakDays: number;
  totalSwaps: number;
  remainingSwipes: number;
  skillsOffered: string[];
  skillsWanted: string[];
}

export const ProfileScreen: React.FC = () => {
  const { user, logout, checkAuth } = useAuthStore();

  // Phone Verification Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setError(null);
    setStep('OTP');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      await api.post<UserProfileResponse>('/auth/verify-phone', {
        phoneNumber: phoneNumber.trim(),
        otpCode: otpCode.trim(),
      });

      // Refresh store to update isPhoneVerified status
      await checkAuth();

      setIsModalOpen(false);
      setStep('PHONE');
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the OTP code.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStep('PHONE');
    setOtpCode('');
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white max-w-md mx-auto pb-24 select-none">
      {/* Header */}
      <header className="p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-black text-white tracking-tight">My Profile</h1>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </header>

      <main className="p-4 space-y-4">
        {/* Profile Info Card */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-3xl space-y-4 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{user?.fullName}</h2>
              <p className="text-xs text-blue-400 font-medium mb-1">@{user?.handle}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{user?.email}</span>
                </span>
                {user?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{user.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {user?.headline && (
            <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              "{user.headline}"
            </p>
          )}

          {user?.bio && (
            <p className="text-xs text-slate-400 leading-relaxed">{user.bio}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{user?.streakDays || 0}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Streak Days
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 font-black text-lg">
              <Award className="w-4 h-4" />
              <span>{user?.totalSwaps || 0}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Total Swaps
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-lg">
              <RefreshCw className="w-4 h-4" />
              <span>{user?.remainingSwipes || 0}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Remaining
            </span>
          </div>
        </div>

        {/* Phone Verification Status Card */}
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                user?.isPhoneVerified
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {user?.isPhoneVerified ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Phone Verification</span>
                {user?.isPhoneVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                )}
              </h4>
              <p className="text-[11px] text-slate-400">
                {user?.isPhoneVerified
                  ? `Verified (${user.phoneNumber})`
                  : 'Verify to boost barter trust score'}
              </p>
            </div>
          </div>

          {!user?.isPhoneVerified && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors"
            >
              Verify
            </button>
          )}
        </div>

        {/* Skills Offered & Wanted */}
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Skills Offered (Teaches):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user?.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No skills listed yet</span>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Skills Wanted (Wants to Learn):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user?.skillsWanted && user.skillsWanted.length > 0 ? (
                user.skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No skills listed yet</span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Phone Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Identity Trust Verification</span>
            </div>

            <h2 className="text-xl font-black text-white mb-1">Verify Mobile Phone</h2>
            <p className="text-slate-400 text-xs mb-5">
              {step === 'PHONE'
                ? 'Enter your mobile number to receive a verification security code.'
                : `Enter the 6-digit OTP code sent to ${phoneNumber}.`}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {step === 'PHONE' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                  Send Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    required
                    maxLength={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-center text-lg tracking-widest font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 text-center">
                    (Mock OTP: Enter any code like "123456" for dev)
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="w-1/3 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Confirm & Verify</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};