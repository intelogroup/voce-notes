
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

export const EnhancedMobileNavigation = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all duration-300 relative overflow-hidden",
                isActive(item.href) 
                  ? "bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white shadow-lg scale-105" 
                  : "text-white/60 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {isActive(item.href) && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl animate-pulse" />
              )}
              <item.icon className={cn(
                "h-5 w-5 mb-1 relative z-10 transition-all duration-300",
                isActive(item.href) ? "text-white scale-110" : "text-white/60"
              )} />
              <span className={cn(
                "text-xs font-medium relative z-10 transition-all duration-300",
                isActive(item.href) ? "text-white" : "text-white/60"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
