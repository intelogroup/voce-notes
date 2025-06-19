
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
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const { addAlarm } = useAlarmStore();
  const { toast } = useToast();

  const handleRecordingComplete = (blob: Blob) => {
    setRecordingBlob(blob);
  };

  const handleSave = () => {
    if (!alarmTime || !recordingBlob) {
      toast({
        title: "Missing Information",
        description: "Please set a time and record a message",
        variant: "destructive",
      });
      return;
    }

    // Check if the time is in the past for today
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = alarmTime.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

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
    setAlarmTime('');
    setAlarmLabel('');
    setRecordingBlob(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
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
            <Input
              id="time"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="h-12 text-center text-lg"
            />
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
              disabled={!alarmTime || !recordingBlob}
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
