"use client";

import React from 'react';
import { Home, AlarmClock, Bell, FileText, MessageSquare } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FloatingActionMenu } from './ui/floating-action-menu';

const navItemsLeft = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notes", label: "Notes", icon: FileText },
];

const navItemsRight = [
  { href: "/alarms", label: "Alarms", icon: AlarmClock },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

const NavLink = ({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean; }) => (
    <Link
        to={href}
        className={cn(
            "flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
    >
        <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
        <span className="text-xs font-medium">{label}</span>
    </Link>
);


const Notch = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[50px]">
        <svg viewBox="0 0 100 50" width="100" height="50" className="w-full h-full">
            <path
                d="M 0 50 L 0 10 C 0 0, 10 0, 15 0 L 85 0 C 90 0, 100 0, 100 10 L 100 50 Z"
                className="fill-background"
                filter="url(#shadow)"
            />
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor="black" floodOpacity="0.1"/>
                </filter>
            </defs>
        </svg>
    </div>
);


export function EnhancedMobileNavigation() {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 flex justify-center">
        <div className="relative w-full max-w-lg h-full">
            <Notch />
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[20px] z-10">
                <FloatingActionMenu />
            </div>

            <div className="absolute bottom-0 left-0 w-full h-full bg-background border-t">
                <div className="flex justify-between items-center h-full">
                    <div className="flex justify-around items-center h-full w-1/2 pr-8">
                        {navItemsLeft.map(item => (
                            <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
                        ))}
                    </div>
                    <div className="flex justify-around items-center h-full w-1/2 pl-8">
                        {navItemsRight.map(item => (
                            <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
