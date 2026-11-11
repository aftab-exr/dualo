import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { SwipeFeed } from "./components/feed/SwipeFeed";
import { BlogStreakFeed } from "./components/blog/BlogStreakFeed";
import { ChatInterface } from "./components/chat/ChatInterface";
import { ProfilePage } from "./pages/ProfilePage";
import { MatchesFeed } from "./components/matches/MatchesFeed";
import { PhoneGateModal } from "./components/chat/PhoneGateModal";
import { useDualoStore } from "./store/useDualoStore";
import { useAuthStore } from "./store/useAuthStore";
import { BottomNav } from "./components/BottomNav";

type TabType = "LANDING" | "AUTH" | "FEED" | "BLOG" | "CHAT" | "PROFILE" | "MATCHES" | "STREAKS";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("LANDING");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const { verifyPhone, chatSession, setChatSession } = useDualoStore();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ff3300] selection:text-white flex flex-col">
      {/* Main Responsive Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "LANDING" && (
          <LandingPage
            onGetStarted={() => setActiveTab("AUTH")}
            onExploreFeed={() => setActiveTab("FEED")}
          />
        )}
        {activeTab === "AUTH" && (
          <AuthPage onCompleteAuth={() => setActiveTab("FEED")} />
        )}
        {activeTab === "FEED" && (
          <SwipeFeed onOpenChatGate={() => setActiveTab("CHAT")} />
        )}
        {activeTab === "MATCHES" && (
          <MatchesFeed
            onSelectMatch={(session) => {
              setChatSession(session);
              setActiveTab("CHAT");
            }}
            onExploreFeed={() => setActiveTab("FEED")}
          />
        )}
        {(activeTab === "STREAKS" || activeTab === "BLOG") && <BlogStreakFeed />}
        {activeTab === "CHAT" && (
          <ChatInterface
            session={chatSession}
            onBack={() => setActiveTab("MATCHES")}
            onUnlockPhone={() => setIsPhoneModalOpen(true)}
          />
        )}
        {activeTab === "PROFILE" && (
          <ProfilePage onOpenPhoneGate={() => setIsPhoneModalOpen(true)} />
        )}
      </main>

      {/* Global Phone Verification Security Modal */}
      <PhoneGateModal
        isOpen={isPhoneModalOpen}
        onVerified={async (phone) => {
          verifyPhone(phone);
          try {
            await useAuthStore.getState().verifyPhone(phone, "123456");
          } catch {
            // Keep local verification status even if offline
          }
          setIsPhoneModalOpen(false);
        }}
        onClose={() => setIsPhoneModalOpen(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

    </div>
  );
}