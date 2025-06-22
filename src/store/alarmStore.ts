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
  lastTriggered?: Date;
  severity: 'high' | 'medium' | 'low';
}

export interface AlarmState {
  alarms: Alarm[];
  activeAlarmId: string | null;
  snoozedAlarmId: string | null;
  pendingAlarmAudio: { blob: Blob; duration: number } | null;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (alarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  setActiveAlarm: (id: string | null) => void;
  setSnoozedAlarm: (id: string | null) => void;
  setPendingAlarmAudio: (audio: { blob: Blob; duration: number } | null) => void;
  toggleAlarm: (id: string) => void;
  duplicateAlarm: (id: string) => void;
}

export const useAlarmStore = create<AlarmState>()(
  persist(
    (set, get) => ({
      alarms: [
        // Mock Data
        {
          id: '1',
          time: '07:30',
          date: new Date(),
          label: 'Réveil',
          isEnabled: true,
          repeatDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          severity: 'medium',
          createdAt: new Date(),
        },
        {
          id: '2',
          time: '22:00',
          date: new Date(),
          label: 'Se coucher',
          isEnabled: false,
          repeatDays: [],
          severity: 'low',
          createdAt: new Date(),
        },
        {
            id: '3',
            time: '14:15',
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            label: 'Rappel réunion',
            isEnabled: true,
            repeatDays: [],
            severity: 'high',
            createdAt: new Date(),
        }
      ],
      activeAlarmId: null,
      snoozedAlarmId: null,
      pendingAlarmAudio: null,
      addAlarm: (alarm) => set((state) => ({ alarms: [...state.alarms, alarm] })),
      updateAlarm: (alarm) =>
        set((state) => ({
          alarms: state.alarms.map((a) => (a.id === alarm.id ? alarm : a)),
        })),
      deleteAlarm: (id) =>
        set((state) => ({ alarms: state.alarms.filter((a) => a.id !== id) })),
      setActiveAlarm: (id) => set({ activeAlarmId: id }),
      setSnoozedAlarm: (id) => set({ snoozedAlarmId: id }),
      setPendingAlarmAudio: (audio) => set({ pendingAlarmAudio: audio }),
      toggleAlarm: (id) => set((state) => ({
        alarms: state.alarms.map((alarm) => 
            alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
        )
      })),
      duplicateAlarm: (id) => {
        const alarmToDuplicate = get().alarms.find(a => a.id === id);
        if (alarmToDuplicate) {
          const newAlarm = {
            ...alarmToDuplicate,
            id: Date.now().toString(),
            isEnabled: false, // Duplicated alarms are off by default
            createdAt: new Date(),
          };
          set((state) => ({ alarms: [...state.alarms, newAlarm] }));
        }
      },
    }),
    {
      name: 'alarm-storage',
    }
  )
);
