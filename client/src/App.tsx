import { useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { SwipeFeed } from "./components/feed/SwipeFeed";
import { BlogStreakFeed } from "./components/blog/BlogStreakFeed";
import { ChatInterface } from "./components/chat/ChatInterface";
import { PhoneGateModal } from "./components/chat/PhoneGateModal";
import type { ChatSession } from "./types/chat";

export default function App() {
  const [activeTab, setActiveTab] = useState<"AUTH" | "FEED" | "BLOG" | "CHAT">("FEED");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Active Chat Session State
  const [chatSession, setChatSession] = useState<ChatSession>({
    swapId: "swap_101",
    partnerName: "Elena Rostova",
    partnerLocation: "Berlin, DE",
    offeredSkill: "Figma / UI Design",
    wantedSkill: "Node.js & APIs",
    isPhoneVerified: false, // Locked until phone is verified
    messages: [
      {
        id: "m-1",
        senderId: "partner",
        text: "Hey! Saw your Node.js profile on Dualo. Ready to swap for Figma UI Design?",
        timestamp: "10:14 AM",
        isMe: false,
      },
    ],
  });

  const handleOpenChat = () => {
    setActiveTab("CHAT");
  };

  const handlePhoneVerified = () => {
    setChatSession((prev) => ({ ...prev, isPhoneVerified: true }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Swiss Navigation Tab Switcher Bar */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-black text-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_#ff3300] flex gap-1 font-mono text-xs uppercase font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("AUTH")}
          className={`px-3 py-1.5 transition cursor-pointer ${
            activeTab === "AUTH" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          01_AUTH
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("FEED")}
          className={`px-3 py-1.5 transition cursor-pointer ${
            activeTab === "FEED" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          02_FEED
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("BLOG")}
          className={`px-3 py-1.5 transition cursor-pointer ${
            activeTab === "BLOG" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          03_STREAK
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("CHAT")}
          className={`px-3 py-1.5 transition cursor-pointer ${
            activeTab === "CHAT" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          04_CHAT
        </button>
      </div>

      {/* Main View Routing */}
      <div className="pt-12">
        {activeTab === "AUTH" && <AuthPage />}
        {activeTab === "FEED" && (
          <SwipeFeed onOpenChatGate={handleOpenChat} />
        )}
        {activeTab === "BLOG" && <BlogStreakFeed />}
        {activeTab === "CHAT" && (
          <ChatInterface
            session={chatSession}
            onBack={() => setActiveTab("FEED")}
            onUnlockPhone={() => setIsPhoneModalOpen(true)}
          />
        )}
      </div>

      {/* Global Security Gate Phone Modal */}
      <PhoneGateModal
        isOpen={isPhoneModalOpen}
        onVerified={handlePhoneVerified}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
}