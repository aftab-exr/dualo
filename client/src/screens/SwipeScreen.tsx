import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeFeed } from '../hooks/useSwipeFeed';
import { MatchModal } from '../components/MatchModal';

export const SwipeScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentCandidate,
    loading,
    matchEvent,
    clearMatchEvent,
    handleSwipe,
  } = useSwipeFeed();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Swipe Deck Cards Rendered Here */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-400">Loading candidates...</p>
        </div>
      ) : (
        <div className="p-4">
          {/* Card interaction trigger example */}
          {currentCandidate && (
            <button
              onClick={() => handleSwipe(currentCandidate.id, 'SWAP')}
              className="px-6 py-3 bg-emerald-600 rounded-xl font-bold"
            >
              Swipe Right (Swap)
            </button>
          )}
        </div>
      )}

      {/* Match Overlay Modal */}
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