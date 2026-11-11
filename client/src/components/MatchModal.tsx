import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkles } from 'lucide-react';

interface CandidateProfile {
  id: string;
  fullName: string;
  handle: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface MatchModalProps {
  isOpen: boolean;
  matchId?: string;
  matchedUser?: CandidateProfile | null;
  onClose: () => void;
  onStartChat: (matchId: string) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  matchId,
  matchedUser,
  onClose,
  onStartChat,
}) => {
  if (!isOpen || !matchedUser || !matchId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative w-full max-w-md bg-white border-4 border-[#E60023] shadow-max-black p-6 text-center text-black"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black text-white border-2 border-[#E60023] rounded-full hover:bg-[#E60023] transition-colors"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#E60023] text-white border-2 border-black font-modern font-black text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>MUTUAL SKILL MATCH</span>
          </div>

          <h2 className="font-cursive text-6xl font-black text-[#E60023] leading-none mb-1">
            MUTUAL SKILL MATCH
          </h2>

          <p className="font-modern font-extrabold text-sm uppercase text-black mb-6">
            YOU & @{matchedUser.handle} MATCHED SKILLS
          </p>

          <div className="bg-[#F4F4F4] border-3 border-black p-4 rounded-2xl text-left space-y-3 mb-6 shadow-max-black">
            <div>
              <span className="font-modern text-[10px] font-black text-[#E60023] uppercase tracking-wider block mb-1">
                YOU TEACH THEM:
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedUser.skillsWanted.slice(0, 3).map((s) => (
                  <span key={s} className="px-2.5 py-0.5 bg-[#E60023] text-white font-modern font-extrabold text-xs uppercase">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-black pt-2">
              <span className="font-modern text-[10px] font-black text-black uppercase tracking-wider block mb-1">
                THEY TEACH YOU:
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedUser.skillsOffered.slice(0, 3).map((s) => (
                  <span key={s} className="px-2.5 py-0.5 bg-black text-white font-modern font-extrabold text-xs uppercase">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onStartChat(matchId)}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#E60023] text-white font-modern font-black text-base uppercase tracking-wider border-3 border-black shadow-max-black hover:bg-red-dark active:translate-x-1 active:translate-y-1 transition-all"
            >
              <MessageSquare className="w-5 h-5 stroke-[3]" />
              START CHAT NOW
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-black text-white font-modern font-extrabold text-xs uppercase border-2 border-black hover:bg-slate-900 transition-colors"
            >
              KEEP SWIPING
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};