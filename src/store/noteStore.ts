import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Space {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  spaceId: string;
  title: string;
  content: string;
  audioUrl?: string | null;
  audioBlob?: Blob;
  duration?: number;
  transcriptionStatus?: 'pending' | 'completed' | 'failed';
  syncStatus?: 'synced' | 'pending' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

interface NoteStore {
  spaces: Space[];
  notes: Note[];
  addSpace: (space: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpace: (id: string, updates: Partial<Omit<Space, 'id' | 'createdAt'>>) => void;
  deleteSpace: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { audioBlob?: Blob }) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  getNotesBySpace: (spaceId: string) => Note[];
  getSpaceById: (spaceId: string) => Space | undefined;
  getOrCreateDefaultSpace: () => Space;
}

const DEFAULT_SPACE_NAME = "Nouvelles notes vocales";

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      spaces: [],
      notes: [],
      addSpace: (spaceData) =>
        set((state) => ({
          spaces: [
            ...state.spaces,
            {
              ...spaceData,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateSpace: (id, updates) =>
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === id ? { ...space, ...updates, updatedAt: new Date() } : space
          ),
        })),
      deleteSpace: (id) =>
        set((state) => ({
          spaces: state.spaces.filter((space) => space.id !== id),
          notes: state.notes.filter((note) => note.spaceId !== id),
        })),
      addNote: (noteData) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...noteData,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          spaces: state.spaces.map(space => 
            space.id === noteData.spaceId ? { ...space, updatedAt: new Date() } : space
          ),
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      getNotesBySpace: (spaceId) => {
        return get().notes.filter((note) => note.spaceId === spaceId);
      },
      getSpaceById: (spaceId) => {
        return get().spaces.find((space) => space.id === spaceId);
      },
      getOrCreateDefaultSpace: () => {
        const state = get();
        const defaultSpace = state.spaces.find(s => s.name === DEFAULT_SPACE_NAME);
        if (defaultSpace) {
          return defaultSpace;
        }

        const newSpace = {
          name: DEFAULT_SPACE_NAME,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
            spaces: [...state.spaces, newSpace]
        }));
        
        return newSpace;
      }
    }),
    {
      name: 'voce-notes-storage',
    }
  )
); 