import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface StreakPost {
  id: string;
  title: string;
  content: string;
  skillTag: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    handle: string;
  };
}

export const StreakScreen: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<StreakPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerSkillTag, setComposerSkillTag] = useState('');

  useEffect(() => {
    fetchStreaks();
  }, []);

  const fetchStreaks = async () => {
    try {
      setLoading(true);
      const data = await api.get<StreakPost[]>('/streaks');
      setPosts(data);
    } catch (err) {
      console.error('Failed to load streaks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostStreak = async () => {
    if (!composerTitle.trim() || !composerContent.trim() || !composerSkillTag.trim()) return;
    try {
      await api.post('/streaks', {
        title: composerTitle,
        content: composerContent,
        skillTag: composerSkillTag,
      });
      setComposerTitle('');
      setComposerContent('');
      setComposerSkillTag('');
      setShowComposer(false);
      fetchStreaks();
    } catch (err) {
      console.error('Failed to post streak:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
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
              <Flame className="w-5 h-5 text-amber-500" />
              Learning Streaks
            </h2>
            <p className="text-xs text-slate-400">Log daily progress, earn bonus swipes</p>
          </div>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Create streak post"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </header>

      {/* Streaks Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-slate-500 py-10 text-sm max-w-md mx-auto">
            <Flame className="w-12 h-12 mx-auto text-amber-500/30 mb-3" />
            <p>No learning streaks yet.</p>
            <p className="mt-1">Be the first to log your daily progress!</p>
            <button
              onClick={() => setShowComposer(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
            >
              <Flame className="w-4 h-4" />
              Create Your First Streak
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 shadow-lg hover:border-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold text-sm">
                    {post.author.fullName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{post.author.fullName}</p>
                    <p className="text-slate-500 text-xs">@{post.author.handle}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  #{post.skillTag}
                </span>
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="text-slate-500 font-medium">+5 Swipes</span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Log Learning Streak</h3>
              <button
                onClick={() => setShowComposer(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  placeholder="What did you build/learn?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Details
                </label>
                <textarea
                  rows={4}
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  placeholder="Describe what you learned, challenges, breakthroughs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Skill Tag
                </label>
                <input
                  type="text"
                  value={composerSkillTag}
                  onChange={(e) => setComposerSkillTag(e.target.value)}
                  placeholder="e.g. React, TypeScript, Figma..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowComposer(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostStreak}
                  disabled={!composerTitle.trim() || !composerContent.trim() || !composerSkillTag.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  <Flame className="w-4 h-4 mr-2 inline" />
                  Post Streak (+5 Swipes)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};