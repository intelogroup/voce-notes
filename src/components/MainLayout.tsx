import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';
import { TopNavigationBar } from '@/components/top-navigation-bar';

export const MainLayout = () => {
  const location = useLocation();
  const getTitle = () => {
    const path = location.pathname.replace('/', '');
    if (path === '') return 'Voce Alarm';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigationBar title={getTitle()} />
      <main className="container mx-auto px-4 py-6 pb-20">
        <Outlet />
      </main>
      <EnhancedMobileNavigation />
    </div>
  );
}; 