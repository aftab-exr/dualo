import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SwipeScreen } from './screens/SwipeScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfilePage } from './pages/ProfilePage';
import { StreakScreen } from './screens/StreakScreen';
import { MatchesScreen } from './screens/MatchesScreen';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => {}} onExploreFeed={() => {}} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<PrivateRoute><SwipeScreen /></PrivateRoute>}>
            <Route path="/swipe" element={<SwipeScreen />} />
          </Route>
          <Route element={<PrivateRoute><ChatScreen /></PrivateRoute>}>
            <Route path="/chat/:matchId" element={<ChatScreen />} />
          </Route>
          <Route element={<PrivateRoute><MatchesScreen /></PrivateRoute>}>
            <Route path="/matches" element={<MatchesScreen />} />
          </Route>
          <Route element={<PrivateRoute><StreakScreen /></PrivateRoute>}>
            <Route path="/streaks" element={<StreakScreen />} />
          </Route>
          <Route element={<PrivateRoute><ProfilePage onOpenPhoneGate={() => {}} /></PrivateRoute>}>
            <Route path="/profile" element={<ProfilePage onOpenPhoneGate={() => {}} />} />
          </Route>
          <Route path="*" element={<Navigate to="/swipe" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}