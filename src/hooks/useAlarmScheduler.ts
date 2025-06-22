import { useEffect, useRef } from 'react';
import { useAlarmStore } from '@/store/alarmStore';

export const useAlarmScheduler = () => {
  const { alarms, setActiveAlarm, activeAlarmId } = useAlarmStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize the audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;

    const checkAlarms = () => {
      if (activeAlarmId) return; // An alarm is already active, do nothing

      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const triggeredAlarm = alarms.find(alarm => {
        const alarmDate = new Date(alarm.date);
        const isToday = alarmDate.toDateString() === now.toDateString();
        return alarm.isEnabled && isToday && alarm.time === currentTime;
      });

      if (triggeredAlarm) {
        setActiveAlarm(triggeredAlarm.id);
        
        if (triggeredAlarm.voiceRecording?.audioBlob) {
            audio.src = URL.createObjectURL(triggeredAlarm.voiceRecording.audioBlob);
        } else {
            // Fallback to a default sound
            audio.src = '/placeholder.mp3'; // Make sure you have a default sound at this path
        }
        audio.play().catch(e => console.error("Error playing alarm sound:", e));
      }
    };

    const intervalId = setInterval(checkAlarms, 10000); // Check every 10 seconds

    return () => {
      clearInterval(intervalId);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [alarms, setActiveAlarm, activeAlarmId]);

  const stopAlarmSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { stopAlarmSound };
}; 