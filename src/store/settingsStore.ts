import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  soundNotifications: boolean;
  highQualityAudio: boolean;
  noiseCancellation: boolean;
  // This might be better managed by the useNotifications hook directly
  // but we can store a user preference here.
  notificationsEnabled: boolean; 
  toggleSoundNotifications: () => void;
  toggleHighQualityAudio: () => void;
  toggleNoiseCancellation: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundNotifications: true,
      highQualityAudio: true,
      noiseCancellation: false,
      notificationsEnabled: true,
      toggleSoundNotifications: () => set((state) => ({ soundNotifications: !state.soundNotifications })),
      toggleHighQualityAudio: () => set((state) => ({ highQualityAudio: !state.highQualityAudio })),
      toggleNoiseCancellation: () => set((state) => ({ noiseCancellation: !state.noiseCancellation })),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: 'settings-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
); 