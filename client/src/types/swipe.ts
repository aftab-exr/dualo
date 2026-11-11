export interface SkillProfile {
    id: string;
    fullName: string;
    headline: string;
    avatarUrl?: string;
    bio: string;
    skillsOffered: string[];
    skillsWanted: string[];
    location: string;
    streakDays: number;
  }
  
  export type SwipeDirection = "left" | "right";
  
  export interface SwipeFeedState {
    remainingSwipes: number; // Daily quota (e.g., 10 for Free Tier)
    maxSwipes: number;
    matchedProfile: SkillProfile | null; // Triggers "It's a Swap!" match modal
  }