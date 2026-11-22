import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { OverviewPage } from './pages/OverviewPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { InsightsPage } from './pages/InsightsPage';
import { ThemesPage } from './pages/ThemesPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { PrioritizationPage } from './pages/PrioritizationPage';
import { AssistantPage } from './pages/AssistantPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/themes" element={<ThemesPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/prioritization" element={<PrioritizationPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;