import React, { useState, useEffect } from 'react';
import { Flame, Plus, Sparkles, X, BookOpen, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';
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
      setError(err.message || 'FAILED TO LOAD COMMUNITY STREAKS');
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
      setRewardMessage('STREAK LOGGED! +5 BONUS SWIPES ADDED TO YOUR QUOTA');

      await checkAuth();

      setTimeout(() => setRewardMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'FAILED TO SUBMIT STREAK POST');
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
    <div className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto pb-24 select-none">
      <header className="p-4 bg-white border-b-4 border-black sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-cursive text-2xl font-extrabold text-[#E60023] tracking-tight flex items-center gap-2">
              <span>LEARNING STREAKS</span>
              <Flame className="w-5 h-5 text-[#E60023]" />
            </h1>
            <p className="font-modern font-bold text-xs uppercase text-black">SHARE PROOF OF LEARNING & EARN BONUS SWIPES</p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E60023] text-white border-2 border-black font-modern font-black text-xs uppercase">
            <Flame className="w-4 h-4" />
            <span>{user?.streakDays || 0} DAYS</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-black text-sm shadow-max-black transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          LOG DAILY LEARNING PROOF (+5 SWIPES)
        </button>
      </header>

      {rewardMessage && (
        <div className="m-4 p-3.5 bg-[#E60023] text-white border-3 border-black rounded-2xl flex items-center gap-3 text-xs font-modern font-black uppercase shadow-max-black animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{rewardMessage}</span>
        </div>
      )}

      <main className="flex-1 p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-modern font-bold text-xs uppercase text-black">FETCHING COMMUNITY PROOF FEED...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white border-4 border-[#E60023] rounded-3xl p-6">
            <p className="font-modern font-black text-xs uppercase text-[#E60023] mb-4">{error}</p>
            <button
              onClick={fetchStreaks}
              className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 text-white font-modern font-black text-xs uppercase transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border-4 border-[#E60023] rounded-3xl shadow-max-red">
            <BookOpen className="w-12 h-12 text-black mx-auto mb-3" />
            <h3 className="font-cursive text-xl font-extrabold text-[#E60023] mb-1">NO PROOF POSTS YET</h3>
            <p className="font-modern font-bold text-xs uppercase text-black max-w-xs mx-auto mb-4">
              BE THE FIRST IN THE DUALO COMMUNITY TO SHARE WHAT YOU LEARNED TODAY!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white border-3 border-black rounded-2xl space-y-2.5 shadow-max-red"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E60023] flex items-center justify-center text-white font-modern font-extrabold text-sm shadow-max-black">
                    {post.author.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-cursive text-xs font-extrabold text-[#E60023]">{post.author.fullName}</h4>
                    <p className="font-modern font-black text-[11px] uppercase text-black">@{post.author.handle}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-modern font-extrabold uppercase bg-[#E60023] text-white border-2 border-black">
                  #{post.skillTag}
                </span>
              </div>

              <div>
                <h3 className="font-cursive text-sm font-extrabold text-[#E60023] mb-1">{post.title}</h3>
                <p className="font-modern text-xs font-bold text-black leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-1 font-modern text-[10px] uppercase text-black pt-1 border-t-2 border-black">
                <Clock className="w-3 h-3" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-md bg-white border-4 border-[#E60023] rounded-3xl p-6 shadow-max-black">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black text-white border-2 border-[#E60023] rounded-full hover:bg-[#E60023] transition-colors"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#E60023] text-white border-2 border-black font-modern font-black text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 fill-white" />
              <span>DAILY LEARNING PROOF</span>
            </div>
            <h2 className="font-cursive text-2xl font-extrabold text-[#E60023] leading-none mb-1">LOG TODAY'S PROGRESS</h2>
            <p className="font-modern font-bold text-xs uppercase text-black mb-5">
              PUBLISH A BREAKDOWN OF WHAT YOU STUDIED TO EXTEND YOUR STREAK AND RECEIVE +5 EXTRA SWIPES.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">
                  SKILL TAG
                </label>
                <input
                  type="text"
                  value={skillTag}
                  onChange={(e) => setSkillTag(e.target.value)}
                  placeholder="E.G. REACT, PYTHON, UI DESIGN"
                  required
                  className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
                />
              </div>

              <div>
                <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">
                  HEADLINE / WHAT YOU LEARNED
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.G. MASTERED FRAMER MOTION GESTURES"
                  required
                  className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors"
                />
              </div>

              <div>
                <label className="block font-modern font-black text-xs uppercase text-[#E60023] mb-1">
                  KEY TAKEAWAYS / PROOF NOTES
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="WRITE A BRIEF OVERVIEW OF KEY INSIGHTS OR CHALLENGES SOLVED..."
                  rows={4}
                  required
                  className="w-full bg-white border-3 border-black rounded-xl px-3.5 py-2.5 text-sm font-modern font-bold text-black placeholder-slate-400 focus:outline-none focus:border-[#E60023] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E60023] hover:bg-red-dark text-white font-modern font-black text-sm shadow-max-black transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>PUBLISHING...</span>
                  </>
                ) : (
                  <span>PUBLISH & CLAIM +5 SWIPES</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};