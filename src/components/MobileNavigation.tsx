
import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/', isActive: true },
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-lg">Lovable App</span>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                item.isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </a>
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
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">L</span>
                </div>
                <span className="font-semibold text-xl">Menu</span>
              </div>
              
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent",
                    item.isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
