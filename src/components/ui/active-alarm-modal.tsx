import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alarm, VoiceRecording } from '@/store/alarmStore';
import { Volume2 } from 'lucide-react';

interface ActiveAlarmModalProps {
  alarm: Alarm | null;
  onSnooze: () => void;
  onStop: () => void;
}

export const ActiveAlarmModal = ({ alarm, onSnooze, onStop }: ActiveAlarmModalProps) => {
  if (!alarm) {
    return null;
  }
  
  const audioName = alarm.voiceRecording 
    ? `Playing: ${alarm.label}` 
    : 'Playing: Default Alarm Sound';

  return (
    <Dialog open={!!alarm} onOpenChange={(isOpen) => !isOpen && onStop()}>
      <DialogContent className="max-w-md h-screen flex flex-col justify-center items-center text-center p-0 gap-y-10">
        <DialogHeader className="w-full px-6">
          <DialogTitle className="text-3xl font-bold">{alarm.label}</DialogTitle>
          <div className="flex items-center justify-center gap-2 text-muted-foreground pt-2">
            <Volume2 className="h-5 w-5" />
            <p className="text-lg">{audioName}</p>
          </div>
        </DialogHeader>
        
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <Button 
              onClick={onSnooze}
              className="w-48 h-48 rounded-full text-2xl font-bold bg-yellow-500 text-black hover:bg-yellow-600 shadow-2xl"
            >
              Snooze
            </Button>
        </div>

        <div className="w-full pb-10 px-6">
           <Button onClick={onStop} variant="link" className="w-full text-lg">
                Stop
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 