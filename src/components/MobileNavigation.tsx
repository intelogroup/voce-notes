
import React from 'react';
import { Home, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Alarms', icon: Home, href: '/' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export const MobileNavigation = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    // Bottom Tab Navigation - Mobile Only
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors",
              isActive(item.href) ? "text-purple-500" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 mb-1",
              isActive(item.href) ? "text-purple-500" : "text-muted-foreground"
            )} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
