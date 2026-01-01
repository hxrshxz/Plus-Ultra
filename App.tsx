import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HabitTrackerProvider } from './context/HabitTrackerContext';
import TodayPage from './pages/TodayPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import MotivationPage from './pages/MotivationPage';
import SettingsPage from './pages/SettingsPage';
import WeightPage from './pages/WeightPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <HabitTrackerProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/motivation" element={<MotivationPage />} />
            <Route path="/weight" element={<WeightPage />} />
          </Route>
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </HashRouter>
    </HabitTrackerProvider>
  );
};

export default App;

