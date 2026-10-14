import { useState } from "react";
import { AuthPage } from "./pages/AuthPage";
import { SwipeFeed } from "./components/feed/SwipeFeed";
import { BlogStreakFeed } from "./components/blog/BlogStreakFeed";
import { PhoneGateModal } from "./components/chat/PhoneGateModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<"AUTH" | "FEED" | "BLOG">("FEED");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

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
      </div>

      {/* Main View Area */}
      <div className="pt-12">
        {activeTab === "AUTH" && <AuthPage />}
        {activeTab === "FEED" && (
          <SwipeFeed onOpenChatGate={() => setIsPhoneModalOpen(true)} />
        )}
        {activeTab === "BLOG" && <BlogStreakFeed />}
      </div>

      {/* Phone Gate Modal */}
      <PhoneGateModal
        isOpen={isPhoneModalOpen}
        onVerified={() => alert("Phone Verified! Chat unlocked.")}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
}