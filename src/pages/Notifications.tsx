
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
        </div>
      </nav>

      <EnhancedMobileNavigation />

      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <CleanCard className="text-center py-16">
            <CleanCardContent>
              <BellRing className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-3">No notifications yet</h3>
              <p className="text-muted-foreground">
                Your alarm notifications will appear here
              </p>
            </CleanCardContent>
          </CleanCard>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
