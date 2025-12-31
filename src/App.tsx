import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestProvider, useQuests } from './contexts/QuestContext';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { AvailablePage } from './pages/AvailablePage';
import { TrackingPage } from './pages/TrackingPage';
import { CompletePage } from './pages/CompletePage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { milestoneNotification, dismissMilestoneNotification } = useQuests();

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/available" element={<AvailablePage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* Toast Notifications */}
        {milestoneNotification && (
          <Toast
            notification={milestoneNotification}
            onDismiss={dismissMilestoneNotification}
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <QuestProvider>
      <AppContent />
    </QuestProvider>
  );
}

export default App;
