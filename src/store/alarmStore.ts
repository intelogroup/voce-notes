
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  duration: number;
  createdAt: Date;
}

export interface Alarm {
  id: string;
  time: string; // HH:MM format
  date: Date;
  label: string;
  isEnabled: boolean;
  voiceRecording?: VoiceRecording;
  repeatDays: string[]; // ['monday', 'tuesday', etc.]
  createdAt: Date;
}

interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
}

export const useAlarmStore = create<AlarmStore>()(
  persist(
    (set) => ({
      alarms: [],
      addAlarm: (alarmData) =>
        set((state) => ({
          alarms: [
            ...state.alarms,
            {
              ...alarmData,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        })),
      updateAlarm: (id, updates) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updates } : alarm
          ),
        })),
      deleteAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
        })),
      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
          ),
        })),
    }),
    {
      name: 'voce-alarms',
    }
  )
);
