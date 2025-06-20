import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notes = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Notes Yet</h2>
      <p className="text-muted-foreground mb-6">
        Create your first note to get started.
      </p>
      <Button asChild>
        <Link to="/notes/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </Link>
      </Button>
    </div>
  );
};

export default Notes; 