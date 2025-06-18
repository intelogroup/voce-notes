
import React, { useState } from 'react';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Mic, Bell, User } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, startRecording, stopRecording } = useVoiceRecording();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Voce Alarm</span>
          </div>

          {/* Profile Avatar */}
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Settings
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <MobileNavigation />
      
      <div className="container mx-auto px-4 py-6 pb-24 max-h-screen overflow-y-auto">
        {/* Greeting Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {getGreeting()}
                </h2>
                <p className="text-muted-foreground">
                  Ready to set your voice alarms?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-purple-400"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Calendar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
              classNames={{
                months: "flex w-full flex-col space-y-2",
                month: "space-y-2 w-full flex flex-col",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-base font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-xs flex-1 text-center",
                row: "flex w-full mt-1",
                cell: "h-8 w-full text-center text-xs p-0 relative flex-1",
                day: cn(
                  "h-8 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-xs"
                ),
                day_selected: "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
              }}
            />
          </CardContent>
        </Card>

        {/* Recording Timer */}
        {recordingState.isRecording && (
          <div className="fixed bottom-56 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {recordingState.duration.toFixed(1)}s
            </div>
          </div>
        )}

        {/* Floating Record Button */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            size="icon"
            className={cn(
              "h-20 w-20 rounded-full shadow-lg transition-all duration-200",
              recordingState.isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-purple-500 hover:bg-purple-600"
            )}
            onClick={recordingState.isRecording ? stopRecording : startRecording}
          >
            <Mic className="h-8 w-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
