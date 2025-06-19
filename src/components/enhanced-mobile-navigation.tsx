
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
      <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-around h-20 px-4 safe-area-bottom">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-16 rounded-2xl transition-all duration-300 relative overflow-hidden group",
                isActive(item.href) 
                  ? "bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white shadow-lg scale-105" 
                  : "text-white/60 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {/* Active background glow */}
              {isActive(item.href) && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl animate-pulse" />
              )}
              
              {/* Icon with badge */}
              <div className="relative mb-1">
                <item.icon className={cn(
                  "h-6 w-6 relative z-10 transition-all duration-300",
                  isActive(item.href) ? "text-white scale-110" : "text-white/60 group-hover:scale-105"
                )} />
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium relative z-10 transition-all duration-300",
                isActive(item.href) ? "text-white" : "text-white/60 group-hover:text-white/80"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive(item.href) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
