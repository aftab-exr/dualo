import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { SkillProfile, SwipeDirection } from "../../types/swipe";

interface SwipeCardProps {
  profile: SkillProfile;
  isFront: boolean;
  onSwipe: (direction: SwipeDirection, profile: SkillProfile) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  isFront,
  onSwipe,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  const swapOverlayOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOverlayOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe("right", profile);
    } else if (info.offset.x < -threshold) {
      onSwipe("left", profile);
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 20 : 10,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className={`absolute inset-0 bg-white border-2 border-black p-6 flex flex-col justify-between select-none cursor-grab active:cursor-grabbing shadow-[6px_6px_0px_0px_#000000] transition-transform duration-150 ${
        !isFront ? "scale-[0.96] translate-y-3 opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Dynamic Gesture Overlays */}
      {isFront && (
        <>
          <motion.div
            style={{ opacity: swapOverlayOpacity }}
            className="absolute top-4 left-4 bg-[#ff3300] text-white border-2 border-black font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 z-30 shadow-[2px_2px_0px_0px_#000000]"
          >
            [PROPOSE_SWAP]
          </motion.div>

          <motion.div
            style={{ opacity: skipOverlayOpacity }}
            className="absolute top-4 right-4 bg-black text-white border-2 border-black font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 z-30 shadow-[2px_2px_0px_0px_#000000]"
          >
            [SKIP]
          </motion.div>
        </>
      )}

      {/* Card Header */}
      <div className="space-y-3">
        <div className="flex justify-between items-start border-b-2 border-black pb-3">
          <div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
              LOCATION // {profile.location}
            </span>
            <h2 className="text-2xl font-black tracking-tight text-black uppercase">
              {profile.fullName}
            </h2>
            <p className="text-xs font-semibold text-zinc-700 mt-0.5">
              {profile.headline}
            </p>
          </div>
          <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold">
            🔥 {profile.streakDays}D
          </span>
        </div>

        {/* Bio Pitch */}
        <p className="text-xs leading-relaxed text-zinc-800 border-l-2 border-[#ff3300] pl-3 py-0.5">
          "{profile.bio}"
        </p>
      </div>

      {/* Skill Matrix Grid */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs my-2">
        {/* Offering */}
        <div className="border border-black p-2.5 bg-[#f5f5f5]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
            [OFFERING]
          </span>
          <div className="font-bold text-black space-y-1">
            {profile.skillsOffered.map((s) => (
              <div key={s} className="truncate">• {s}</div>
            ))}
          </div>
        </div>

        {/* Seeking */}
        <div className="border border-black p-2.5 bg-white">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff3300] block mb-1">
            [SEEKING]
          </span>
          <div className="font-bold text-black space-y-1">
            {profile.skillsWanted.map((s) => (
              <div key={s} className="truncate">• {s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="pt-2 border-t border-black flex justify-between items-center font-mono text-[10px] text-zinc-500">
        <span>SWIPE RIGHT TO SWAP</span>
        <ArrowUpRight className="w-4 h-4 text-black" />
      </div>
    </motion.div>
  );
};