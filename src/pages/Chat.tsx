import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Chats Yet</h2>
      <p className="text-muted-foreground mb-6">
        Start a new conversation to begin.
      </p>
      <Button asChild>
        <Link to="/chat/new">
          <Plus className="h-4 w-4 mr-2" />
          Start Chatting
        </Link>
      </Button>
    </div>
  );
};

export default Chat; 