import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "../types/profile";
import type { UserStreak, BlogPost } from "../types/blog";
import type { ChatSession, ChatMessage } from "../types/chat";
import { MOCK_BLOG_POSTS } from "../data/mockBlogs";

interface DualoState {
  // 1. Profile & Auth Security
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  verifyPhone: () => void;

  // 2. Daily Swipes Quota
  remainingSwipes: number;
  maxSwipes: number;
  decrementSwipes: () => void;
  addBonusSwipes: (amount: number) => void;
  resetSwipes: () => void;

  // 3. Streak & Learning Logs
  streak: UserStreak;
  posts: BlogPost[];
  addLogPost: (title: string, skillLearned: string, content: string) => void;
  toggleLikePost: (postId: string) => void;

  // 4. 1:1 Chat Session
  chatSession: ChatSession;
  sendMessage: (text: string) => void;
}

export const useDualoStore = create<DualoState>()(
  persist(
    (set) => ({
      // --- INITIAL PROFILE STATE ---
      profile: {
        id: "usr_me",
        fullName: "Alex Johnson",
        handle: "@alex_swapper",
        headline: "Frontend Lead & Creative Technologist",
        bio: "Building Dualo in Swiss Modern style. Looking to trade React & TypeScript knowledge for backend architecture and PostgreSQL design.",
        location: "San Francisco, CA",
        phoneNumber: "+1 (555) 019-2834",
        isPhoneVerified: false,
        streakDays: 7,
        totalSwaps: 12,
        skillsOffered: ["React / Next.js", "TypeScript", "Tailwind CSS"],
        skillsWanted: ["Node.js & APIs", "PostgreSQL", "Docker & DevOps"],
      },

      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      verifyPhone: () =>
        set((state) => ({
          profile: { ...state.profile, isPhoneVerified: true },
          chatSession: { ...state.chatSession, isPhoneVerified: true },
        })),

      // --- INITIAL SWIPES STATE ---
      remainingSwipes: 10,
      maxSwipes: 10,

      decrementSwipes: () =>
        set((state) => ({
          remainingSwipes: Math.max(0, state.remainingSwipes - 1),
        })),

      addBonusSwipes: (amount) =>
        set((state) => ({
          remainingSwipes: state.remainingSwipes + amount,
        })),

      resetSwipes: () =>
        set((state) => ({
          remainingSwipes: state.maxSwipes,
        })),

      // --- INITIAL STREAK & LOGS STATE ---
      streak: {
        currentStreak: 7,
        longestStreak: 12,
        bonusSwipesEarned: 5,
        hasLoggedToday: false,
        weeklyLogHistory: [true, true, true, true, true, true, false],
      },

      posts: MOCK_BLOG_POSTS,

      addLogPost: (title, skillLearned, content) =>
        set((state) => {
          const newPost: BlogPost = {
            id: `b-${Date.now()}`,
            authorName: state.profile.fullName,
            authorHandle: state.profile.handle,
            skillLearned,
            title,
            content,
            createdAt: "JUST NOW",
            streakCount: state.streak.currentStreak + 1,
            likes: 1,
            hasLiked: true,
          };

          const updatedHistory = [...state.streak.weeklyLogHistory];
          updatedHistory[6] = true;

          return {
            posts: [newPost, ...state.posts],
            remainingSwipes: state.remainingSwipes + 5,
            streak: {
              ...state.streak,
              currentStreak: state.streak.currentStreak + 1,
              bonusSwipesEarned: state.streak.bonusSwipesEarned + 5,
              hasLoggedToday: true,
              weeklyLogHistory: updatedHistory,
            },
          };
        }),

      toggleLikePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.hasLiked;
              return {
                ...post,
                hasLiked: !isLiked,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
              };
            }
            return post;
          }),
        })),

      // --- INITIAL CHAT STATE ---
      chatSession: {
        swapId: "swap_101",
        partnerName: "Elena Rostova",
        partnerLocation: "Berlin, DE",
        offeredSkill: "Figma / UI Design",
        wantedSkill: "Node.js & APIs",
        isPhoneVerified: false,
        messages: [
          {
            id: "m-1",
            senderId: "partner",
            text: "Hey! Saw your Node.js profile on Dualo. Ready to swap for Figma UI Design?",
            timestamp: "10:14 AM",
            isMe: false,
          },
        ],
      },

      sendMessage: (text) =>
        set((state) => {
          const newMsg: ChatMessage = {
            id: `m-${Date.now()}`,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: true,
          };

          return {
            chatSession: {
              ...state.chatSession,
              messages: [...state.chatSession.messages, newMsg],
            },
          };
        }),
    }),
    {
      name: "dualo-app-storage", // localStorage Key
      storage: createJSONStorage(() => localStorage),
    }
  )
);