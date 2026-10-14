import { useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { SwipeFeed } from "./components/feed/SwipeFeed";
import { BlogStreakFeed } from "./components/blog/BlogStreakFeed";
import { ChatInterface } from "./components/chat/ChatInterface";
import { ProfilePage } from "./pages/ProfilePage";
import { PhoneGateModal } from "./components/chat/PhoneGateModal";
import { useDualoStore } from "./store/useDualoStore";

export default function App() {
  const [activeTab, setActiveTab] = useState<"AUTH" | "FEED" | "BLOG" | "CHAT" | "PROFILE">("FEED");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Zustand Global Store State & Actions
  const { verifyPhone, chatSession } = useDualoStore();

  const handleOpenChat = () => {
    setActiveTab("CHAT");
  };

  const handlePhoneVerified = () => {
    verifyPhone();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Switcher Bar */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-black text-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_#ff3300] flex gap-1 font-mono text-xs uppercase font-bold overflow-x-auto max-w-[95vw]">
        <button
          type="button"
          onClick={() => setActiveTab("AUTH")}
          className={`px-2.5 py-1.5 transition cursor-pointer ${
            activeTab === "AUTH" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          01_AUTH
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("FEED")}
          className={`px-2.5 py-1.5 transition cursor-pointer ${
            activeTab === "FEED" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          02_FEED
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("BLOG")}
          className={`px-2.5 py-1.5 transition cursor-pointer ${
            activeTab === "BLOG" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          03_STREAK
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("CHAT")}
          className={`px-2.5 py-1.5 transition cursor-pointer ${
            activeTab === "CHAT" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          04_CHAT
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PROFILE")}
          className={`px-2.5 py-1.5 transition cursor-pointer ${
            activeTab === "PROFILE" ? "bg-[#ff3300] text-white" : "hover:bg-zinc-800 text-zinc-400"
          }`}
        >
          05_PROFILE
        </button>
      </div>

      {/* Active Tab Views */}
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
        {activeTab === "PROFILE" && (
          <ProfilePage onOpenPhoneGate={() => setIsPhoneModalOpen(true)} />
        )}
      </div>

      {/* Global Phone Gate Modal */}
      <PhoneGateModal
        isOpen={isPhoneModalOpen}
        onVerified={handlePhoneVerified}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
}