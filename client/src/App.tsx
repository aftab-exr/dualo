import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { SwipeFeed } from "./components/feed/SwipeFeed";
import { BlogStreakFeed } from "./components/blog/BlogStreakFeed";
import { ChatInterface } from "./components/chat/ChatInterface";
import { ProfilePage } from "./pages/ProfilePage";
import { PhoneGateModal } from "./components/chat/PhoneGateModal";
import { useDualoStore } from "./store/useDualoStore";
import { Repeat, Flame } from "lucide-react";

type TabType = "LANDING" | "AUTH" | "FEED" | "BLOG" | "CHAT" | "PROFILE";

interface NavTab {
  id: TabType;
  label: string;
}

const NAV_TABS: NavTab[] = [
  { id: "LANDING", label: "00_HOME" },
  { id: "AUTH", label: "01_AUTH" },
  { id: "FEED", label: "02_FEED" },
  { id: "BLOG", label: "03_STREAK" },
  { id: "CHAT", label: "04_CHAT" },
  { id: "PROFILE", label: "05_PROFILE" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("LANDING");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const { verifyPhone, chatSession, profile, remainingSwipes } = useDualoStore();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#ff3300] selection:text-white flex flex-col">
      
      {/* Swiss Modern Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-black text-white border-b-2 border-black px-4 lg:px-8 py-3 shadow-[0px_4px_0px_0px_#ff3300]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            type="button"
            onClick={() => setActiveTab("LANDING")} 
            className="flex items-center gap-2 cursor-pointer text-left"
          >
            <div className="w-7 h-7 bg-[#ff3300] border border-white flex items-center justify-center font-black text-xs font-mono">
              D
            </div>
            <div>
              <span className="font-black text-lg tracking-tight uppercase block leading-none">
                DUALO<span className="text-[#ff3300]">.</span>
              </span>
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest hidden sm:block">
                TWO SKILLS, ONE SWAP
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 font-mono text-xs uppercase font-bold overflow-x-auto">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 border border-transparent transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#ff3300] text-white border-white shadow-[2px_2px_0px_0px_#ffffff]"
                    : "hover:bg-zinc-800 text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Telemetry Status Bar */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-xs border-l border-zinc-800 pl-4">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#ff3300]" />
              <span>{profile.streakDays}D STREAK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-white" />
              <span>{remainingSwipes} SWIPES</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Responsive Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "LANDING" && (
          <LandingPage
            onGetStarted={() => setActiveTab("AUTH")}
            onExploreFeed={() => setActiveTab("FEED")}
          />
        )}
        {activeTab === "AUTH" && <AuthPage />}
        {activeTab === "FEED" && (
          <SwipeFeed onOpenChatGate={() => setActiveTab("CHAT")} />
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
      </main>

      {/* Global Phone Verification Security Modal */}
      <PhoneGateModal
        isOpen={isPhoneModalOpen}
        onVerified={verifyPhone}
        onClose={() => setIsPhoneModalOpen(false)}
      />

    </div>
  );
}