import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, User, Bell, Settings, ArrowLeft, Music } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface TopNavigationBarProps {
  title: string;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isHomePage = title === 'Voce Alarm';

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isHomePage ? (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Mic className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">{title}</span>
            </div>
          ) : (
            <>
              <Link to="/" className="lg:hidden">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{title}</h1>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Link to="/alarms/bank">
            <Button variant="ghost" size="icon">
              <Music className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/notifications">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/image.png" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-4 pb-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/image.png" alt="Profile" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                  <Link to="/settings" className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}; 