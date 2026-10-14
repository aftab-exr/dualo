export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isMe: boolean;
  }
  
  export interface ChatSession {
    swapId: string;
    partnerName: string;
    partnerLocation: string;
    offeredSkill: string; // Skill you learn from partner
    wantedSkill: string;  // Skill you teach partner
    isPhoneVerified: boolean;
    messages: ChatMessage[];
  }