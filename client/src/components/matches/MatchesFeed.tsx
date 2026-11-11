import React, { useState, useEffect } from "react";
import { MessageSquare, Sparkles, ArrowRight, Search, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import type { ChatSession } from "../../types/chat";

interface FeedUser {
  id: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  avatarUrl?: string;
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

interface MatchesFeedProps {
  onSelectMatch: (session: ChatSession) => void;
  onExploreFeed: () => void;
}

export const MatchesFeed: React.FC<MatchesFeedProps> = ({
  onSelectMatch,
  onExploreFeed,
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.get<Match[]>("/matches");
      setMatches(data || []);
    } catch {
      // Graceful fallback to empty state
      setMatches([]);
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
    if (!u) return false;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      (u.skillsOffered && u.skillsOffered.some((s) => s.toLowerCase().includes(q))) ||
      (u.skillsWanted && u.skillsWanted.some((s) => s.toLowerCase().includes(q)))
    );
  });

  const handleOpenMatch = (match: Match) => {
    const u = match.matchedUser;
    const session: ChatSession = {
      swapId: match.id,
      partnerName: u.fullName || "Partner",
      partnerLocation: u.location || "Remote",
      offeredSkill: u.skillsOffered?.[0] || "General Skills",
      wantedSkill: u.skillsWanted?.[0] || "Collaboration",
      partnerSkill: u.skillsOffered?.[0],
      mySkill: u.skillsWanted?.[0],
      isPhoneVerified: true,
      messages: match.lastMessage
        ? [
            {
              id: match.lastMessage.id,
              senderId: match.lastMessage.senderId,
              text: match.lastMessage.text,
              timestamp: new Date(match.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isMe: false,
            },
          ]
        : [],
    };
    onSelectMatch(session);
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col justify-between items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      {/* Swiss Header Bar */}
      <header className="w-full border-b-2 border-black pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black uppercase">
              MATCHES<span className="text-[#ff3300]">.</span>
            </h1>
            <p className="font-mono text-[10px] text-zinc-500 uppercase">
              ACTIVE_SWAP_CHANNELS
            </p>
          </div>
          <div className="bg-[#f5f5f5] border-2 border-black px-3 py-1 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]">
            <span className="text-[#ff3300]">{matches.length}</span>
            <span className="text-zinc-500">ACTIVE</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_NAME_OR_SKILL..."
            className="w-full bg-[#f5f5f5] border-2 border-black pl-9 pr-3 py-2 text-xs font-mono uppercase text-black placeholder:text-zinc-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000000]"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 my-4 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-[#ff3300] animate-spin" />
            <span className="font-mono text-xs uppercase font-bold text-zinc-500">
              [SYNCING_MATCHES...]
            </span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white border-2 border-black p-8 text-center space-y-4 shadow-[6px_6px_0px_0px_#000000] my-8">
            <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#ff3300]">
              <Sparkles className="w-6 h-6 text-[#ff3300]" />
            </div>
            <h3 className="text-lg font-black uppercase text-black">
              {searchQuery ? "NO MATCHES FOUND" : "NO ACTIVE MATCHES YET"}
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed max-w-xs mx-auto">
              {searchQuery
                ? `No mutual matches matching "${searchQuery}".`
                : "Swipe right on creators in the discovery feed. When interests align, your 1:1 chat will appear here."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={onExploreFeed}
                className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3 px-4 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000000] transition"
              >
                DISCOVER SKILLS ON FEED
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          filteredMatches.map((match) => {
            const u = match.matchedUser;
            return (
              <div
                key={match.id}
                onClick={() => handleOpenMatch(match)}
                className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#ff3300] transition cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-black text-white border-2 border-black flex items-center justify-center font-bold text-sm font-mono shrink-0">
                      {u.fullName ? u.fullName[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-black">
                        {u.fullName}
                      </h4>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        @{u.handle} // {u.location || "REMOTE"}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] bg-[#f5f5f5] border border-black px-1.5 py-0.5 font-bold uppercase">
                    ACTIVE
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-mono text-[10px] text-[#ff3300] font-bold uppercase">
                    OFFERS:
                  </span>
                  {u.skillsOffered?.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="bg-black text-white text-[10px] font-mono px-2 py-0.5 border border-black font-bold uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="bg-[#f5f5f5] border border-black p-2 flex items-center justify-between text-xs font-mono text-zinc-700">
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#ff3300] shrink-0" />
                    <span className="truncate text-[11px]">
                      {match.lastMessage
                        ? match.lastMessage.text
                        : "Match connected! Tap to exchange skills."}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-black shrink-0 ml-2" />
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Swiss Footer */}
      <footer className="w-full border-t border-black pt-3 flex justify-between items-center font-mono text-[11px] text-zinc-600 uppercase">
        <span>SWISS_BAUHAUS_STYLE</span>
        <span>PEER_TO_PEER_MATCHES</span>
      </footer>
    </div>
  );
};

