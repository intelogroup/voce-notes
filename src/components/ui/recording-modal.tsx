import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { SimpleAudioRecorder } from './simple-audio-recorder';

interface RecordingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (audioBlob: Blob, duration: number) => void;
}

export const RecordingModal = ({ isOpen, onClose, onSave }: RecordingModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle note vocale</DialogTitle>
                    <DialogDescription>
                        Enregistrez votre idée. Appuyez sur "Save Note" lorsque vous avez terminé.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-6">
                    <SimpleAudioRecorder 
                        onRecordingComplete={onSave}
                        onCancel={onClose}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}; 