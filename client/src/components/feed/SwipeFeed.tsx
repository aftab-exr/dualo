import React, { useState } from "react";
import { RefreshCw, X, Check, Lock, Sparkles, ArrowRight } from "lucide-react";
import { SwipeCard } from "./SwipeCard";
import { MOCK_PROFILES } from "../../data/mockProfiles";
import type { SkillProfile, SwipeDirection } from "../../types/swipe";

interface SwipeFeedProps {
  onOpenChatGate: () => void;
}

export const SwipeFeed: React.FC<SwipeFeedProps> = ({ onOpenChatGate }) => {
  const [profiles, setProfiles] = useState<SkillProfile[]>(MOCK_PROFILES);
  const [remainingSwipes, setRemainingSwipes] = useState<number>(10);
  const [matchedProfile, setMatchedProfile] = useState<SkillProfile | null>(null);

  const handleSwipe = (direction: SwipeDirection, profile: SkillProfile) => {
    if (remainingSwipes <= 0) return;

    setRemainingSwipes((prev) => Math.max(0, prev - 1));
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));

    if (direction === "right" && Math.random() > 0.4) {
      setMatchedProfile(profile);
    }
  };

  const currentProfile = profiles[profiles.length - 1];
  const nextProfile = profiles[profiles.length - 2];

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      
      {/* Swiss Bar Navigation */}
      <header className="w-full border-b-2 border-black pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase">
            DUALO<span className="text-[#ff3300]">.</span>
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 uppercase">SWIPE_DISCOVERY_ENGINE</p>
        </div>

        {/* Daily Quota Counter */}
        <div className="bg-[#f5f5f5] border-2 border-black px-3 py-1 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]">
          <span className="text-[#ff3300]">{remainingSwipes}</span>
          <span className="text-zinc-500">/ 10 FREE</span>
        </div>
      </header>

      {/* Main Card Container */}
      <main className="w-full max-w-sm h-[460px] relative my-auto flex items-center justify-center">
        {remainingSwipes <= 0 ? (
          /* Quota Limit Reached */
          <div className="bg-white border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0px_0px_#000000]">
            <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#ff3300]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black">QUOTA EXHAUSTED</h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Daily quota depleted. Submit a learning log to extend your streak and receive +5 bonus swipes.
            </p>
            <button
              type="button"
              onClick={() => alert("Redirecting to Blog Section...")}
              className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3 border-2 border-black text-xs uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
            >
              WRITE LOG FOR +5 SWIPES
            </button>
          </div>
        ) : profiles.length > 0 ? (
          /* Active Deck */
          <>
            {nextProfile && (
              <SwipeCard
                key={nextProfile.id}
                profile={nextProfile}
                isFront={false}
                onSwipe={handleSwipe}
              />
            )}
            {currentProfile && (
              <SwipeCard
                key={currentProfile.id}
                profile={currentProfile}
                isFront={true}
                onSwipe={handleSwipe}
              />
            )}
          </>
        ) : (
          /* Deck Exhausted */
          <div className="bg-white border-2 border-black p-6 text-center space-y-4 shadow-[6px_6px_0px_0px_#000000]">
            <h3 className="text-lg font-black uppercase text-black">STACK EXHAUSTED</h3>
            <p className="text-xs text-zinc-600 font-medium">
              No additional profiles match your immediate filters.
            </p>
            <button
              type="button"
              onClick={() => setProfiles(MOCK_PROFILES)}
              className="bg-black text-white font-bold px-5 py-3 border-2 border-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-[3px_3px_0px_0px_#ff3300]"
            >
              <RefreshCw className="w-3.5 h-3.5" /> RE-POPULATE STACK
            </button>
          </div>
        )}
      </main>

      {/* Action Controls Bar */}
      <footer className="w-full max-w-sm flex justify-center items-center gap-6 py-3 border-t-2 border-black">
        <button
          type="button"
          disabled={!currentProfile || remainingSwipes <= 0}
          onClick={() => currentProfile && handleSwipe("left", currentProfile)}
          className="w-14 h-14 bg-white border-2 border-black text-black hover:bg-black hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-30 shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="Skip"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          type="button"
          disabled={!currentProfile || remainingSwipes <= 0}
          onClick={() => currentProfile && handleSwipe("right", currentProfile)}
          className="w-16 h-16 bg-[#ff3300] hover:bg-black text-white border-2 border-black flex items-center justify-center transition cursor-pointer disabled:opacity-30 shadow-[4px_4px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="Propose Swap"
        >
          <Check className="w-7 h-7 stroke-[3]" />
        </button>
      </footer>

      {/* Mutual Match Modal */}
      {matchedProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white border-2 border-black p-6 max-w-sm w-full space-y-4 shadow-[8px_8px_0px_0px_#ff3300] text-center">
            <div className="w-12 h-12 bg-[#ff3300] text-white border-2 border-black flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase text-black">MUTUAL SWAP MATCH!</h3>
              <p className="text-xs text-zinc-600 font-medium">
                You and <span className="font-bold text-black">{matchedProfile.fullName}</span> both expressed skill swap interest.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMatchedProfile(null);
                onOpenChatGate();
              }}
              className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000000]"
            >
              INITIALIZE 1:1 CHAT <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMatchedProfile(null)}
              className="font-mono text-xs text-zinc-500 hover:text-black uppercase underline cursor-pointer"
            >
              [CONTINUE_SWIPING]
            </button>
          </div>
        </div>
      )}

    </div>
  );
};