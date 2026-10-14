export interface UserProfileCard {
  id: string;
  fullName: string;
  handle?: string;
  headline: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
  location: string;
  streakDays: number;
}

// Alias for backwards compatibility across existing components
export type SkillProfile = UserProfileCard;

export interface SwipeCardProps {
  profile: UserProfileCard;
  isTop?: boolean;
  onSwipe: (direction: "left" | "right") => void;
}