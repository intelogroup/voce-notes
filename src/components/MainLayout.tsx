import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './top-navigation-bar';
import { EnhancedMobileNavigation } from './enhanced-mobile-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAlarmStore } from '@/store/alarmStore';
import { ActiveAlarmModal } from './ui/active-alarm-modal';
import { SpaceSelectionModal } from './ui/space-selection-modal';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { activeAlarmId, alarms, setActiveAlarm, setSnoozedAlarm } = useAlarmStore();

  const activeAlarm = alarms.find(a => a.id === activeAlarmId);

  const handleSnooze = () => {
    if (activeAlarmId) {
        setSnoozedAlarm(activeAlarmId);
        setActiveAlarm(null);
        console.log(`Alarm ${activeAlarmId} snoozed.`);
    }
  };

  const handleStop = () => {
    // We just stop the UI for now. Real logic would stop the sound.
    setActiveAlarm(null);
  };
  
  const getTitle = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    if (path === 'dashboard') return 'Dashboard';
    if (path === 'notes') return 'Notes';
    if (path === 'alarms') return 'Alarms';
    if (path === 'settings') return 'Settings';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNavigationBar title={getTitle()} />
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
      {isMobile && <EnhancedMobileNavigation />}

      <ActiveAlarmModal
        alarm={activeAlarm || null}
        onSnooze={handleSnooze}
        onStop={handleStop}
      />
      <SpaceSelectionModal />
    </div>
  );
};

export default MainLayout; 