export interface BlogPost {
    id: string;
    authorName: string;
    authorHandle: string;
    skillLearned: string;
    title: string;
    content: string;
    createdAt: string;
    streakCount: number;
    likes: number;
    hasLiked?: boolean;
  }
  
  export interface UserStreak {
    currentStreak: number;
    longestStreak: number;
    bonusSwipesEarned: number;
    hasLoggedToday: boolean;
    weeklyLogHistory: boolean[]; // 7 booleans for [M, T, W, T, F, S, S]
  }