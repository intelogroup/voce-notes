import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Alarms from './pages/Alarms';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Notes from './pages/Notes';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import { MainLayout } from './components/MainLayout';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/alarms" element={<Alarms />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
