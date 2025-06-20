"use client";

import React from 'react';
import { Home, Settings, Bell, Clock, FileText, MessageSquare } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAlarmStore } from '@/store/alarmStore';

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/alarms", label: "Alarms", icon: Clock },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function EnhancedMobileNavigation() {
  const { pathname } = useLocation();
  const { alarms } = useAlarmStore();

  const upcomingAlarmsCount = alarms.filter(a => new Date(a.date) > new Date() && a.isEnabled).length;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container h-full max-w-lg mx-auto">
        <div className="flex justify-around items-center h-full">
          {navItems.map(item => {
            const itemBadge = item.href === '/alarms' ? upcomingAlarmsCount : 0;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-12 rounded-lg mx-1 transition-all duration-200 relative group",
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative mb-1">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive(item.href) ? "scale-110" : "group-hover:scale-105"
                  )} />
                  
                  {itemBadge > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px] min-w-[16px]">
                      {itemBadge > 9 ? '9+' : itemBadge}
                    </div>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive(item.href) ? "text-primary" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
