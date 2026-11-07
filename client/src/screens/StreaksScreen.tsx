import React, { useState, useEffect } from 'react';
import { Flame, Plus, Sparkles, X, BookOpen, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

interface StreakAuthor {
  id: string;
  fullName: string;
  handle: string;
}

interface StreakPost {
  id: string;
  title: string;
  content: string;
  skillTag: string;
  createdAt: string;
  author: StreakAuthor;
}

export const StreaksScreen: React.FC = () => {
  const { user, checkAuth } = useAuthStore();
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [skillTag, setSkillTag] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  const fetchStreaks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<StreakPost[]>('/streaks');
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load community streaks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreaks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !skillTag.trim()) return;

    try {
      setSubmitting(true);
      const newPost = await api.post<StreakPost>('/streaks', {
        title: title.trim(),
        content: content.trim(),
        skillTag: skillTag.trim(),
      });

      setPosts((prev) => [newPost, ...prev]);
      setTitle('');
      setSkillTag('');
      setContent('');
      setIsModalOpen(false);
      setRewardMessage('Streak logged! +5 Bonus Swipes added to your quota 🎉');

      // Refresh user profile in Zustand store to reflect updated streakDays & remainingSwipes
      await checkAuth();

      setTimeout(() => setRewardMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit streak post');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white max-w-md mx-auto pb-24 select-none">
      {/* Header */}
      <header className="p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Learning Streaks</span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            </h1>
            <p className="text-xs text-slate-400">Share proof of learning & earn bonus swipes</p>
          </div>

          {/* User Streak Counter Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{user?.streakDays || 0} Days</span>
          </div>
        </div>

        {/* Log Streak Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Log Daily Learning Proof (+5 Swipes)
        </button>
      </header>

      {/* Reward Alert */}
      {rewardMessage && (
        <div className="m-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{rewardMessage}</span>
        </div>
      )}

      {/* Community Feed List */}
      <main className="flex-1 p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-slate-400 text-xs">Fetching community proof feed...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <p className="text-rose-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchStreaks}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/30 border border-slate-800/60 rounded-3xl">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Proof Posts Yet</h3>
            <p className="text-slate-400 text-xs max-w-xs mx-auto mb-4">
              Be the first in the Dualo community to share what you learned today!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-2xl space-y-2.5 shadow-sm"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm">
                    {post.author.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{post.author.fullName}</h4>
                    <p className="text-[11px] text-slate-400">@{post.author.handle}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  #{post.skillTag}
                </span>
              </div>

              {/* Post Title & Content */}
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-1">{post.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <Clock className="w-3 h-3" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal Form for Logging Streak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Daily Learning Proof</span>
            </div>
            <h2 className="text-xl font-black text-white mb-1">Log Today's Progress</h2>
            <p className="text-slate-400 text-xs mb-5">
              Publish a breakdown of what you studied or practiced to extend your streak and receive +5 extra swipes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Skill Tag
                </label>
                <input
                  type="text"
                  value={skillTag}
                  onChange={(e) => setSkillTag(e.target.value)}
                  placeholder="e.g. React, Python, UI Design"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Headline / What you learned
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mastered Framer Motion Gestures"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Takeaways / Proof Notes
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a brief overview of key insights or challenges solved..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish & Claim +5 Swipes</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};