import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Plus, 
  PenTool, 
  ThumbsUp, 
  Check, 
  Calendar, 
  Sparkles, 
  X, 
  ArrowRight 
} from "lucide-react";
import type { BlogPost, UserStreak } from "../../types/blog";
import { MOCK_BLOG_POSTS } from "../../data/mockBlogs";

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export const BlogStreakFeed: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User Streak State
  const [streak, setStreak] = useState<UserStreak>({
    currentStreak: 7,
    longestStreak: 12,
    bonusSwipesEarned: 5,
    hasLoggedToday: false,
    weeklyLogHistory: [true, true, true, true, true, true, false], // Sun is today
  });

  // Form State for New Post
  const [newTitle, setNewTitle] = useState("");
  const [newSkill, setNewSkill] = useState("React / Next.js");
  const [newContent, setNewContent] = useState("");

  const handleLikeToggle = (postId: string) => {
    setPosts((prevPosts: BlogPost[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.hasLiked;
          return {
            ...post,
            hasLiked: !isLiked,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const createdPost: BlogPost = {
      id: `b-${Date.now()}`,
      authorName: "You (Alex)",
      authorHandle: "@alex_swapper",
      skillLearned: newSkill,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: "JUST NOW",
      streakCount: streak.currentStreak + 1,
      likes: 1,
      hasLiked: true,
    };

    // Update posts feed
    setPosts([createdPost, ...posts]);

    // Increment user streak and award +5 swipes
    setStreak((prev: UserStreak) => {
      const updatedHistory = [...prev.weeklyLogHistory];
      updatedHistory[6] = true; // Mark Sunday as complete
      return {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        bonusSwipesEarned: prev.bonusSwipesEarned + 5,
        hasLoggedToday: true,
        weeklyLogHistory: updatedHistory,
      };
    });

    // Reset Form
    setNewTitle("");
    setNewContent("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-white text-black flex flex-col items-center p-4 md:p-6 font-sans selection:bg-[#ff3300] selection:text-white border-x-2 border-black max-w-lg mx-auto">
      
      {/* Swiss Header */}
      <header className="w-full border-b-2 border-black pb-4 space-y-1">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-black tracking-tight text-black uppercase">
            LEARNING_LOGS<span className="text-[#ff3300]">.</span>
          </h1>
          <span className="font-mono text-xs uppercase tracking-widest bg-black text-white px-2 py-0.5 font-bold">
            STREAK_ENGINE
          </span>
        </div>
        <p className="text-xs text-zinc-600 font-medium">
          Log daily swap progress. <span className="font-cursive text-xl text-black font-normal">Earn +5 extra swipes.</span>
        </p>
      </header>

      {/* STREAK WIDGET DASHBOARD */}
      <section className="w-full bg-[#f5f5f5] border-2 border-black p-5 my-4 shadow-[4px_4px_0px_0px_#000000] space-y-4">
        
        {/* Top Streak Stats */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#ff3300] text-white border-2 border-black flex items-center justify-center font-black">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase block tracking-widest">
                [ACTIVE_STREAK]
              </span>
              <h2 className="text-2xl font-black text-black leading-none">
                {streak.currentStreak} DAYS
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-zinc-500 uppercase text-[10px] block">[BONUS_SWIPES]</span>
            <span className="font-extrabold text-[#ff3300] bg-white border border-black px-2 py-0.5 inline-block mt-0.5">
              +{streak.bonusSwipesEarned} EARNED
            </span>
          </div>
        </div>

        {/* 7-Day Calendar Tracker Grid */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 uppercase">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-black" /> THIS WEEK LOGS
            </span>
            <span>{streak.weeklyLogHistory.filter(Boolean).length} / 7 COMPLETED</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 font-mono text-xs">
            {DAYS_OF_WEEK.map((day, idx) => {
              const isLogged = streak.weeklyLogHistory[idx];
              return (
                <div
                  key={`day-${idx}`}
                  className={`border-2 border-black p-2 text-center flex flex-col items-center justify-between transition-colors ${
                    isLogged
                      ? "bg-[#ff3300] text-white font-bold"
                      : "bg-white text-zinc-400"
                  }`}
                >
                  <span className="text-[10px]">{day}</span>
                  <div className="mt-1">
                    {isLogged ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trigger Button: Log Today's Skill */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={streak.hasLoggedToday}
          className={`w-full py-3 px-4 border-2 border-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-[3px_3px_0px_0px_#000000] ${
            streak.hasLoggedToday
              ? "bg-black text-white cursor-default"
              : "bg-[#ff3300] hover:bg-black text-white"
          }`}
        >
          {streak.hasLoggedToday ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              LOGGED TODAY (+5 SWIPES GRANTED)
            </>
          ) : (
            <>
              <PenTool className="w-4 h-4" />
              WRITE TODAY'S LOG (+5 BONUS SWIPES)
            </>
          )}
        </button>
      </section>

      {/* COMMUNITY LOGS FEED */}
      <section className="w-full space-y-4 my-2">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider text-black">
            [COMMUNITY_LOGS]
          </span>
          <span className="text-zinc-500">{posts.length} LOGS</span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-3"
            >
              {/* Post Header */}
              <div className="flex justify-between items-start border-b border-black pb-3 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-black uppercase">{post.authorName}</span>
                    <span className="text-zinc-500 text-[10px]">{post.authorHandle}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#ff3300] block mt-0.5">
                    LEARNED: {post.skillLearned}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[10px] font-bold">
                  <Flame className="w-3 h-3 fill-white" />
                  {post.streakCount}D STREAK
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-black leading-tight">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  "{post.content}"
                </p>
              </div>

              {/* Post Footer Actions */}
              <div className="pt-2 border-t border-zinc-200 flex justify-between items-center font-mono text-[11px]">
                <span className="text-zinc-500 uppercase">{post.createdAt}</span>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => handleLikeToggle(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 border border-black font-bold transition cursor-pointer ${
                    post.hasLiked
                      ? "bg-[#ff3300] text-white border-black"
                      : "bg-[#f5f5f5] text-black hover:bg-black hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CREATE LOG MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-2 border-black p-6 max-w-sm w-full space-y-4 shadow-[8px_8px_0px_0px_#ff3300]"
            >
              <div className="flex justify-between items-center border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff3300]" />
                  <h3 className="text-lg font-black uppercase text-black">
                    LOG TODAY'S LEARNING
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-black hover:text-white border border-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLog} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    [SKILL_CATEGORY]
                  </label>
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full bg-[#f5f5f5] border-2 border-black p-2.5 font-bold text-black focus:outline-none focus:bg-white"
                  >
                    <option value="React / Next.js">React / Next.js</option>
                    <option value="Node.js & APIs">Node.js & APIs</option>
                    <option value="Figma / UI Design">Figma / UI Design</option>
                    <option value="Python & AI">Python & AI</option>
                    <option value="Tailwind CSS">Tailwind CSS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    [LOG_TITLE]
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mastered React Custom Hooks in 1 Hour"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#f5f5f5] border-2 border-black p-2.5 font-bold text-black focus:outline-none focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    [WHAT_YOU_LEARNED_SUMMARY]
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly explain what you learned during today's skill swap session..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-[#f5f5f5] border-2 border-black p-2.5 text-xs text-black font-sans font-medium focus:outline-none focus:bg-white resize-none"
                    required
                  />
                </div>

                <div className="bg-[#f5f5f5] border border-black p-2 text-[10px] text-zinc-600 font-bold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#ff3300]" />
                  REWARD: +5 BONUS SWIPES & STREAK INCREMENT
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff3300] hover:bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#000000] mt-2"
                >
                  PUBLISH LOG & CLAIM REWARD <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swiss Footer */}
      <footer className="w-full border-t border-black pt-3 flex justify-between items-center font-mono text-[11px] text-zinc-600 uppercase mt-auto">
        <span>DAILY_STREAK_ENGINE</span>
        <span>RECIPROCAL_LEARNING</span>
      </footer>

    </div>
  );
};