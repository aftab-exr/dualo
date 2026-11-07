import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { MapPin, Check, X } from 'lucide-react';
import type { CandidateProfile } from '../hooks/useSwipeFeed';

interface SwipeCardProps {
  candidate: CandidateProfile;
  onSwipe: (id: string, action: 'SWAP' | 'SKIP') => void;
  isFrontCard: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ candidate, onSwipe, isFrontCard }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);

  // 1. Dynamic Rotation based on horizontal drag distance (-200px to 200px -> -15deg to 15deg)
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // 2. Dynamic Opacity Overlays for Swipe Right (SWAP - Green) and Swipe Left (SKIP - Red)
  const swapBadgeOpacity = useTransform(x, [20, 120], [0, 1]);
  const skipBadgeOpacity = useTransform(x, [-20, -120], [0, 1]);

  // 3. Touch Drag Release Threshold Handler
  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 120; // Minimum drag distance in pixels
    const velocityThreshold = 400; // Minimum drag speed for quick flicks

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Fly off screen to the RIGHT
      await controls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
      onSwipe(candidate.id, 'SWAP');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Fly off screen to the LEFT
      await controls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
      onSwipe(candidate.id, 'SKIP');
    } else {
      // Snap back to center spring physics
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      });
    }
  };

  // Background stack cards (non-draggable preview)
  if (!isFrontCard) {
    return (
      <div className="absolute inset-0 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl scale-95 translate-y-3 pointer-events-none opacity-60 transition-transform">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-300">{candidate.fullName}</h3>
            <p className="text-slate-500 text-sm">@{candidate.handle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      style={{ x, rotate }}
      animate={controls}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between touch-none select-none cursor-grab z-10"
    >
      {/* Visual Feedback Overlays */}
      <motion.div
        style={{ opacity: swapBadgeOpacity }}
        className="absolute top-6 left-6 z-20 border-4 border-emerald-500 rounded-2xl px-4 py-1.5 rotate-[-15deg] bg-slate-950/40 backdrop-blur-sm pointer-events-none"
      >
        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-2xl tracking-wider">
          <Check className="w-7 h-7 stroke-[3]" />
          <span>SWAP</span>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: skipBadgeOpacity }}
        className="absolute top-6 right-6 z-20 border-4 border-rose-500 rounded-2xl px-4 py-1.5 rotate-[15deg] bg-slate-950/40 backdrop-blur-sm pointer-events-none"
      >
        <div className="flex items-center gap-1.5 text-rose-400 font-black text-2xl tracking-wider">
          <X className="w-7 h-7 stroke-[3]" />
          <span>SKIP</span>
        </div>
      </motion.div>

      {/* Profile Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{candidate.fullName}</h3>
            <p className="text-blue-400 font-medium text-sm">@{candidate.handle}</p>
          </div>
          {candidate.location && (
            <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.location}</span>
            </div>
          )}
        </div>

        {candidate.headline && (
          <p className="text-slate-300 text-sm italic mb-4">"{candidate.headline}"</p>
        )}

        {/* Bio */}
        {candidate.bio && (
          <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
            {candidate.bio}
          </p>
        )}
      </div>

      {/* Skill Tags Section */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Teaches:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skillsOffered.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Wants to learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skillsWanted.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};