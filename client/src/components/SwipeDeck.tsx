import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Flame } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { useSwipeFeed } from '../hooks/useSwipeFeed';

interface SwipeDeckProps {
  feed?: ReturnType<typeof useSwipeFeed>;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ feed: passedFeed }) => {
  const localFeed = useSwipeFeed();
  const feed = passedFeed || localFeed;
  const {
    currentCandidate,
    remainingCards,
    loading,
    error,
    handleSwipe,
    refetch,
  } = feed;

  const onButtonSwipe = (action: 'SWAP' | 'SKIP') => {
    if (currentCandidate) {
      handleSwipe(currentCandidate.id, action);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="w-10 h-10 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin" />
        <p className="font-modern font-bold text-xs uppercase text-black">FINDING SKILL MATCHES...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-6 text-center bg-white border-4 border-[#E60023] rounded-3xl max-w-sm mx-auto">
        <p className="font-modern font-black text-xs uppercase text-[#E60023] mb-4">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-modern font-black text-xs uppercase transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  if (remainingCards === 0 || !currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center bg-white border-4 border-[#E60023] rounded-3xl max-w-sm mx-auto shadow-max-red">
        <div className="w-16 h-16 rounded-full bg-[#E60023] flex items-center justify-center text-white mb-4 shadow-max-black">
          <Flame className="w-8 h-8" />
        </div>
        <h3 className="font-cursive text-3xl font-black text-[#E60023] mb-2">
          SWAP QUOTA EXHAUSTED
        </h3>
        <p className="font-modern font-bold text-xs uppercase text-black leading-relaxed mb-6 max-w-xs mx-auto">
          YOU'VE SWIPED THROUGH ALL AVAILABLE MATCHES. LOG A DAILY LEARNING PROOF TO EARN BONUS SWIPES.
        </p>

        <button
          onClick={refetch}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-black text-xs uppercase shadow-max-black transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          REFRESH CANDIDATES
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
      <div className="relative w-full h-[460px]">
        <AnimatePresence>
          {currentCandidate && (
            <SwipeCard
              key={currentCandidate.id}
              candidate={currentCandidate}
              onSwipe={handleSwipe}
              isFrontCard={true}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 w-full px-4 pt-2">
        <button
          onClick={() => onButtonSwipe('SKIP')}
          aria-label="Skip Candidate"
          disabled={!currentCandidate}
          className="w-14 h-14 rounded-full bg-black border-3 border-[#E60023] text-[#E60023] flex items-center justify-center shadow-max-red hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={refetch}
          aria-label="Reload Feed"
          className="w-10 h-10 rounded-full bg-black border-3 border-black text-white flex items-center justify-center hover:bg-slate-900 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => onButtonSwipe('SWAP')}
          aria-label="Swap Skill"
          disabled={!currentCandidate}
          className="w-14 h-14 rounded-full bg-[#E60023] text-white flex items-center justify-center shadow-max-black hover:bg-red-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-7 h-7 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};