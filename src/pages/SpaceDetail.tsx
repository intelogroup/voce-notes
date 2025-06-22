import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNoteStore, Note } from '@/store/noteStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { ArrowLeft, Plus, Search, Mic, Edit, Trash2, Cloud, CloudOff, FileWarning, Hourglass, MoreVertical, Save, X, Wand2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { RecordingModal } from '@/components/ui/recording-modal';
import { NoteDetailView } from '@/components/NoteDetailView';

// Component for the inline editor
const NoteEditorCard = ({ note, onSave, onCancel, spaceId }: { note: Partial<Note> | null; onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void; onCancel: () => void; spaceId: string; }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title,
            content,
            spaceId,
        }, note?.id);
    };

    return (
        <CleanCard className="flex flex-col h-48 border-2 border-primary">
            <CleanCardContent className="p-2 flex flex-col flex-grow gap-2">
                <Input
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-semibold border-0 focus-visible:ring-0"
                    autoFocus
                />
                <div className="flex-grow">
                    <RichTextEditor content={content} onChange={setContent} />
                </div>
                <div className="flex justify-end gap-2 p-2">
                    <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4 mr-2" />Cancel</Button>
                    <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save</Button>
                </div>
            </CleanCardContent>
        </CleanCard>
    );
};


const NoteCard = ({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void; }) => {
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const getTranscriptionIcon = () => {
        switch (note.transcriptionStatus) {
            case 'completed': return <Mic className="h-4 w-4 text-blue-500" />;
            case 'pending': return <Hourglass className="h-4 w-4 text-yellow-500 animate-spin" />;
            case 'failed': return <FileWarning className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <CleanCard className="group relative flex flex-col h-48 cursor-pointer overflow-hidden" onClick={onEdit}>
                <CleanCardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-sm mb-2 truncate">{note.title}</h3>
                    <div 
                        className="text-xs text-muted-foreground flex-grow mb-3 line-clamp-3 prose dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: note.content || "<p>No content</p>" }}
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                        </p>
                        <div className="flex items-center gap-1.5">
                            {note.audioBlob && getTranscriptionIcon()}
                        </div>
                    </div>
                </CleanCardContent>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CleanCard>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently delete the note titled "{note.title}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
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


const SpaceDetail = () => {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const { getSpaceById, getNotesBySpace, addNote, updateNote, deleteNote, spaces } = useNoteStore();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [isRecordingModalOpen, setRecordingModalOpen] = useState(false);

    const space = useMemo(() => spaceId ? getSpaceById(spaceId) : undefined, [spaceId, getSpaceById]);
    const notes = useMemo(() => spaceId ? getNotesBySpace(spaceId) : [], [spaceId, getNotesBySpace]);

    const filteredNotes = useMemo(() =>
        notes
            .filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
        [notes, searchQuery]
    );

    const selectedNote = useMemo(() => {
        if (!selectedNoteId) return null;
        return notes.find(n => n.id === selectedNoteId);
    }, [selectedNoteId, notes]);

    const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => {
        if (id && id !== 'new') {
            updateNote(id, noteData);
        } else {
            addNote(noteData);
        }
        setEditingNoteId(null);
    };

    const handleSaveAudioNote = (audioBlob: Blob, duration: number) => {
        if (!spaceId) return;
        const title = `Audio Note - ${format(new Date(), 'MMM d, yyyy h:mm a')}`;
        const content = `<p><i>Audio recording: ${duration.toFixed(1)}s. Transcription pending...</i></p>`;
        addNote({ title, content, spaceId, audioBlob, duration, transcriptionStatus: 'pending' });
        setRecordingModalOpen(false);
    };
    
    if (selectedNote) {
        return <NoteDetailView note={selectedNote} onBack={() => setSelectedNoteId(null)} />;
    }

    if (!space) {
        return <div>Space not found. <Button variant="link" onClick={() => navigate('/notes')}>Go back</Button></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/notes')} className="mr-2 shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold truncate flex-1">{space.name}</h1>
                </div>
                <Button variant="outline" size="sm">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Update Space
                </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search notes..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setRecordingModalOpen(true)} variant="outline">
                        <Mic className="h-4 w-4 mr-2" />
                        Record Note
                    </Button>
                    <Button onClick={() => setEditingNoteId('new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Note
                    </Button>
                </div>
            </div>

            {filteredNotes.length === 0 && editingNoteId !== 'new' ? (
                 <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">No notes yet</h3>
                    <p className="text-muted-foreground mt-2">Create your first note or record an audio message.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {editingNoteId === 'new' && (
                        <NoteEditorCard 
                            note={null} 
                            onSave={handleSaveNote} 
                            onCancel={() => setEditingNoteId(null)} 
                            spaceId={space.id}
                        />
                    )}
                    {filteredNotes.map(note => 
                        editingNoteId === note.id ? (
                            <NoteEditorCard 
                                key={note.id}
                                note={note} 
                                onSave={handleSaveNote} 
                                onCancel={() => setEditingNoteId(null)} 
                                spaceId={space.id}
                            />
                        ) : (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={() => setSelectedNoteId(note.id)}
                                onDelete={() => deleteNote(note.id)}
                            />
                        )
                    )}
                </div>
            )}

            <RecordingModal
                isOpen={isRecordingModalOpen}
                onClose={() => setRecordingModalOpen(false)}
                onSave={handleSaveAudioNote}
            />
        </div>
    );
}

export default SpaceDetail;
