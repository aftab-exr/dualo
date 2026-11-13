import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Users, ArrowRight, Shield } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto p-6 justify-between border-x-4 border-black">
      <div className="pt-12">
        <div className="text-center mb-12">
          <h1 className="font-cursive text-4xl font-extrabold text-[#E60023] leading-none mb-2 flex items-center justify-center gap-3">
            <span>DUALO</span>
            <Sparkles className="w-8 h-8 text-[#E60023]" />
          </h1>
          <p className="font-modern font-bold text-xs uppercase text-black tracking-wider">SKILL BARTER PLATFORM</p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="p-5 bg-white border-4 border-black shadow-max-red">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#E60023] flex items-center justify-center text-white">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cursive text-xl font-extrabold text-[#E60023]">TRADE SKILLS</h3>
                <p className="font-modern text-xs font-bold text-black uppercase">Teach what you know, learn what you don't</p>
              </div>
            </div>
            <p className="font-modern text-sm font-bold text-black leading-relaxed">
              Offer your expertise in exchange for skills you want to learn. No money — just mutual value.
            </p>
          </div>

          <div className="p-5 bg-white border-4 border-black shadow-max-red">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#E60023] flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cursive text-xl font-extrabold text-[#E60023]">FIND MATCHES</h3>
                <p className="font-modern text-xs font-bold text-black uppercase">Swipe to discover complementary skills</p>
              </div>
            </div>
            <p className="font-modern text-sm font-bold text-black leading-relaxed">
              Swipe right on people who teach what you want to learn. When they swipe right on your skills — it's a match.
            </p>
          </div>

          <div className="p-5 bg-white border-4 border-black shadow-max-red">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#E60023] flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cursive text-xl font-extrabold text-[#E60023]">BUILD TRUST</h3>
                <p className="font-modern text-xs font-bold text-black uppercase">Phone verification + learning streaks</p>
              </div>
            </div>
            <p className="font-modern text-sm font-bold text-black leading-relaxed">
              Verify your identity, log daily learning proofs to earn bonus swipes, and build your barter reputation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-8">
        <Link to="/login" className="block">
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-black text-base shadow-max-black transition-all active:scale-[0.98] border-3 border-black">
            <span>SIGN IN</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <Link to="/register" className="block">
          <button className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-modern font-black text-base border-3 border-[#E60023] transition-all active:scale-[0.98]">
            <span>CREATE ACCOUNT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <p className="text-center font-modern text-xs uppercase text-black">
          BY CONTINUING, YOU AGREE TO DUALO'S TERMS & PRIVACY POLICY
        </p>
      </div>
    </div>
  );
};