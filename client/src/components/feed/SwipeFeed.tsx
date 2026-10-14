import React, { useState } from "react";
import { 
  Flame, 
  Repeat, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Zap, 
  X, 
  Check 
} from "lucide-react";
import { SwipeCard } from "./SwipeCard";
import { MatchModal } from "./MatchModal";
import { MOCK_PROFILES } from "../../data/mockProfiles";
import { useDualoStore } from "../../store/useDualoStore";
import type { UserProfileCard } from "../../types/swipe";

interface SwipeFeedProps {
  onOpenChatGate: () => void;
}

export const SwipeFeed: React.FC<SwipeFeedProps> = ({ onOpenChatGate }) => {
  const { profile, remainingSwipes, decrementSwipes, streak } = useDualoStore();

  const [cards, setCards] = useState<UserProfileCard[]>(MOCK_PROFILES);
  const [matchedProfile, setMatchedProfile] = useState<UserProfileCard | null>(null);
  const [swipeHistory, setSwipeHistory] = useState<{ name: string; action: "SWAP" | "SKIP" }[]>([]);

  const handleSwipe = (direction: "left" | "right") => {
    if (remainingSwipes <= 0 || cards.length === 0) return;

    const currentCard = cards[cards.length - 1];

    if (direction === "right") {
      // Simulate mutual match trigger
      if (Math.random() > 0.4) {
        setMatchedProfile(currentCard);
      }
      setSwipeHistory((prev) => [
        { name: currentCard.fullName, action: "SWAP" },
        ...prev.slice(0, 4),
      ]);
    } else {
      setSwipeHistory((prev) => [
        { name: currentCard.fullName, action: "SKIP" },
        ...prev.slice(0, 4),
      ]);
    }

    decrementSwipes();
    setCards((prev) => prev.slice(0, prev.length - 1));
  };

  const handleResetDeck = () => {
    setCards(MOCK_PROFILES);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Mobile Top Quota Bar */}
      <div className="lg:hidden flex items-center justify-between bg-black text-white p-3 border-2 border-black font-mono text-xs shadow-[3px_3px_0px_0px_#ff3300]">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-[#ff3300]" />
          <span>QUOTA: {remainingSwipes}/10 SWIPES</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#ff3300]" />
          <span>{streak.currentStreak}D STREAK</span>
        </div>
      </div>

      {/* 12-Column Swiss Modern Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR (Desktop Only): Telemetry & Status */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 font-mono text-xs">
          
          {/* Active Profile Card */}
          <div className="bg-[#f5f5f5] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="font-bold text-black uppercase">[MY_SWAPPER_PROFILE]</span>
              {profile.isPhoneVerified ? (
                <ShieldCheck className="w-4 h-4 text-[#ff3300]" />
              ) : (
                <Lock className="w-4 h-4 text-zinc-400" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white font-bold text-sm flex items-center justify-center border border-black">
                {profile.fullName[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-black uppercase leading-tight">{profile.fullName}</p>
                <p className="text-zinc-500 text-[11px]">{profile.handle}</p>
              </div>
            </div>

            <div className="bg-white border border-black p-2.5 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">[SWIPE_QUOTA_REMAINING]</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-black">{remainingSwipes}</span>
                <span className="text-zinc-500 text-[10px]">/ 10 DAILY FREE</span>
              </div>
            </div>

            {!profile.isPhoneVerified && (
              <button
                type="button"
                onClick={onOpenChatGate}
                className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-2 px-3 border border-black text-[11px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition shadow-[2px_2px_0px_0px_#000000]"
              >
                <Lock className="w-3.5 h-3.5" /> VERIFY PHONE TO CHAT
              </button>
            )}
          </div>

          {/* Active Skill Set Preview */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <span className="font-bold text-black uppercase block border-b border-black pb-1">
              [ACTIVE_BARTER_PAIR]
            </span>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">[YOU_TEACH]</span>
              <div className="flex flex-wrap gap-1">
                {profile.skillsOffered.map((sk) => (
                  <span key={sk} className="bg-[#ff3300] text-white font-bold text-[10px] px-2 py-0.5 border border-black">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">[YOU_SEEK]</span>
              <div className="flex flex-wrap gap-1">
                {profile.skillsWanted.map((sk) => (
                  <span key={sk} className="bg-black text-white font-bold text-[10px] px-2 py-0.5 border border-black">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </aside>

        {/* CENTER COLUMN: Interactive Card Stack Deck */}
        <main className="col-span-1 lg:col-span-6 w-full max-w-md mx-auto flex flex-col items-center">
          
          <div className="w-full relative min-h-[480px] flex items-center justify-center">
            {cards.length > 0 && remainingSwipes > 0 ? (
              cards.map((cardProfile, index) => {
                const isTop = index === cards.length - 1;
                return (
                  <SwipeCard
                    key={cardProfile.id}
                    profile={cardProfile}
                    isTop={isTop}
                    onSwipe={handleSwipe}
                  />
                );
              })
            ) : (
              /* Empty Deck or Quota Exhausted Card */
              <div className="w-full bg-white border-2 border-black p-8 text-center space-y-5 shadow-[8px_8px_0px_0px_#000000]">
                <div className="w-14 h-14 bg-[#ff3300] text-white border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_#000000]">
                  <Zap className="w-7 h-7 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase text-black">
                    {remainingSwipes <= 0 ? "DAILY QUOTA REACHED" : "DECK EXHAUSTED"}
                  </h3>
                  <p className="text-xs text-zinc-600 font-sans font-medium leading-relaxed max-w-xs mx-auto">
                    {remainingSwipes <= 0
                      ? "You've used all 10 free daily swipes. Log a learning streak update in the Streak tab to unlock +5 bonus swipes!"
                      : "You have reviewed all available swapper profiles in your area."}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2 font-mono text-xs">
                  {cards.length === 0 && (
                    <button
                      type="button"
                      onClick={handleResetDeck}
                      className="w-full bg-black hover:bg-[#ff3300] text-white font-bold py-3.5 border-2 border-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
                    >
                      <RefreshCw className="w-4 h-4" /> RELOAD DISCOVERY DECK
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controls / Action Buttons */}
          {cards.length > 0 && remainingSwipes > 0 && (
            <div className="w-full grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleSwipe("left")}
                className="bg-white hover:bg-black hover:text-white text-black font-mono font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px]"
              >
                <X className="w-4 h-4 text-[#ff3300]" /> SKIP [PASS]
              </button>

              <button
                type="button"
                onClick={() => handleSwipe("right")}
                className="bg-[#ff3300] hover:bg-black text-white font-mono font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px]"
              >
                SWAP [BARTER] <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

        </main>

        {/* RIGHT SIDEBAR (Desktop Only): Activity Log & Barter Guidelines */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 font-mono text-xs">
          
          {/* Live Recent Actions */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <span className="font-bold text-black uppercase block border-b border-black pb-1">
              [RECENT_SESSION_LOGS]
            </span>

            {swipeHistory.length > 0 ? (
              <div className="space-y-2">
                {swipeHistory.map((item, idx) => (
                  <div
                    key={`${item.name}-${idx}`}
                    className="flex items-center justify-between bg-[#f5f5f5] p-2 border border-black text-[11px]"
                  >
                    <span className="font-bold text-black truncate max-w-[120px]">{item.name}</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 border text-[9px] ${
                        item.action === "SWAP"
                          ? "bg-[#ff3300] text-white border-black"
                          : "bg-black text-white border-black"
                      }`}
                    >
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px] italic">No swipes in this session yet.</p>
            )}
          </div>

          {/* Barter Protocol Guidelines */}
          <div className="bg-[#f5f5f5] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] space-y-2 font-sans">
            <span className="font-mono font-bold text-black uppercase block border-b border-black pb-1 text-xs">
              [BARTER_RULES]
            </span>
            <ul className="text-xs text-zinc-700 space-y-1.5 leading-snug">
              <li className="flex items-start gap-1.5">
                <span className="font-mono font-bold text-[#ff3300]">•</span>
                <span>Swiping right sends a barter request.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono font-bold text-[#ff3300]">•</span>
                <span>Mutual right swipes open a 1:1 chat session.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-mono font-bold text-[#ff3300]">•</span>
                <span>Verify phone OTP before sending first message.</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>

      {/* Celebration Match Modal */}
      {matchedProfile && (
        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onOpenChat={() => {
            setMatchedProfile(null);
            onOpenChatGate();
          }}
        />
      )}

    </div>
  );
};