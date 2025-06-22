import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Mic, Save, Trash2 } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format, isToday } from 'date-fns';
import { ClockTimePicker } from '@/components/ui/clock-time-picker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CreateAlarmProps {
    isOpen: boolean;
    onClose: () => void;
    initialTime?: string;
    initialLabel?: string;
}

export const CreateAlarm = ({ isOpen, onClose, initialTime, initialLabel }: CreateAlarmProps) => {
  const navigate = useNavigate();
  const { addAlarm, pendingAlarmAudio, setPendingAlarmAudio } = useAlarmStore();
  const { scheduleNotification } = useNotifications();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const [time, setTime] = useState<{ hour: number, minute: number }>(() => {
    if (initialTime) {
      const [hour, minute] = initialTime.split(':').map(Number);
      return { hour, minute };
    }
    const now = new Date();
    return { hour: now.getHours(), minute: now.getMinutes() };
  });

  const [label, setLabel] = useState(initialLabel || 'My Alarm');
  const [voiceRecording, setVoiceRecording] = useState(null);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (initialTime) {
        const [hour, minute] = initialTime.split(':').map(Number);
        setTime({ hour, minute });
    }
    if (initialLabel) {
        setLabel(initialLabel);
    }
    // Clear pending audio when modal is closed without saving
    return () => {
        if (isOpen) {
            setPendingAlarmAudio(null);
        }
    }
  }, [initialTime, initialLabel, isOpen, setPendingAlarmAudio]);

  const isPastTime = isToday(date || new Date());

  const handleSave = () => {
    if (!date) {
        toast({ title: "Error", description: "Please select a date.", variant: "destructive" });
        return;
    }
    
    const newAlarm = {
        id: Date.now().toString(),
        time: `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`,
        date,
        label,
        isEnabled: true,
        voiceRecording: pendingAlarmAudio ? {
            id: Date.now().toString(),
            audioBlob: pendingAlarmAudio.blob,
            duration: pendingAlarmAudio.duration,
            createdAt: new Date(),
        } : undefined,
        repeatDays,
        severity,
        createdAt: new Date(),
    };

    addAlarm(newAlarm);
    toast({ title: "Success", description: `Alarm "${label}" set for ${newAlarm.time}.` });
    // Clear the pending audio after successful save
    setPendingAlarmAudio(null);
    onClose();
  };

  const dayOptions = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none sm:max-w-lg rounded-none sm:rounded-lg flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Create New Alarm</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
            {pendingAlarmAudio && (
                <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Mic className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">
                            Voice message attached ({pendingAlarmAudio.duration.toFixed(1)}s)
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPendingAlarmAudio(null)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            )}
            <div>
                <Label htmlFor="label">Label</Label>
                <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            
            <div>
                <Label>Date</Label>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
            </div>
            <div>
                <Label>Time</Label>
                <ClockTimePicker 
                    onTimeChange={setTime}
                    initialTime={time}
                />
            </div>
            
            <div>
                <Label>Repeat</Label>
                <ToggleGroup type="multiple" value={repeatDays} onValueChange={setRepeatDays} className="flex-wrap justify-start">
                    {dayOptions.map(day => (
                        <ToggleGroupItem key={day} value={day} className="capitalize text-xs h-8">
                            {day.substring(0, 3)}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            <div>
                <Label>Severity</Label>
                <ToggleGroup type="single" value={severity} onValueChange={(value) => value && setSeverity(value as any)} className="justify-start">
                    <ToggleGroupItem value="low"><Badge variant="default">Low</Badge></ToggleGroupItem>
                    <ToggleGroupItem value="medium"><Badge variant="secondary">Medium</Badge></ToggleGroupItem>
                    <ToggleGroupItem value="high"><Badge variant="destructive">High</Badge></ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
        <DialogFooter className="p-6 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {pendingAlarmAudio ? <Save className="h-4 w-4 mr-2" /> : null}
            Save Alarm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
