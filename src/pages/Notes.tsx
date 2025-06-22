import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useNoteStore, Space } from '@/store/noteStore';
import { useUIStore } from '@/store/uiStore';
import { formatDistanceToNow } from 'date-fns';
import { Folder, Search, Plus, Trash2, Wand2, FolderOpen } from 'lucide-react';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const CreateSpaceDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
  const { addSpace } = useNoteStore();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      addSpace({ name: name.trim() });
      onClose();
      setName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Space name (e.g., 'Work Projects')"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!name.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SpaceCard = ({ space }: { space: Space }) => {
  const navigate = useNavigate();
  const { getNotesBySpace, deleteSpace } = useNoteStore();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const noteCount = getNotesBySpace(space.id).length;

  const handleNavigate = () => {
    navigate(`/notes/${space.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  }
  
  const handleConfirmDelete = () => {
    deleteSpace(space.id);
    setDeleteDialogOpen(false);
  }

  const handleAiUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement AI update feature
    console.log(`AI Update for ${space.name}`);
  }

  return (
    <>
      <CleanCard onClick={handleNavigate} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <CleanCardContent className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
              <Folder className="h-6 w-6 mb-2 text-blue-500" />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary/50 hover:text-primary" onClick={handleAiUpdate}>
                  <Wand2 className="h-4 w-4" />
              </Button>
          </div>
          <h3 className="font-semibold text-md mb-1">{space.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </p>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(space.updatedAt), { addSuffix: true })}
              </p>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/50 hover:text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        </CleanCardContent>
      </CleanCard>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{space.name}" space and all {noteCount} of its notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const NotesPage = () => {
  const { spaces } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredSpaces = useMemo(() =>
    spaces
      .filter(space => space.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [spaces, searchQuery]
  );
  
  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Spaces Yet</h2>
        <p className="text-muted-foreground mb-6">
          Spaces are like folders for your notes. Get started by creating one.
        </p>
        <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Space
        </Button>

        <CreateSpaceDialog isOpen={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Spaces</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search spaces..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreateDialogOpen(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Space
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
      
      <CreateSpaceDialog isOpen={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </div>
  );
};

export default NotesPage;