export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatSession {
  partnerName: string;
  partnerHandle?: string;
  partnerSkill: string;
  mySkill: string;
  isLocked: boolean;
  messages: ChatMessage[];
}