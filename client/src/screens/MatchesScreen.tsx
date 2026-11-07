import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Loader2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

interface Match {
  id: string;
  matchedUser: {
    id: string;
    fullName: string;
    handle: string;
    headline?: string;
    bio?: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
  };
  createdAt: string;
  lastMessage: {
    id: string;
    matchId: string;
    senderId: string;
    text: string;
    createdAt: string;
  } | null;
}

export const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.get<Match[]>('/matches');
      setMatches(data);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/swipe')}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Matches
            </h2>
            <p className="text-xs text-slate-400">{matches.length} active skill barters</p>
          </div>
        </div>
      </header>

      {/* Matches List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {matches.length === 0 ? (
          <div className="text-center text-slate-500 py-10 text-sm max-w-md mx-auto">
            <MessageSquare className="w-12 h-12 mx-auto text-blue-500/30 mb-3" />
            <p>No matches yet.</p>
            <p className="mt-1">Swipe right on candidates to find reciprocal skill swaps!</p>
            <button
              onClick={() => navigate('/swipe')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              Start Swiping
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <article
              key={match.id}
              className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-4 shadow-lg hover:border-slate-700/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/chat/${match.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold text-base flex-shrink-0">
                    {match.matchedUser.fullName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm truncate">{match.matchedUser.fullName}</h3>
                      <span className="text-slate-500 text-xs whitespace-nowrap">@{match.matchedUser.handle}</span>
                    </div>
                    {match.matchedUser.location && (
                      <p className="text-slate-500 text-xs truncate">{match.matchedUser.location}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>1:1 Chat</span>
                  </div>
                </div>
              </div>

              {/* Skill Tags Preview */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {match.matchedUser.skillsOffered.slice(0, 2).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    Teaches: {skill}
                  </span>
                ))}
                {match.matchedUser.skillsWanted.slice(0, 2).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    Wants: {skill}
                  </span>
                ))}
              </div>

              {/* Last Message Preview */}
              {match.lastMessage && (
                <div className="mt-3 pt-3 border-t border-slate-800/50">
                  <p className="text-slate-400 text-sm leading-relaxed flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">
                      {match.lastMessage.senderId === currentUser?.id ? 'You' : match.matchedUser.fullName}:
                    </span>
                    <span className="truncate">{match.lastMessage.text}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 text-right">
                    {new Date(match.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
};