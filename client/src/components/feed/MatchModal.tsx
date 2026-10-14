import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import type { SkillProfile } from "../../types/swipe";

interface MatchModalProps {
  matchedProfile: SkillProfile | null;
  onClose: () => void;
  onOpenChat: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchedProfile,
  onClose,
  onOpenChat,
}) => {
  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex justify-center items-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl p-7 max-w-sm w-full space-y-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Top Icon Badge */}
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              It's a <span className="font-cursive text-4xl text-white font-normal">Swap!</span>
            </h2>
            <p className="text-xs text-zinc-400">
              You and <span className="text-white font-semibold">{matchedProfile.fullName}</span> both expressed interest in exchanging skills.
            </p>
          </div>

          {/* Profile Quick Pill */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center font-bold text-white">
              {matchedProfile.fullName[0]}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{matchedProfile.fullName}</h4>
              <p className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                {matchedProfile.skillsOffered[0]} ↔ {matchedProfile.skillsWanted[0]}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={onOpenChat}
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Open 1:1 Skill Chat
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-xs text-zinc-500 hover:text-zinc-300 py-2 cursor-pointer"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};