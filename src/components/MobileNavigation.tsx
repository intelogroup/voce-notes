
import React, { useState } from 'react';
import { Menu, X, Home, Plus, Settings, Mic, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Record', icon: Mic, href: '/record' },
  { label: 'Alarms', icon: Home, href: '/' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Voce Alarm</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-xl">Voce Alarm</span>
                </div>
                
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Bottom Tab Navigation - Mobile Only */}
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
    </>
  );
};
