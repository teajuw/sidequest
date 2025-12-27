import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from './contexts/QuestContext';
import { Navigation } from './components/Navigation';
import { QuestBoard } from './pages/QuestBoard';
import { StatsPage } from './pages/StatsPage';

function App() {
  return (
    <QuestProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg">
          <Navigation />
          <Routes>
            <Route path="/" element={<QuestBoard />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </Router>
    </QuestProvider>
  );
}

export default App;
