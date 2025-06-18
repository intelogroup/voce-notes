
import React from 'react';
import { MobileNavigation } from '@/components/MobileNavigation';
import Alarms from './Alarms';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobileNavigation />
      <main>
        <Alarms />
      </main>
    </div>
  );
};

export default Index;
