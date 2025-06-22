"use client";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Mic, AlarmPlus, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { RecordingModal } from './recording-modal';
import { SpaceSelectionModal } from './space-selection-modal';
import { AlarmRecordingModal } from './alarm-recording-modal';
import { useAlarmStore } from '@/store/alarmStore';

export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecordingModalOpen, setRecordingModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const navigate = useNavigate();
  const { openSpaceSelectionModal, setCreateAlarmModalOpen } = useUIStore();
  const { setPendingAlarmAudio } = useAlarmStore();

  const handleActionClick = (action: 'voice-note' | 'alarm' | 'ai-chat') => {
    setIsOpen(false);
    switch (action) {
      case 'voice-note':
        setRecordingModalOpen(true);
        break;
      case 'alarm':
        setIsAlarmModalOpen(true);
        break;
      case 'ai-chat':
        navigate('/chat');
        break;
    }
  };
  
  const handleNoteRecordingComplete = (audioBlob: Blob, duration: number) => {
    setRecordingModalOpen(false);
    openSpaceSelectionModal({ audioBlob, duration });
  };

  const handleAlarmRecordingComplete = (audioBlob: Blob, duration: number) => {
    setIsAlarmModalOpen(false);
    // Set the pending audio in the alarm store
    setPendingAlarmAudio({ blob: audioBlob, duration });
    // Open the create alarm modal
    setCreateAlarmModalOpen(true);
  };

  const menuItems = [
    { label: 'Note vocale', icon: Mic, action: () => handleActionClick('voice-note'), position: { x: -60, y: -60 } },
    { label: 'Alarme', icon: AlarmPlus, action: () => handleActionClick('alarm'), position: { x: 0, y: -85 } },
    { label: 'Parler à l\'IA', icon: MessageSquare, action: () => handleActionClick('ai-chat'), position: { x: 60, y: -60 } },
  ];

  return (
    <>
      <div className="relative flex items-center justify-center">
        <Button
          className="rounded-full h-16 w-16 bg-blue-500 hover:bg-blue-600 shadow-lg flex items-center justify-center z-20"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle action menu"
        >
          <Plus className={cn("h-8 w-8 text-white transition-transform duration-300", isOpen ? "rotate-45" : "")} />
        </Button>

        <div
          className={cn("absolute bottom-0 flex items-center justify-center transition-all duration-300 ease-in-out", isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none")}
          aria-hidden={!isOpen}
        >
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="absolute transition-transform duration-300 ease-in-out"
              style={{
                transform: isOpen ? `translate(${item.position.x}px, ${item.position.y}px)` : 'translate(0, 0)',
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Button 
                  className="rounded-full h-14 w-14 bg-blue-500 text-white hover:bg-blue-600 shadow-md flex items-center justify-center" 
                  onClick={item.action} 
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </Button>
                 <span className="text-xs font-semibold px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md shadow-sm">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecordingModal 
        isOpen={isRecordingModalOpen}
        onClose={() => setRecordingModalOpen(false)}
        onSave={handleNoteRecordingComplete}
      />
      
      <SpaceSelectionModal />

      <AlarmRecordingModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        onSave={handleAlarmRecordingComplete}
      />
    </>
  );
}