import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SwipeDeck } from '../components/SwipeDeck';
import { MatchModal } from '../components/MatchModal';
import { useSwipeFeed } from '../hooks/useSwipeFeed';

export const SwipeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { matchEvent, clearMatchEvent, currentCandidate } = useSwipeFeed();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between py-6 px-4 select-none">
      {/* Header */}
      <header className="flex items-center justify-between max-w-sm mx-auto w-full mb-4">
        <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <span>DUALO</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            BARTER
          </span>
        </h1>
      </header>

      {/* Main Card Deck */}
      <main className="flex-1 flex items-center justify-center">
        <SwipeDeck />
      </main>

      {/* Match Overlay */}
      <MatchModal
        isOpen={Boolean(matchEvent?.isMatch)}
        matchId={matchEvent?.matchId}
        matchedUser={currentCandidate}
        onClose={clearMatchEvent}
        onStartChat={(matchId) => {
          clearMatchEvent();
          navigate(`/chat/${matchId}`);
        }}
      />
    </div>
  );
};