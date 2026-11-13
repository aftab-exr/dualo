import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Sparkles, ChevronRight, RotateCw } from 'lucide-react';
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'FAILED TO LOAD MATCHES';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
        <div className="w-8 h-8 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-modern font-bold text-xs uppercase text-black">LOADING ACTIVE MATCHES...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto pb-20">
      <header className="p-4 bg-white border-b-4 border-black sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-cursive text-2xl font-extrabold text-[#E60023] tracking-tight">ACTIVE MATCHES</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E60023] text-white border-2 border-black text-xs font-modern font-black uppercase">
              {matches.length}
            </span>
          </div>
          <button
            onClick={fetchMatches}
            className="p-2 text-black hover:bg-[#F4F4F4] rounded-lg border-2 border-black transition-colors"
            title="Refresh Matches"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY NAME OR SKILL..."
            className="w-full bg-white border-3 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
          />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-3">
        {error ? (
          <div className="text-center py-10 bg-white border-4 border-[#E60023] rounded-3xl p-6">
            <p className="font-modern font-black text-xs uppercase text-[#E60023] mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 text-white font-modern font-black text-xs uppercase transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border-4 border-[#E60023] rounded-3xl shadow-max-red">
            <div className="w-14 h-14 rounded-full bg-[#E60023] flex items-center justify-center text-white mb-4 shadow-max-black">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-cursive text-2xl font-extrabold text-[#E60023] mb-1">
              {searchQuery ? 'NO MATCHES FOUND' : 'NO MUTUAL MATCHES YET'}
            </h3>
            <p className="font-modern font-bold text-xs uppercase text-black leading-relaxed max-w-xs mb-6">
              {searchQuery
                ? `NO ACTIVE MATCHES MATCHING "${searchQuery}".`
                : 'KEEP SWIPING ON THE DISCOVERY FEED! WHEN ANOTHER MEMBER SWAPS RIGHT ON YOUR OFFERED SKILLS, THEY WILL APPEAR HERE.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-black text-xs uppercase shadow-max-black transition-all active:scale-95"
              >
                GO TO DISCOVERY FEED
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
                className="group flex items-start gap-3.5 p-3.5 bg-white border-3 border-black rounded-2xl shadow-max-black cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E60023] flex items-center justify-center text-white font-modern font-extrabold text-base shadow-max-black shrink-0 mt-0.5">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-cursive text-xl font-extrabold text-[#E60023] truncate group-hover:text-[#E60023] transition-colors">
                      {user.fullName}
                    </h3>
                    <span className="font-modern text-[11px] uppercase text-black shrink-0 ml-2">
                      {match.lastMessage
                        ? formatTime(match.lastMessage.createdAt)
                        : formatTime(match.createdAt)}
                    </span>
                  </div>

                  <p className="font-modern font-black text-xs uppercase text-black mb-2 truncate">@{user.handle}</p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="font-modern text-[10px] font-black uppercase tracking-wider text-[#E60023]">
                      SWAPPING:
                    </span>
                    {user.skillsOffered.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-modern font-extrabold uppercase bg-[#E60023] text-white border-2 border-black shadow-max-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-black bg-[#F4F4F4] px-2.5 py-1.5 rounded-lg border-2 border-black truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {match.lastMessage
                        ? match.lastMessage.text
                        : 'MATCH CONNECTED. TAP TO START CONVERSATION.'}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-black group-hover:text-[#E60023] shrink-0 self-center transition-colors" />
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};