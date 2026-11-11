export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  isPhoneVerified: boolean;
  phoneNumber?: string;
  streakDays: number;
  totalSwaps: number;
  remainingSwipes: number;
  skillsOffered: string[];
  skillsWanted: string[];
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfileResponse;
}

export interface FeedUserResponse {
  id: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

export interface SwipeRequest {
  targetUserId: string;
  action: 'SWAP' | 'SKIP';
}

export interface SwipeResponse {
  isMatch: boolean;
  matchId?: string;
  remainingSwipes: number;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface MatchResponse {
  id: string;
  matchedUser: FeedUserResponse;
  createdAt: string;
  lastMessage?: ChatMessage;
}