import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SwipeDeck } from '../components/SwipeDeck';
import { MatchModal } from '../components/MatchModal';
import { useSwipeFeed } from '../hooks/useSwipeFeed';

export const SwipeScreen: React.FC = () => {
  const navigate = useNavigate();
  const feed = useSwipeFeed();
  const { matchEvent, clearMatchEvent, currentCandidate } = feed;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between py-6 px-4 select-none">
      <header className="flex items-center justify-between max-w-sm mx-auto w-full mb-4">
        <h1 className="font-cursive text-4xl font-extrabold text-[#E60023] tracking-tight flex items-center gap-2">
          <span>DUALO</span>
          <Sparkles className="w-6 h-6 text-[#E60023]" />
        </h1>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <SwipeDeck feed={feed} />
      </main>

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