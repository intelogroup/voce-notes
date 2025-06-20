import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Clock, Calendar, Mic, Play, Trash2, Bell } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Alarms = () => {
  const { alarms, toggleAlarm, deleteAlarm } = useAlarmStore();
  const [activeTab, setActiveTab] = useState('today');

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

  const today = new Date();
  const todayAlarms = alarms.filter(a => new Date(a.date).toDateString() === today.toDateString());
  const upcomingAlarms = alarms.filter(a => new Date(a.date) > today);
  const pastAlarms = alarms.filter(a => new Date(a.date) < today && new Date(a.date).toDateString() !== today.toDateString());

  const AlarmCard = ({ alarm }: { alarm: typeof alarms[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <p className="text-xl font-bold">{formatTime(alarm.time)}</p>
            <p className="text-sm text-muted-foreground">{alarm.label || 'Alarm'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{formatDate(alarm.date)}</p>
            {alarm.voiceRecording && (
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Mic className="h-3 w-3" />
                <span>{alarm.voiceRecording.duration.toFixed(1)}s</span>
              </div>
            )}
          </div>
          <Switch
            checked={alarm.isEnabled}
            onCheckedChange={() => toggleAlarm(alarm.id)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message, description }: { message: string, description: string }) => (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <Bell className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{message}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button asChild>
        <Link to="/#record">
          <Plus className="h-4 w-4 mr-2" />
          Create Alarm
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Stats cards */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          {todayAlarms.length > 0 ? (
            <div className="space-y-4 mt-4">
              {todayAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} />)}
            </div>
          ) : (
            <EmptyState message="No Alarms for Today" description="Create a new alarm to get started." />
          )}
        </TabsContent>
        <TabsContent value="upcoming">
          {upcomingAlarms.length > 0 ? (
            <div className="space-y-4 mt-4">
              {upcomingAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} />)}
            </div>
          ) : (
            <EmptyState message="No Upcoming Alarms" description="You're all caught up for the future!" />
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAlarms.length > 0 ? (
            <div className="space-y-4 mt-4">
              {pastAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} />)}
            </div>
          ) : (
            <EmptyState message="No Past Alarms" description="Your history of alarms will appear here." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alarms;
