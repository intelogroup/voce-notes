import React, { useState } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Input } from './input';
import { Label } from './label';
import { Folder, Plus, Save } from 'lucide-react';
import { useNoteStore } from '@/store/noteStore';
import { useUIStore } from '@/store/uiStore';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export const SpaceSelectionModal = () => {
  const { 
    isSpaceSelectionModalOpen, 
    closeSpaceSelectionModal, 
    noteCreationData 
  } = useUIStore();
  const { spaces, addSpace, addNote } = useNoteStore();
  const { toast } = useToast();
  const [showNewSpaceForm, setShowNewSpaceForm] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');

  const handleSaveNote = (spaceId: string) => {
    if (!noteCreationData) return;

    const { audioBlob, duration } = noteCreationData;
    
    if (audioBlob) {
        const title = `Voice note - ${format(new Date(), "d MMM yyyy, HH:mm")}`;
        const content = `<p><i>Audio recording: ${duration?.toFixed(1) || 0}s. Transcription pending...</i></p>`;
        
        addNote({ 
            title, 
            content, 
            spaceId, 
            audioBlob, 
            duration, 
            transcriptionStatus: 'pending' 
        });
        
        toast({ title: "Note sauvegardée", description: `La note a été sauvegardée dans l'espace.` });
    }
    
    // We call the store's close action, but prevent the safety net
    // by clearing the data first.
    useUIStore.setState({ noteCreationData: null });
    closeSpaceSelectionModal();
  };

  const handleCreateAndSave = () => {
    if (newSpaceName.trim()) {
      const newSpaceId = Date.now().toString();
      addSpace({ name: newSpaceName.trim() });
      // This is a simplification. In a real app, you'd wait for the store update
      // or get the new ID back from the addSpace action. For now, this is okay for mock.
      const newSpace = useNoteStore.getState().spaces.find(s => s.name === newSpaceName.trim());
      if(newSpace) {
        handleSaveNote(newSpace.id);
      }
    }
  };

  const handleClose = () => {
    // This will trigger the safety net logic in the store
    closeSpaceSelectionModal();
  };

  return (
    <Dialog open={isSpaceSelectionModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Note to Space
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showNewSpaceForm && (
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowNewSpaceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Space
            </Button>
          )}

          {showNewSpaceForm && (
            <div className="space-y-3 p-3 border rounded-lg">
              <div>
                <Label htmlFor="spaceName">New Space Name</Label>
                <Input id="spaceName" value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} autoFocus />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateAndSave} disabled={!newSpaceName.trim()}>Create & Save</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewSpaceForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {spaces.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Or save to existing space:</p>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {spaces.map((space) => (
                  <Button key={space.id} variant="outline" className="w-full justify-start" onClick={() => handleSaveNote(space.id)}>
                    <Folder className="h-4 w-4 mr-2" />
                    {space.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 