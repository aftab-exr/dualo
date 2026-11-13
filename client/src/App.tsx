import { useState } from "react";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { LandingScreen } from "./screens/LandingScreen";
import { SwipeDeck } from "./components/SwipeDeck";
import { MatchModal } from "./components/MatchModal";
import { ChatScreen } from "./screens/ChatScreen";
import { MatchesScreen } from "./screens/MatchesScreen";
import { StreaksScreen } from "./screens/StreaksScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";
import { useSwipeFeed } from "./hooks/useSwipeFeed";
import { useAuthStore } from "./store/useAuthStore";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

type TabType = "LANDING" | "AUTH" | "FEED" | "BLOG" | "CHAT" | "PROFILE" | "MATCHES" | "STREAKS";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="w-8 h-8 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="w-8 h-8 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const FeedContent: React.FC = () => {
  const feed = useSwipeFeed();
  const { matchEvent, clearMatchEvent, currentCandidate } = feed;
  const navigate = useNavigate();

  return (
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
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("LANDING");
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const tabMap: Record<string, TabType> = {
      "/": "FEED",
      "/login": "AUTH",
      "/register": "AUTH",
      "/matches": "MATCHES",
      "/chat": "CHAT",
      "/streaks": "STREAKS",
      "/profile": "PROFILE",
    };
    const matchedTab = Object.entries(tabMap).find(([path]) => location.pathname.startsWith(path))?.[1];
    if (matchedTab) setActiveTab(matchedTab);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E60023] selection:text-white flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={useAuthStore.getState().isAuthenticated ? <ProtectedRoute><FeedContent /></ProtectedRoute> : <LandingScreen />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterScreen /></PublicOnlyRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MatchesScreen /></ProtectedRoute>} />
          <Route path="/chat/:matchId" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
          <Route path="/streaks" element={<ProtectedRoute><StreaksScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        </Routes>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        const tabPaths: Record<TabType, string> = {
          LANDING: "/",
          AUTH: "/login",
          FEED: "/",
          BLOG: "/",
          CHAT: "/matches",
          MATCHES: "/matches",
          STREAKS: "/streaks",
          PROFILE: "/profile",
        };
        if (tabPaths[tab]) navigate(tabPaths[tab]);
      }} />
    </div>
  );
}