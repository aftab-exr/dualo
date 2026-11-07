import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, X } from 'lucide-react';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>It's a Skill Swap!</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Mutual Match!
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            You and <span className="text-white font-medium">@{matchedUser.handle}</span> swiped right on each other's skills.
          </p>

          {/* Skill Exchange Preview */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 mb-6 text-left space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                You offer:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedUser.skillsWanted.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                They offer:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedUser.skillsOffered.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onStartChat(matchId)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              Start Skill Exchange Chat
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};