import React from 'react';
import { useAlarmStore } from '@/store/alarmStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Trash2, Music, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AudioBank = () => {
  const navigate = useNavigate();
  // This is a placeholder. We will implement the logic to get unique recordings.
  const recordings = []; 

  const handlePlay = (blob: Blob) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Audio Bank</h1>
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-16">
          <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No Recordings Yet</h3>
          <p className="text-muted-foreground mt-2">
            Your saved alarm sounds will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* We will map over actual recordings here */}
        </div>
      )}
    </div>
  );
};

export default AudioBank; 