import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  ShieldAlert,
  Flame,
  LogOut,
  X,
  MapPin,
  Mail,
  CheckCircle2,
  RotateCcwIcon,
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

      await checkAuth();

      setIsModalOpen(false);
      setStep('PHONE');
      setOtpCode('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'VERIFICATION FAILED. PLEASE CHECK THE OTP CODE.';
      setError(message);
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
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto pb-24 select-none">
      <header className="p-4 bg-white border-b-4 border-black sticky top-0 z-10 flex items-center justify-between">
        <h1 className="font-cursive text-2xl font-extrabold text-[#E60023] tracking-tight">MY PROFILE</h1>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white border-2 border-black text-xs font-modern font-black uppercase hover:bg-slate-900 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </header>

      <main className="p-4 space-y-4">
        <div className="p-5 bg-white border-4 border-black shadow-max-red space-y-4 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E60023] flex items-center justify-center text-white font-modern font-extrabold text-2xl shadow-max-black shrink-0">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-cursive text-xl font-extrabold text-[#E60023] truncate">{user?.fullName}</h2>
              <p className="font-modern font-black text-xs uppercase text-black mb-1">@{user?.handle}</p>

              <div className="flex flex-wrap items-center gap-2 font-modern font-bold text-xs uppercase text-black">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user?.email}</span>
                </span>
                {user?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{user.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {user?.headline && (
            <p className="font-cursive text-xs text-[#E60023] italic bg-[#F4F4F4] p-3 rounded-xl border-3 border-black">
              "{user.headline}"
            </p>
          )}

          {user?.bio && (
            <p className="font-modern text-xs font-bold text-black leading-relaxed border-l-4 border-[#E60023] pl-3 my-2">
              {user.bio}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-white border-3 border-black shadow-max-red text-center">
            <div className="flex items-center justify-center gap-1 text-[#E60023] font-modern font-black text-lg">
              <Flame className="w-4 h-4" />
              <span>{user?.streakDays || 0}</span>
            </div>
            <span className="font-modern text-[10px] uppercase text-black">STREAK DAYS</span>
          </div>

          <div className="p-3 bg-white border-3 border-black shadow-max-red text-center">
            <div className="flex items-center justify-center gap-1 text-black font-modern font-black text-lg">
              <Award className="w-4 h-4" />
              <span>{user?.totalSwaps || 0}</span>
            </div>
            <span className="font-modern text-[10px] uppercase text-black">TOTAL SWAPS</span>
          </div>

          <div className="p-3 bg-white border-3 border-black shadow-max-red text-center">
            <div className="flex items-center justify-center gap-1 text-[#E60023] font-modern font-black text-lg">
              <RotateCcwIcon className="w-4 h-4" />
              <span>{user?.remainingSwipes || 0}</span>
            </div>
            <span className="font-modern text-[10px] uppercase text-black">REMAINING</span>
          </div>
        </div>

        <div className="p-4 bg-white border-4 border-[#E60023] shadow-max-red flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.isPhoneVerified
              ? 'bg-[#E60023] text-white border-2 border-black'
              : 'bg-black text-white border-2 border-[#E60023]'}`}>
              {user?.isPhoneVerified ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="font-modern text-xs font-extrabold uppercase text-black flex items-center gap-1.5">
                <span>PHONE VERIFICATION</span>
                {user?.isPhoneVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E60023]" />
                )}
              </h4>
              <p className="font-modern font-bold text-[11px] uppercase text-black">
                {user?.isPhoneVerified
                  ? `VERIFIED (${user.phoneNumber})`
                  : 'VERIFY TO BOOST BARTER TRUST SCORE'}
              </p>
            </div>
          </div>

          {!user?.isPhoneVerified && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-extrabold text-xs uppercase shadow-max-black border-2 border-black transition-colors"
            >
              VERIFY
            </button>
          )}
        </div>

        <div className="p-4 bg-white border-4 border-black shadow-max-red space-y-3">
          <div>
            <span className="font-modern text-[11px] font-extrabold uppercase tracking-wider text-[#E60023] block mb-2">
              TEACHES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user?.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-modern font-extrabold uppercase bg-[#E60023] text-white border-2 border-black shadow-max-black"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="font-modern text-xs font-bold text-black">NO SKILLS LISTED YET</span>
              )}
            </div>
          </div>

          <div className="border-t-3 border-black pt-3">
            <span className="font-modern text-[11px] font-extrabold uppercase tracking-wider text-black block mb-2">
              WANTS TO LEARN:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user?.skillsWanted && user.skillsWanted.length > 0 ? (
                user.skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-modern font-extrabold uppercase bg-black text-white border-2 border-[#E60023] shadow-max-red"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="font-modern text-xs font-bold text-black">NO SKILLS LISTED YET</span>
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-md bg-white border-4 border-[#E60023] rounded-3xl p-6 shadow-max-black">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-black text-white border-2 border-[#E60023] rounded-full hover:bg-[#E60023] transition-colors"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#E60023] text-white border-2 border-black font-modern font-extrabold text-xs uppercase tracking-widest mb-2">
              <Phone className="w-4 h-4" />
              <span>IDENTITY TRUST VERIFICATION</span>
            </div>

            <h2 className="font-cursive text-xl font-extrabold text-[#E60023] leading-none mb-1">VERIFY MOBILE PHONE</h2>
            <p className="font-modern font-bold text-xs uppercase text-black mb-5">
              {step === 'PHONE'
                ? 'ENTER YOUR MOBILE NUMBER TO RECEIVE A VERIFICATION SECURITY CODE.'
                : `ENTER THE 6-DIGIT OTP CODE SENT TO ${phoneNumber}.`}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-[#E60023] text-white border-3 border-black rounded-xl font-modern font-black text-xs uppercase">
                {error}
              </div>
            )}

            {step === 'PHONE' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block font-modern font-extrabold text-xs uppercase text-[#E60023] mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-extrabold text-xs uppercase shadow-max-black border-2 border-black transition-all active:scale-[0.98]"
                >
                  SEND VERIFICATION OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block font-modern font-extrabold text-xs uppercase text-[#E60023] mb-1">
                    ENTER OTP CODE
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="E.G. 123456"
                    required
                    maxLength={6}
                    className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-center text-lg tracking-widest font-modern font-extrabold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
                  />
                  <p className="font-modern text-[11px] uppercase text-black mt-1 text-center">
                    (MOCK OTP: ENTER ANY CODE LIKE "123456" FOR DEV)
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="w-1/3 py-3 px-3 rounded-xl bg-black hover:bg-slate-900 text-white font-modern font-extrabold text-xs uppercase border-2 border-[#E60023] transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark disabled:opacity-50 text-white font-modern font-extrabold text-xs uppercase shadow-max-black border-2 border-black transition-all active:scale-[0.98]"
                  >
                    {submitting ? (
                      <>
                        <RotateCcwIcon className="w-4 h-4 animate-spin" />
                        <span>VERIFYING...</span>
                      </>
                    ) : (
                      <span>CONFIRM & VERIFY</span>
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