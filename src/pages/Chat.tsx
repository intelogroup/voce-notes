import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, Mic, MicOff, Waves } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUIStore } from '@/store/uiStore';

// Define action types for clarity
type BotAction = {
  type: 'NAVIGATE';
  payload: {
    path: string;
    state?: any;
  };
} | {
  type: 'CREATE_NOTE';
  payload: { text: string; };
} | {
  type: 'NONE';
};

interface BotResponse {
  text: string;
  action: BotAction;
}

const Chat = () => {
  const { messages, addMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recordingState, startRecording, stopRecording, resetRecording } = useVoiceRecording();
  const { openSpaceSelectionModal } = useUIStore();

  // Auto-start recording if navigated from FAB
  useEffect(() => {
    if (location.state?.startRecording) {
      startRecording();
      window.history.replaceState({}, document.title); // Clear state
    }
  }, [location.state, startRecording]);

  // Handle transcription results
  useEffect(() => {
    if (recordingState.transcribedText) {
      setInputValue(recordingState.transcribedText);
    }
  }, [recordingState.transcribedText]);

  // Process final message when transcription is complete
  useEffect(() => {
    if (!recordingState.isTranscribing && !recordingState.isRecording && recordingState.transcribedText) {
      handleSendMessage(recordingState.transcribedText);
      resetRecording();
    }
  }, [recordingState.isTranscribing, recordingState.isRecording, recordingState.transcribedText, resetRecording]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        text: "Hello! Try 'note to self: buy milk' or 'set alarm for 8am'.",
        is_user: false,
      });
    }
  }, [addMessage, messages.length]);

  const getBotResponse = (message: string): BotResponse => {
    const lowerCaseMessage = message.toLowerCase();
    
    // Note command
    const noteKeywords = ['take a note', 'note to self', 'remember to', 'note down'];
    const noteMatch = noteKeywords.find(kw => lowerCaseMessage.startsWith(kw));
    if (noteMatch) {
      const noteContent = message.substring(noteMatch.length).replace(':', '').trim();
      if (noteContent) {
        return {
          text: `Okay, I've noted that. Where should I save it?`,
          action: { type: 'CREATE_NOTE', payload: { text: noteContent } }
        };
      }
    }

    // Alarm command
    if (lowerCaseMessage.includes('alarm')) {
      const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
      const match = lowerCaseMessage.match(timeRegex);
      if (match) {
        let [_, hourStr, minuteStr, period] = match;
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr ? parseInt(minuteStr, 10) : 0;
        if (period?.toLowerCase() === 'pm' && hour < 12) hour += 12;
        else if (period?.toLowerCase() === 'am' && hour === 12) hour = 0;
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        return {
          text: `Got it. Setting an alarm for ${time}.`,
          action: { type: 'NAVIGATE', payload: { path: '/alarms', state: { time, label: 'Voice Alarm' } } }
        };
      }
      return { text: "I can set an alarm, but I need a time.", action: { type: 'NONE' } };
    }

    if (lowerCaseMessage.includes('time')) return { text: `The current time is ${new Date().toLocaleTimeString()}.`, action: { type: 'NONE' } };
    if (lowerCaseMessage.includes('date')) return { text: `Today's date is ${new Date().toLocaleDateString()}.`, action: { type: 'NONE' } };
    
    return { text: "Sorry, I didn't understand that.", action: { type: 'NONE' } };
  };

  const handleSendMessage = (text: string) => {
    const messageText = text.trim();
    if (messageText === '') return;

    addMessage({ text: messageText, is_user: true });
    const botResponse = getBotResponse(messageText);
    
    setTimeout(() => {
      addMessage({ text: botResponse.text, is_user: false });
      if (botResponse.action.type === 'NAVIGATE') {
        navigate(botResponse.action.payload.path, { state: botResponse.action.payload.state });
      } else if (botResponse.action.type === 'CREATE_NOTE') {
        openSpaceSelectionModal({ text: botResponse.action.payload.text });
      }
    }, 500);

    setInputValue('');
  };

  const handleManualSend = () => handleSendMessage(inputValue);

  const handleRecordingToggle = () => {
    if (recordingState.isRecording) {
      stopRecording();
      toast({
        title: "Processing...",
        description: "Converting speech to text.",
      });
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex items-end gap-2", message.is_user ? "justify-end" : "justify-start")}>
            {!message.is_user && <Avatar className="h-9 w-9 bg-primary text-primary-foreground"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>}
            <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 px-4", message.is_user ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {recordingState.isTranscribing && <div className="text-center text-sm text-muted-foreground">Transcribing...</div>}
      </div>
      
      {(recordingState.isRecording || recordingState.isTranscribing) && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <Waves className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">
              {recordingState.isRecording ? `Recording... ${recordingState.duration.toFixed(1)}s` : 'Processing...'}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
        <div className="relative flex items-center gap-2">
          <Input
            placeholder={recordingState.isRecording ? "Listening..." : "Ask me anything..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSend()}
            className="h-12 rounded-full pr-24"
            disabled={recordingState.isRecording || recordingState.isTranscribing}
          />
          
          <Button 
            onClick={handleRecordingToggle} 
            size="icon" 
            className={cn(
              "absolute right-14 h-9 w-9 rounded-full transition-all",
              recordingState.isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            {recordingState.isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button 
            onClick={handleManualSend} 
            size="icon" 
            className="absolute right-2 h-9 w-9 rounded-full"
            disabled={!inputValue.trim() || recordingState.isRecording || recordingState.isTranscribing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 