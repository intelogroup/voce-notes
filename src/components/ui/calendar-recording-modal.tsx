import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleAudioRecorder } from '@/components/ui/simple-audio-recorder';
import { Clock, Calendar as CalendarIcon, Save, X } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useAlarmStore } from '@/store/alarmStore';
import { useToast } from '@/hooks/use-toast';
import { ClockTimePicker } from './clock-time-picker';
import { createIcsFileContent } from '@/lib/calendar';

interface CalendarRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export const CalendarRecordingModal: React.FC<CalendarRecordingModalProps> = ({
  isOpen,
  onClose,
  selectedDate
}) => {
  const [time, setTime] = useState({ hour: 12, minute: 0 });
  const [notes, setNotes] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const { addAlarm } = useAlarmStore();
  const { toast } = useToast();

  const isPastTime = useMemo(() => {
    if (isToday(selectedDate)) {
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(time.hour, time.minute, 0, 0);
      return selectedDateTime <= now;
    }
    return false;
  }, [time, selectedDate]);

  const handleRecordingComplete = (blob: Blob) => {
    setRecordingBlob(blob);
  };

  const handleAddCalendarEvent = () => {
    const startDate = new Date(selectedDate);
    startDate.setHours(time.hour, time.minute, 0, 0);

    const icsContent = createIcsFileContent({
      title: notes || `Voice Note Reminder`,
      description: 'A reminder from Voce Notes.',
      startDate,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "voce-note-event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Calendar Event Created',
      description: 'The .ics file has been downloaded.',
    });
  };

  const handleSave = () => {
    if (!recordingBlob) {
      toast({
        title: "Missing Information",
        description: "Please record a message",
        variant: "destructive",
      });
      return;
    }

    // Check if the time is in the past for today
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.hour, time.minute, 0, 0);

    if (selectedDateTime <= now) {
      toast({
        title: "Invalid Time",
        description: "Please select a future time",
        variant: "destructive",
      });
      return;
    }

    // Create voice recording object with audioBlob instead of audioUrl
    const voiceRecording = {
      id: Date.now().toString(),
      audioBlob: recordingBlob,
      duration: 0, // Will be calculated when needed
      createdAt: new Date(),
    };

    const alarmTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

    addAlarm({
      id: Date.now().toString(),
      time: alarmTime,
      date: selectedDate,
      label: notes || `Alarm for ${format(selectedDate, 'MMM dd')}`,
      isEnabled: true,
      voiceRecording,
      repeatDays: [],
      createdAt: new Date(),
      severity: 'medium',
    });

    toast({
      title: "Alarm Created",
      description: `Voice alarm set for ${alarmTime} on ${format(selectedDate, 'MMM dd, yyyy')}`,
    });

    handleClose();
  };

  const handleClose = () => {
    setTime({ hour: 12, minute: 0 });
    setNotes('');
    setRecordingBlob(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Create Alarm for {format(selectedDate, 'MMM dd, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Input */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Alarm Time
            </Label>
            <div className="flex justify-center">
              <ClockTimePicker onTimeChange={setTime} isOpen={isOpen} />
            </div>
            {isPastTime && (
                <p className="text-sm text-destructive text-center">
                    Please select a future time for today's alarm.
                </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Calendar Notes</Label>
            <Input
              id="notes"
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Audio Recorder */}
          <div className="space-y-2">
            <Label>Voice Message</Label>
            <SimpleAudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-3">
                <Button 
                  onClick={handleAddCalendarEvent}
                  className="flex-1"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add Calendar Event
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="outline"
                    className="flex-1"
                    disabled={!recordingBlob || isPastTime}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Alarm
                </Button>
            </div>
            <Button variant="outline" onClick={handleClose} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
