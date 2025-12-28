import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestProvider } from './contexts/QuestContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AvailablePage } from './pages/AvailablePage';
import { TrackingPage } from './pages/TrackingPage';
import { CompletePage } from './pages/CompletePage';
import { StatsPage } from './pages/StatsPage';

function App() {
  return (
    <QuestProvider>
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
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </QuestProvider>
  );
}

export default App;
