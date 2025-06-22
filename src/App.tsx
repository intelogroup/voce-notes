import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Alarms from './pages/Alarms';
import Settings from './pages/Settings';
import NotesPage from './pages/Notes';
import Chat from './pages/Chat';
import Record from './pages/Record';
import { MainLayout } from './components/MainLayout';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import SpaceDetail from '@/pages/SpaceDetail';
import NotFound from './pages/NotFound';
import AudioBank from './pages/AudioBank';

function App() {

  return (
    <ThemeProvider storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="record" element={<Record />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="notes/:spaceId" element={<SpaceDetail />} />
              <Route path="chat" element={<Chat />} />
              <Route path="alarms" element={<Alarms />} />
              <Route path="alarms/bank" element={<AudioBank />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
