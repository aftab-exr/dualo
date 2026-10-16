import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { capacitorStorage } from "./capacitorStorage";
import type { UserProfile } from "../types/profile";
import type { ChatSession } from "../types/chat";

interface StreakState {
  currentStreak: number;
  lastUpdatedDate: string;
}

interface DualoStore {
  profile: UserProfile;
  remainingSwipes: number;
  streak: StreakState;
  chatSession: ChatSession;
  
  // Actions
  decrementSwipes: () => void;
  verifyPhone: (phone: string) => void;
  incrementStreak: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const INITIAL_PROFILE: UserProfile = {
  id: "u1_me",
  fullName: "Aaftab Alam",
  handle: "@aaftab_dev",
  headline: "Frontend Lead & Systems Architect",
  bio: "Building Dualo - the skill-barter web and mobile platform. Passionate about modern UI/UX and clean architecture.",
  skillsOffered: ["React / Next.js", "Tailwind CSS", "TypeScript"],
  skillsWanted: ["Node.js & APIs", "PostgreSQL", "Docker & DevOps"],
  location: "New Delhi, IN",
  isPhoneVerified: false,
  phoneNumber: "",
  totalSwaps: 3,
  streakDays: 5,
};

const INITIAL_CHAT: ChatSession = {
  partnerName: "Elena Rostova",
  partnerHandle: "@elena_design",
  partnerSkill: "Figma / UI Design",
  mySkill: "React / Next.js",
  isLocked: true,
  messages: [
    {
      id: "m1",
      senderId: "p1",
      text: "Hey! Loved your React projects on Dualo. Want to barter UI design for React setup?",
      timestamp: "10:42 AM",
      isMe: false,
    },
  ],
};

export const useDualoStore = create<DualoStore>()(
  persist(
    (set) => ({
      profile: INITIAL_PROFILE,
      remainingSwipes: 10,
      streak: {
        currentStreak: 5,
        lastUpdatedDate: new Date().toISOString().split("T")[0],
      },
      chatSession: INITIAL_CHAT,

      decrementSwipes: () =>
        set((state) => ({
          remainingSwipes: Math.max(0, state.remainingSwipes - 1),
        })),

      verifyPhone: (phone: string) =>
        set((state) => ({
          profile: {
            ...state.profile,
            isPhoneVerified: true,
            phoneNumber: phone,
          },
          chatSession: {
            ...state.chatSession,
            isLocked: false,
          },
        })),

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.streak.currentStreak + 1;
          return {
            streak: {
              currentStreak: newStreak,
              lastUpdatedDate: new Date().toISOString().split("T")[0],
            },
            profile: {
              ...state.profile,
              streakDays: newStreak,
            },
            remainingSwipes: state.remainingSwipes + 5,
          };
        }),

      updateProfile: (updated) =>
        set((state) => ({
          profile: { ...state.profile, ...updated },
        })),
    }),
    {
      name: "dualo-app-storage",
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state) => ({
        profile: state.profile,
        remainingSwipes: state.remainingSwipes,
        streak: state.streak,
      }),
    }
  )
);