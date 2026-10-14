import React from "react";
import { Flame, MapPin } from "lucide-react";
import type { UserProfileCard } from "../../types/swipe";

export interface SwipeCardProps {
  profile: UserProfileCard;
  isTop?: boolean;
  onSwipe: (direction: "left" | "right") => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  isTop = false,
}) => {
  return (
    <div
      className={`absolute inset-0 w-full bg-white border-2 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between transition-all duration-200 ${
        isTop ? "z-10 opacity-100" : "z-0 opacity-40 scale-95 pointer-events-none"
      }`}
    >
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

      {/* Footer Navigation Tip */}
      <div className="pt-2 flex justify-between items-center font-mono text-[9px] text-zinc-400 uppercase">
        <span>← SKIP [PASS]</span>
        <span>SWAP [BARTER] →</span>
      </div>
    </div>
  );
};