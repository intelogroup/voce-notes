import React, { useState, useEffect } from 'react';
import { Note } from '@/store/noteStore';
import { Button } from './ui/button';
import { ArrowLeft, Hourglass, Wand2, ListTodo, Pilcrow, MessageSquare } from 'lucide-react';
import { SimpleAudioRecorder } from './ui/simple-audio-recorder'; // Assuming this can be used for playback
import { Card, CardContent, CardHeader } from './ui/card';
import { useToast } from './ui/use-toast';

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
}

const AIToolButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
    <Button variant="ghost" className="flex-1 flex-col h-auto" onClick={onClick}>
        <Icon className="h-5 w-5 mb-1" />
        <span className="text-xs">{label}</span>
    </Button>
);


export const NoteDetailView = ({ note, onBack }: NoteDetailViewProps) => {
    const { toast } = useToast();
    const [transcribedText, setTranscribedText] = useState(note.content || '');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Simulate transcription
    useEffect(() => {
        if (note.transcriptionStatus === 'pending' && note.audioBlob) {
            setIsTranscribing(true);
            const timer = setTimeout(() => {
                const mockTranscription = "Ok, nouvelle idée pour mon podcast : interviewer un maître-brasseur de kombucha. Explorer l'histoire, les techniques, le business...";
                setTranscribedText(mockTranscription);
                setIsTranscribing(false);
                // Here you would also update the note in the store
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [note]);

    // Create a URL for the audio player
    useEffect(() => {
        if (note.audioBlob) {
            const url = URL.createObjectURL(note.audioBlob);
            setAudioUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [note.audioBlob]);

    const handleAiToolClick = (tool: string) => {
        toast({
            title: "Stylo IA",
            description: `L'outil "${tool}" a été appliqué.`,
        });

        // Mock AI transformations
        if (tool === "Créer une liste de tâches") {
            setTranscribedText(
                "<ul><li>✅ Interviewer un maître-brasseur de kombucha.</li><li>✅ Explorer l'histoire et les techniques.</li><li>✅ Analyser le côté business.</li></ul>"
            );
        }
        // TODO: Add other mock transformations
    };


  return (
    <div className="space-y-4">
        <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate flex-1">{note.title}</h1>
        </div>
        
        {audioUrl && (
            <Card>
                <CardContent className="p-4">
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold">Transcription</h2>
            </CardHeader>
            <CardContent>
                {isTranscribing ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Hourglass className="h-4 w-4 animate-spin" />
                        <span>Transcription en cours...</span>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: transcribedText }} />
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Outils Stylo IA
                </h2>
            </CardHeader>
            <CardContent className="flex gap-2">
                <AIToolButton icon={ListTodo} label="Liste de tâches" onClick={() => handleAiToolClick("Créer une liste de tâches")} />
                <AIToolButton icon={Pilcrow} label="Corriger" onClick={() => handleAiToolClick("Corriger & Améliorer")} />
                <AIToolButton icon={MessageSquare} label="Chat" onClick={() => handleAiToolClick("Ouvrir le chat")} />
            </CardContent>
        </Card>
    </div>
  );
}; 