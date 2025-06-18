
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Clock, Calendar, Mic, Play, Trash2 } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { Link } from 'react-router-dom';

const Alarms = () => {
  const { alarms, toggleAlarm, deleteAlarm } = useAlarmStore();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const playVoiceMessage = (audioBlob: Blob) => {
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play().catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your Alarms
            </h1>
            <p className="text-muted-foreground">
              {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          
          <Link to="/create-alarm">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Alarm
            </Button>
          </Link>
        </div>

        {alarms.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No alarms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first voice alarm to get started
              </p>
              <Link to="/create-alarm">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create First Alarm
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {alarms.map((alarm) => (
              <Card key={alarm.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <CardTitle className="text-2xl font-bold">
                        {formatTime(alarm.time)}
                      </CardTitle>
                    </div>
                    <Switch
                      checked={alarm.isEnabled}
                      onCheckedChange={() => toggleAlarm(alarm.id)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(alarm.date)}
                      </div>
                      
                      {alarm.label && (
                        <p className="text-sm font-medium mb-2">{alarm.label}</p>
                      )}
                      
                      {alarm.voiceRecording && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mic className="h-4 w-4" />
                          Voice message ({alarm.voiceRecording.duration.toFixed(1)}s)
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {alarm.voiceRecording && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => playVoiceMessage(alarm.voiceRecording!.audioBlob)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteAlarm(alarm.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alarms;
