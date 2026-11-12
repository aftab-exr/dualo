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

  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const swapBadgeOpacity = useTransform(x, [20, 120], [0, 1]);
  const skipBadgeOpacity = useTransform(x, [-20, -120], [0, 1]);

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 120;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(candidate.id, 'SWAP');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(candidate.id, 'SKIP');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 25 } });
    }
  };

  if (!isFrontCard) {
    return (
      <div className="absolute inset-0 bg-white border-4 border-black shadow-max-white scale-95 translate-y-4 pointer-events-none opacity-40">
        <h3 className="font-cursive text-4xl text-red">{candidate.fullName}</h3>
      </div>
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      animate={controls}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-white border-4 border-black shadow-max-red flex flex-col justify-between touch-none select-none cursor-grab z-10 text-black"
    >
      {/* SWAP / PASS Maximalist Badges */}
      <motion.div
        style={{ opacity: swapBadgeOpacity }}
        className="absolute top-5 left-5 z-20 bg-[#E60023] text-white border-3 border-black px-4 py-1 rotate-[-12deg] shadow-max-black pointer-events-none"
      >
        <div className="flex items-center gap-1.5 font-modern font-black text-2xl tracking-tighter uppercase">
          <Check className="w-7 h-7 stroke-[4]" />
          <span>SWAP IT</span>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: skipBadgeOpacity }}
        className="absolute top-5 right-5 z-20 bg-black text-white border-3 border-[#E60023] px-4 py-1 rotate-[12deg] shadow-max-red pointer-events-none"
      >
        <div className="flex items-center gap-1.5 font-modern font-black text-2xl tracking-tighter uppercase">
          <X className="w-7 h-7 stroke-[4]" />
          <span>PASS</span>
        </div>
      </motion.div>

      {/* Profile Header */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="font-cursive text-5xl font-extrabold text-[#E60023] leading-none tracking-wide">
            {candidate.fullName}
          </h2>
          {candidate.location && (
            <span className="flex items-center gap-1 text-xs font-modern font-black uppercase bg-[#E60023] text-white px-2.5 py-1 rounded-full border-2 border-black">
              <MapPin className="w-3 h-3" />
              {candidate.location}
            </span>
          )}
        </div>

        <p className="font-modern font-black text-sm tracking-wider uppercase text-black mb-3">
          @{candidate.handle}
        </p>

        {candidate.headline && (
          <p className="font-cursive text-2xl text-black leading-snug mb-3">
            "{candidate.headline}"
          </p>
        )}

        {candidate.bio && (
          <p className="font-modern text-xs font-bold text-slate-800 line-clamp-3 leading-relaxed border-l-4 border-[#E60023] pl-3 my-2">
            {candidate.bio}
          </p>
        )}

        {/* Avatar placeholder */}
        {candidate.avatarUrl && (
          <div className="mt-3 mb-3">
            <img 
              src={candidate.avatarUrl} 
              alt={`${candidate.fullName}'s avatar`}
              className="w-20 h-20 rounded-full mx-auto border-2 border-black object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Maximalist Skills Blocks */}
      <div className="space-y-3 pt-3 border-t-4 border-black">
        <div>
          <span className="font-modern text-[11px] font-black uppercase tracking-widest text-[#E60023] block mb-1">
            TEACHES:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skillsOffered && candidate.skillsOffered.length > 0 ? (
              candidate.skillsOffered.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-[#E60023] text-white font-modern font-extrabold text-xs uppercase border-2 border-black shadow-max-black"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="font-modern text-xs font-bold text-slate-500 uppercase">No skills listed</span>
            )}
          </div>
        </div>

        <div>
          <span className="font-modern text-[11px] font-black uppercase tracking-widest text-black block mb-1">
            WANTS TO LEARN:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skillsWanted && candidate.skillsWanted.length > 0 ? (
              candidate.skillsWanted.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-black text-white font-modern font-extrabold text-xs uppercase border-2 border-[#E60023] shadow-max-red"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="font-modern text-xs font-bold text-slate-500 uppercase">No skills listed</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};