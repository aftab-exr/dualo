import React from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Flame, MapPin, Check, X } from "lucide-react";
import type { UserProfileCard } from "../../types/swipe";

export interface SwipeCardProps {
  profile: UserProfileCard;
  isTop?: boolean;
  onSwipe: (direction: "left" | "right") => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  isTop = false,
  onSwipe,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);

  const swapStampOpacity = useTransform(x, [20, 120], [0, 1]);
  const skipStampOpacity = useTransform(x, [-20, -120], [0, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe("right");
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe("left");
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 w-full bg-white border-2 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000000] z-0 opacity-40 scale-95 pointer-events-none flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white font-mono font-black text-xl flex items-center justify-center border-2 border-black">
                {profile.fullName[0]}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-black leading-none">{profile.fullName}</h3>
                <span className="font-mono text-xs text-zinc-500 block mt-0.5">{profile.handle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="absolute inset-0 w-full bg-white border-2 border-black p-5 sm:p-6 shadow-[8px_8px_0px_0px_#000000] z-10 opacity-100 flex flex-col justify-between cursor-grab touch-none select-none"
    >
      {/* Live Touch Feedback Overlay Stamps */}
      <motion.div
        style={{ opacity: swapStampOpacity }}
        className="absolute top-6 right-6 bg-[#ff3300] text-white border-2 border-black font-mono font-black text-sm px-3 py-1 uppercase tracking-widest pointer-events-none rotate-12 z-20 flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]"
      >
        SWAP [BARTER] <Check className="w-4 h-4 stroke-[3]" />
      </motion.div>

      <motion.div
        style={{ opacity: skipStampOpacity }}
        className="absolute top-6 left-6 bg-black text-white border-2 border-black font-mono font-black text-sm px-3 py-1 uppercase tracking-widest pointer-events-none -rotate-12 z-20 flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]"
      >
        <X className="w-4 h-4 text-[#ff3300]" /> SKIP [PASS]
      </motion.div>

      {/* Top Header & Avatar */}
      <div className="space-y-3">
        <div className="flex items-start justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-white font-mono font-black text-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#ff3300]">
              {profile.fullName[0]}
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-black leading-none">
                {profile.fullName}
              </h3>
              <span className="font-mono text-xs text-zinc-500 block mt-0.5">
                {profile.handle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] bg-[#ff3300] text-white px-2 py-1 font-bold border border-black shadow-[1px_1px_0px_0px_#000000]">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{profile.streakDays}D STREAK</span>
          </div>
        </div>

        {/* Location & Role Headline */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-zinc-500 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#ff3300]" /> {profile.location}
          </p>
          <h4 className="font-bold text-xs uppercase text-zinc-800">
            {profile.headline}
          </h4>
        </div>

        {/* Bio Pitch */}
        <p className="font-sans text-xs text-zinc-700 font-medium leading-relaxed border-l-2 border-[#ff3300] pl-3 py-0.5">
          "{profile.bio}"
        </p>
      </div>

      {/* Skill Barter Matrix */}
      <div className="space-y-3 pt-3 border-t-2 border-black font-mono">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">
            [TEACHES // OFFERED]
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.skillsOffered.map((skill) => (
              <span
                key={`offered-${skill}`}
                className="bg-[#ff3300] text-white font-bold text-[11px] px-2.5 py-1 border border-black shadow-[1px_1px_0px_0px_#000000]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">
            [WANTS // LEARNING]
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.skillsWanted.map((skill) => (
              <span
                key={`wanted-${skill}`}
                className="bg-black text-white font-bold text-[11px] px-2.5 py-1 border border-black shadow-[1px_1px_0px_0px_#000000]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="pt-2 flex justify-between items-center font-mono text-[9px] text-zinc-400 uppercase">
        <span>← DRAG LEFT TO PASS</span>
        <span>DRAG RIGHT TO BARTER →</span>
      </div>
    </motion.div>
  );
};