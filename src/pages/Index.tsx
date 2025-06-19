import React, { useState } from 'react';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Bell, User, Clock, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAlarmStore } from '@/store/alarmStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { SimpleAudioRecorder } from '@/components/ui/simple-audio-recorder';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CalendarRecordingModal } from '@/components/ui/calendar-recording-modal';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, startRecording, stopRecording, resetRecording, createVoiceRecording } = useVoiceRecording();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const { addAlarm, alarms } = useAlarmStore();
  const { toast } = useToast();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    // Prevent selecting past dates
    if (selectedDay < today) {
      toast({
        title: "Invalid Date",
        description: "Cannot select past dates",
        variant: "destructive",
      });
      return;
    }

    setSelectedDate(date);

    // If it's a future date, open the recording modal
    if (selectedDay > today) {
      setShowCalendarModal(true);
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

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Mic className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-lg">Voce Alarm</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
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
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
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
                    <Button variant="ghost" className="w-full justify-start">
                      Settings
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <EnhancedMobileNavigation />
      
      <div className="container mx-auto px-4 py-6 pb-20 space-y-6">
        {/* Greeting Section */}
        <CleanCard>
          <CleanCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CleanCardTitle className="text-xl mb-1">
                  {getGreeting()}
                </CleanCardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </CleanCardHeader>
        </CleanCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{todayAlarms.length}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <Mic className="h-5 w-5 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{alarms.filter(a => a.voiceRecording).length}</div>
              <div className="text-xs text-muted-foreground">Recordings</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <Bell className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{alarms.filter(a => a.isEnabled).length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CleanCardContent>
          </CleanCard>
        </div>

        {/* Calendar */}
        <CleanCard>
          <CleanCardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="w-full"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const checkDate = new Date(date);
                checkDate.setHours(0, 0, 0, 0);
                return checkDate < today;
              }}
              classNames={{
                months: "flex w-full flex-col space-y-4",
                month: "space-y-4 w-full flex flex-col",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "h-9 w-full text-center text-sm p-0 relative flex-1",
                day: cn(
                  "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm rounded-md transition-colors"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
              }}
            />
          </CleanCardContent>
        </CleanCard>

        {/* Audio Recording */}
        <SimpleAudioRecorder />

        {/* Quick Create Button */}
        {recordingState.audioUrl && (
          <Button 
            onClick={() => setShowAlarmDialog(true)}
            className="w-full"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Alarm with Recording
          </Button>
        )}
      </div>

      {/* Calendar Recording Modal */}
      <CalendarRecordingModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
      />

      {/* Create Alarm Dialog */}
      <Dialog open={showAlarmDialog} onOpenChange={setShowAlarmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Voice Alarm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="time">Alarm Time</Label>
              <Input
                id="time"
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Alarm Label</Label>
              <Input
                id="label"
                placeholder="Enter alarm label"
                value={alarmLabel}
                onChange={(e) => setAlarmLabel(e.target.value)}
              />
            </div>
            <div className="bg-muted rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>Date: {selectedDate.toDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mic className="h-4 w-4" />
                <span>Recording: {recordingState.duration.toFixed(1)}s</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAlarmDialog(false)}
              >
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
    </div>
  );
};

export default Index;
