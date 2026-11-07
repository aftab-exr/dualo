import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Sparkles, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface FeedUser {
  id: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Match {
  id: string;
  matchedUser: FeedUser;
  createdAt: string;
  lastMessage?: Message | null;
}

export const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Match[]>('/matches');
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filter matches by name, handle, or skill tags
  const filteredMatches = matches.filter((m) => {
    const q = searchQuery.toLowerCase();
    const u = m.matchedUser;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      u.skillsOffered.some((s) => s.toLowerCase().includes(q)) ||
      u.skillsWanted.some((s) => s.toLowerCase().includes(q))
    );
  });

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-slate-400 text-sm">Loading your active skill swaps...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Skill Matches</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              {matches.length}
            </span>
          </div>
          <button
            onClick={fetchMatches}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Matches"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or skill..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-3">
        {error ? (
          <div className="text-center py-10 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <p className="text-rose-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-900/30 border border-slate-800/60 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {searchQuery ? 'No matches found' : 'No Mutual Matches Yet'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-6">
              {searchQuery
                ? `No active skill swaps matching "${searchQuery}".`
                : 'Keep swiping on the discovery feed! When another member swipes right on your offered skills, they will appear here.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                Go to Discovery Feed
              </button>
            )}
          </div>
        ) : (
          filteredMatches.map((match) => {
            const user = match.matchedUser;
            return (
              <div
                key={match.id}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="group flex items-start gap-3.5 p-3.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl cursor-pointer transition-all active:scale-[0.99]"
              >
                {/* User Avatar Initials */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shrink-0 mt-0.5">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Info Container */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                      {user.fullName}
                    </h3>
                    <span className="text-[11px] text-slate-500 shrink-0 ml-2">
                      {match.lastMessage
                        ? formatTime(match.lastMessage.createdAt)
                        : formatTime(match.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 truncate">@{user.handle}</p>

                  {/* Skills Exchange Pill Preview */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Swapping:
                    </span>
                    {user.skillsOffered.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Last Message Snippet */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/60 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {match.lastMessage
                        ? match.lastMessage.text
                        : 'Match connected! Tap to start conversation.'}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 shrink-0 self-center transition-colors" />
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};