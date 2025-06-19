
import React from 'react';
import { Home, Settings, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useAlarmStore } from '@/store/alarmStore';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

export const EnhancedMobileNavigation = () => {
  const location = useLocation();
  const { alarms } = useAlarmStore();

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === new Date().toDateString() && alarm.isEnabled
  );

  const navItems: NavItem[] = [
    { 
      label: 'Home', 
      icon: Home, 
      href: '/' 
    },
    { 
      label: 'Alarms', 
      icon: Clock, 
      href: '/alarms',
      badge: todayAlarms.length > 0 ? todayAlarms.length : undefined
    },
    { 
      label: 'Notifications', 
      icon: Bell, 
      href: '/notifications' 
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      href: '/settings' 
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-background border-t border-border">
        <div className="flex items-center h-16 px-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-14 rounded-lg mx-1 transition-colors relative",
                isActive(item.href) 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <div className="relative mb-1">
                <item.icon className="h-5 w-5" />
                
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
