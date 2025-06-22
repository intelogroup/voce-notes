import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';
import { Mic, MicOff, Save, X } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';

interface AlarmRecordingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (audioBlob: Blob, duration: number) => void;
}

export const AlarmRecordingModal = ({ isOpen, onClose, onSave }: AlarmRecordingModalProps) => {
    const { recordingState, startRecording, stopRecording, resetRecording } = useVoiceRecording();
    const maxDuration = 30; // 30 seconds for alarms

    useEffect(() => {
        if (recordingState.isRecording && recordingState.duration >= maxDuration) {
            stopRecording();
        }
    }, [recordingState.isRecording, recordingState.duration, stopRecording]);

    const handleSave = async () => {
        if (recordingState.audioUrl) {
            const response = await fetch(recordingState.audioUrl);
            const blob = await response.blob();
            onSave(blob, recordingState.duration);
            handleClose();
        }
    };

    const handleClose = () => {
        resetRecording();
        onClose();
    };

    // Auto-start recording when the modal opens
    useEffect(() => {
        if (isOpen) {
            resetRecording();
            startRecording();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enregistrer l'alarme vocale</DialogTitle>
                    <DialogDescription>
                        Enregistrement de 30 secondes. L'alarme s'arrêtera automatiquement.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6 py-6">
                    <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-3xl font-mono font-bold">
                        {recordingState.duration.toFixed(1)}s
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                            className="bg-red-500 h-2.5 rounded-full"
                            style={{ width: `${(recordingState.duration / maxDuration) * 100}%` }}
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-center gap-4">
                    {recordingState.isRecording ? (
                         <Button onClick={stopRecording} variant="destructive" size="lg">
                            <MicOff className="h-5 w-5 mr-2" />
                            Stop
                        </Button>
                    ) : (
                        <Button onClick={handleSave} size="lg" className="bg-green-500 hover:bg-green-600">
                            <Save className="h-5 w-5 mr-2" />
                            Utiliser cet audio
                        </Button>
                    )}
                    <Button variant="ghost" onClick={handleClose}>
                        <X className="h-5 w-5 mr-2" />
                        Annuler
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 