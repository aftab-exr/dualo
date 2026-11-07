import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Flame } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { useSwipeFeed } from '../hooks/useSwipeFeed';

interface SwipeDeckProps {
  onMatch?: (matchId: string) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = () => {
  const {
    currentCandidate,
    remainingCards,
    loading,
    error,
    handleSwipe,
    refetch,
  } = useSwipeFeed();

  // Trigger swipe action programmatically via action buttons
  const onButtonSwipe = (action: 'SWAP' | 'SKIP') => {
    if (currentCandidate) {
      handleSwipe(currentCandidate.id, action);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Finding potential skill matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-6 text-center bg-slate-900/50 border border-slate-800 rounded-3xl max-w-sm mx-auto">
        <p className="text-rose-400 font-medium mb-4">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty Feed State
  if (remainingCards === 0 || !currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl max-w-sm mx-auto shadow-xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
          <Flame className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-2">Queue Exhausted!</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          You've swiped through all available matches for now. Log a daily learning streak to earn bonus swipes or check back later!
        </p>

        <button
          onClick={refetch}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
      {/* Cards Container Stack */}
      <div className="relative w-full h-[460px]">
        <AnimatePresence>
          {/* Active Front Card */}
          <SwipeCard
            key={currentCandidate.id}
            candidate={currentCandidate}
            onSwipe={handleSwipe}
            isFrontCard={true}
          />
        </AnimatePresence>
      </div>

      {/* Button Controls Bar */}
      <div className="flex items-center justify-center gap-6 w-full px-4 pt-2">
        {/* SKIP / Pass Button */}
        <button
          onClick={() => onButtonSwipe('SKIP')}
          aria-label="Skip Candidate"
          className="w-14 h-14 rounded-full bg-slate-900 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-500/10 hover:border-rose-500 transition-all active:scale-95"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Reload Feed Button */}
        <button
          onClick={refetch}
          aria-label="Reload Feed"
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center hover:text-white hover:border-slate-500 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* SWAP / Match Right Button */}
        <button
          onClick={() => onButtonSwipe('SWAP')}
          aria-label="Swap Skill"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all active:scale-95"
        >
          <Check className="w-7 h-7 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};