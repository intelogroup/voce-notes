
import React, { useState } from 'react';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Bell, User, Play, Square, RotateCcw, Check } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAlarmStore } from '@/store/alarmStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, startRecording, stopRecording, resetRecording, createVoiceRecording } = useVoiceRecording();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const addAlarm = useAlarmStore((state) => state.addAlarm);
  const { toast } = useToast();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleRecordClick = () => {
    if (recordingState.isRecording) {
      stopRecording();
    } else if (recordingState.audioUrl) {
      setShowAlarmDialog(true);
    } else {
      startRecording();
    }
  };

  const handlePlayback = () => {
    if (recordingState.audioUrl) {
      const audio = new Audio(recordingState.audioUrl);
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleSaveAlarm = async () => {
    if (!alarmTime || !alarmLabel || !recordingState.audioUrl) return;

    const recording = await createVoiceRecording();
    if (recording) {
      addAlarm({
        time: alarmTime,
        date: selectedDate,
        label: alarmLabel,
        isEnabled: true,
        voiceRecording: recording,
        repeatDays: [],
      });

      toast({
        title: "Alarm Created",
        description: `Voice alarm set for ${alarmTime} on ${selectedDate.toDateString()}`,
      });

      setShowAlarmDialog(false);
      setAlarmTime('');
      setAlarmLabel('');
      resetRecording();
    }
  };

  const getRecordButtonText = () => {
    if (recordingState.isRecording) return 'Recording...';
    if (recordingState.audioUrl) return 'Create Alarm';
    return 'Start Recording';
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
      
      <div className="container mx-auto px-4 py-4 pb-24 max-h-screen overflow-y-auto">
        {/* Compact Greeting Card */}
        <Card className="mb-3">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {getGreeting()}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ready to set your voice alarms?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar with Record Button Integration */}
        <div className="relative">
          <Card className="calendar-with-button mb-0 relative">
            <CardContent className="p-2">
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
              
              {/* Deformation effect for calendar bottom */}
              <div className="calendar-bottom-deform h-8 relative">
                <div className={cn(
                  "absolute inset-0 bg-card transition-all duration-300 ease-out",
                  "rounded-b-lg",
                  recordingState.isRecording || recordingState.audioUrl
                    ? "record-indent" 
                    : ""
                )}>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recording Timer */}
          {recordingState.isRecording && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-40">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                {recordingState.duration.toFixed(1)}s
              </div>
            </div>
          )}

          {/* Floating Record Button - Positioned to create deformation */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              size="icon"
              className={cn(
                "h-16 w-16 rounded-full shadow-xl transition-all duration-300 ease-out",
                "border-4 border-white",
                recordingState.isRecording 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110 shadow-red-500/30" 
                  : recordingState.audioUrl
                  ? "bg-green-500 hover:bg-green-600 shadow-green-500/30 hover:scale-105"
                  : "bg-purple-500 hover:bg-purple-600 shadow-purple-500/30 hover:scale-105"
              )}
              onClick={handleRecordClick}
            >
              {recordingState.isRecording ? (
                <Square className="h-7 w-7 text-white" />
              ) : recordingState.audioUrl ? (
                <Check className="h-7 w-7 text-white" />
              ) : (
                <Mic className="h-7 w-7 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Recording Controls */}
        {recordingState.audioUrl && !recordingState.isRecording && (
          <div className="mt-16 flex justify-center gap-3">
            <Button
              onClick={handlePlayback}
              variant="outline"
              disabled={isPlaying}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isPlaying ? 'Playing...' : 'Play'}
            </Button>

            <Button
              onClick={resetRecording}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Re-record
            </Button>
          </div>
        )}

        {/* Extra spacing for record button */}
        <div className="h-12"></div>
      </div>

      {/* Alarm Creation Dialog */}
      <Dialog open={showAlarmDialog} onOpenChange={setShowAlarmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Voice Alarm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="time">Alarm Time</Label>
              <Input
                id="time"
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="label">Alarm Label</Label>
              <Input
                id="label"
                placeholder="Enter alarm label"
                value={alarmLabel}
                onChange={(e) => setAlarmLabel(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Date: {selectedDate.toDateString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Recording Duration: {recordingState.duration.toFixed(1)}s
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAlarmDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAlarm}
                disabled={!alarmTime || !alarmLabel}
              >
                Create Alarm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .calendar-with-button {
          position: relative;
          overflow: visible;
        }
        
        .calendar-bottom-deform {
          background: hsl(var(--card));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .record-indent {
          clip-path: polygon(
            0% 0%, 
            35% 0%, 
            40% 50%, 
            50% 80%, 
            60% 50%, 
            65% 0%, 
            100% 0%, 
            100% 100%, 
            0% 100%
          );
          background: linear-gradient(
            180deg, 
            hsl(var(--card)) 0%, 
            hsl(var(--muted)) 100%
          );
        }
        
        .calendar-with-button:hover .calendar-bottom-deform {
          background: linear-gradient(
            180deg, 
            hsl(var(--card)) 0%, 
            hsl(var(--accent)) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default Index;
