export interface UserProfile {
    id: string;
    fullName: string;
    handle: string;
    headline: string;
    bio: string;
    location: string;
    phoneNumber: string;
    isPhoneVerified: boolean;
    streakDays: number;
    totalSwaps: number;
    skillsOffered: string[];
    skillsWanted: string[];
  }