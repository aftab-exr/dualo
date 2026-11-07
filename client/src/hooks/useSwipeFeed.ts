import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface CandidateProfile {
  id: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

export function useSwipeFeed() {
  const [feed, setFeed] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchEvent, setMatchEvent] = useState<{ isMatch: boolean; matchId?: string } | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<CandidateProfile[]>('/feed');
      setFeed(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSwipe = async (targetUserId: string, action: 'SWAP' | 'SKIP') => {
    // Optimistic pop off the visual deck stack
    setFeed((prev) => prev.filter((user) => user.id !== targetUserId));

    try {
      const res = await api.post<{ isMatch: boolean; matchId?: string; remainingSwipes: number }>(
        '/feed/swipe',
        { targetUserId, action }
      );

      if (res.isMatch) {
        setMatchEvent({ isMatch: true, matchId: res.matchId });
      }
    } catch (err: any) {
      console.error('Swipe dispatch error:', err);
    }
  };

  return {
    currentCandidate: feed[0] || null,
    remainingCards: feed.length,
    loading,
    error,
    handleSwipe,
    refetch: fetchFeed,
    matchEvent,
    clearMatchEvent: () => setMatchEvent(null),
  };
}