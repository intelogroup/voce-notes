import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Bell, User, Clock, Calendar as CalendarIcon, Plus, Timer, MessageSquare } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAlarmStore } from '@/store/alarmStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { SimpleAudioRecorder } from '@/components/ui/simple-audio-recorder';
import { CalendarRecordingModal } from '@/components/ui/calendar-recording-modal';
import { Link } from 'react-router-dom';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, resetRecording, createVoiceRecording } = useVoiceRecording();
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

    if (selectedDay < today) {
      toast({
        title: "Invalid Date",
        description: "Cannot select past dates",
        variant: "destructive",
      });
      return;
    }

    setSelectedDate(date);

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
    <div className="space-y-6">
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
              cell: "h-9 w-full text-center text-sm p-0 relative flex-1 flex items-center justify-center",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm transition-colors"
              ),
              day_selected:
                "bg-blue-700 text-white hover:bg-blue-800 focus:bg-blue-700 focus:text-white rounded-full",
              day_today: "bg-accent text-accent-foreground rounded-full",
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
