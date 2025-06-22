import { create } from 'zustand';
import { useNoteStore } from './noteStore';
import { useAlarmStore } from './alarmStore';
import { format } from 'date-fns';

interface NoteCreationData {
    text?: string;
    audioBlob?: Blob;
    duration?: number;
}

interface UIState {
  isCreateAlarmModalOpen: boolean;
  setCreateAlarmModalOpen: (isOpen: boolean) => void;
  
  isSpaceSelectionModalOpen: boolean;
  noteCreationData: NoteCreationData | null;
  openSpaceSelectionModal: (data: NoteCreationData) => void;
  closeSpaceSelectionModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isCreateAlarmModalOpen: false,
  setCreateAlarmModalOpen: (isOpen) => {
    set({ isCreateAlarmModalOpen: isOpen });
    // If we are closing the modal, clear any pending audio
    if (!isOpen) {
        useAlarmStore.getState().setPendingAlarmAudio(null);
    }
  },

  isSpaceSelectionModalOpen: false,
  noteCreationData: null,
  openSpaceSelectionModal: (data) => set({ 
    isSpaceSelectionModalOpen: true, 
    noteCreationData: data 
  }),
  closeSpaceSelectionModal: () => {
    const { noteCreationData } = get();
    // This is the "Safety Net" feature.
    // If the modal is closed with pending data, we save it automatically.
    if (noteCreationData) {
        const { getOrCreateDefaultSpace, addNote } = useNoteStore.getState();
        const defaultSpace = getOrCreateDefaultSpace();
        
        const { audioBlob, duration } = noteCreationData;

        if(audioBlob) {
            const title = `Voice note - ${format(new Date(), "d MMM yyyy, HH:mm")}`;
            const content = `<p><i>Audio recording: ${duration?.toFixed(1) || 0}s. Transcription pending...</i></p>`;
            
            addNote({ 
                title, 
                content, 
                spaceId: defaultSpace.id, 
                audioBlob, 
                duration, 
                transcriptionStatus: 'pending' 
            });
        }
    }

    set({ 
        isSpaceSelectionModalOpen: false, 
        noteCreationData: null 
    });
  },
})); 