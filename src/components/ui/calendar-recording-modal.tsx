import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleAudioRecorder } from '@/components/ui/simple-audio-recorder';
import { Clock, Calendar as CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAlarmStore } from '@/store/alarmStore';
import { useToast } from '@/hooks/use-toast';
import { ClockTimePicker } from './clock-time-picker';

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
  const [alarmLabel, setAlarmLabel] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const { addAlarm } = useAlarmStore();
  const { toast } = useToast();

  const handleRecordingComplete = (blob: Blob) => {
    setRecordingBlob(blob);
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
      time: alarmTime,
      date: selectedDate,
      label: alarmLabel || `Alarm for ${format(selectedDate, 'MMM dd')}`,
      isEnabled: true,
      voiceRecording,
      repeatDays: [],
    });

    toast({
      title: "Alarm Created",
      description: `Voice alarm set for ${alarmTime} on ${format(selectedDate, 'MMM dd, yyyy')}`,
    });

    handleClose();
  };

  const handleClose = () => {
    setTime({ hour: 12, minute: 0 });
    setAlarmLabel('');
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
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label">Alarm Label (Optional)</Label>
            <Input
              id="label"
              placeholder="Enter alarm description..."
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
            />
          </div>

          {/* Audio Recorder */}
          <div className="space-y-2">
            <Label>Voice Message</Label>
            <SimpleAudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={!recordingBlob}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Alarm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
