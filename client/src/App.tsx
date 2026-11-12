import { useState } from "react";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { SwipeDeck } from "./components/SwipeDeck";
import { MatchModal } from "./components/MatchModal";
import { ChatScreen } from "./screens/ChatScreen";
import { MatchesScreen } from "./screens/MatchesScreen";
import { StreaksScreen } from "./screens/StreaksScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";
import { useSwipeFeed } from "./hooks/useSwipeFeed";
import { useAuthStore } from "./store/useAuthStore";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

type TabType = "LANDING" | "AUTH" | "FEED" | "BLOG" | "CHAT" | "PROFILE" | "MATCHES" | "STREAKS";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("LANDING");
  const navigate = useNavigate();

  const checkAuth = useAuthStore((state) => state.checkAuth);
  const feed = useSwipeFeed();
  const { matchEvent, clearMatchEvent, currentCandidate } = feed;

  // Check auth on app startup
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E60023] selection:text-white flex flex-col">
      {/* Main Responsive Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SwipeDeck feed={feed} />
                <MatchModal
                  isOpen={Boolean(matchEvent?.isMatch)}
                  matchId={matchEvent?.matchId}
                  matchedUser={currentCandidate}
                  onClose={clearMatchEvent}
                  onStartChat={(matchId) => {
                    clearMatchEvent();
                    navigate(`/chat/${matchId}`);
                  }}
                />
              </>
            }
          />
          <Route
            path="/login"
            element={<LoginScreen />}
          />
          <Route
            path="/register"
            element={<RegisterScreen />}
          />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/chat/:matchId" element={<ChatScreen />} />
          <Route path="/streaks" element={<StreaksScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
    </div>
  );
}