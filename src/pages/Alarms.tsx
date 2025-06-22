import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Clock, Mic, Play, Trash2, Bell, ChevronRight, Copy } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { CreateAlarm } from '@/pages/CreateAlarm';
import { useUIStore } from '@/store/uiStore';
import { format, isToday, isPast } from 'date-fns';
import { ToggleCheck } from '@/components/ui/toggle-check';

const Alarms = () => {
  const { alarms, toggleAlarm, deleteAlarm, duplicateAlarm, setActiveAlarm } = useAlarmStore();
  const { isCreateAlarmModalOpen, setCreateAlarmModalOpen } = useUIStore();
  const [activeTab, setActiveTab] = useState('today');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.time) {
      setCreateAlarmModalOpen(true);
    }
  }, [location.state, setCreateAlarmModalOpen]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return {
      time: `${displayHour}:${minutes}`,
      ampm: ampm
    };
  };

  const getRepeatDaysString = (days: string[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 5 && days.every(d => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(d))) return "Weekdays";
    if (days.length === 0) return null;
    return days.map(day => day.substring(0, 2).toUpperCase()).join(', ');
  }

  const playVoiceMessage = (audioBlob: Blob | undefined) => {
    if (!audioBlob) return;
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play().catch(console.error);
  };

  const today = new Date();
  const todayAlarms = alarms.filter(a => isToday(new Date(a.date)));
  const upcomingAlarms = alarms.filter(a => new Date(a.date) > today && !isToday(new Date(a.date)));
  const pastAlarms = alarms.filter(a => isPast(new Date(a.date)) && !isToday(new Date(a.date)));

  interface AlarmCardProps {
    alarm: typeof alarms[0];
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
  }

  const AlarmCard = ({ alarm, onDuplicate, onDelete, onToggle }: AlarmCardProps) => {
    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDuplicate(alarm.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(alarm.id);
    };

    const { time, ampm } = formatTime(alarm.time);
    const repeatDays = getRepeatDaysString(alarm.repeatDays);

    return (
        <div className="relative w-full overflow-hidden rounded-md">
             <motion.div
                className="absolute right-0 top-0 bottom-0 flex items-center"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <Button onClick={handleDuplicate} variant="ghost" className="h-full w-24 bg-blue-500 text-white rounded-none hover:bg-blue-600">
                    <Copy className="h-5 w-5" />
                </Button>
                <Button onClick={handleDelete} variant="ghost" className="h-full w-24 bg-destructive text-destructive-foreground rounded-none hover:bg-destructive/90">
                    <Trash2 className="h-5 w-5" />
                </Button>
            </motion.div>
            <motion.div
                drag="x"
                dragConstraints={{ left: -160, right: 0 }}
                className="relative z-10 bg-background"
            >
                <Card className={cn("hover:shadow-md transition-shadow rounded-md border-l-4", alarm.isEnabled ? "border-l-primary" : "border-l-transparent")}>
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">{time}</span>
                                <span className="text-md font-medium text-muted-foreground">{ampm}</span>
                            </div>
                            <ToggleCheck checked={alarm.isEnabled} onChange={() => onToggle(alarm.id)} />
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium">{alarm.label || 'Alarm'}</p>
                                <p className="text-xs text-muted-foreground">
                                    {repeatDays ? `${repeatDays}` : (!isToday(new Date(alarm.date)) ? format(new Date(alarm.date), 'EEE, d MMM') : 'Today')}
                                </p>
                            </div>
                            {alarm.voiceRecording && (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playVoiceMessage(alarm.voiceRecording?.audioBlob)}>
                                    <Play className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
  };

  const EmptyState = ({ message, description }: { message: string, description: string }) => (
    <div className="flex flex-col items-center justify-center h-[30vh] text-center">
      <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
      <h2 className="text-xl font-semibold mb-1">{message}</h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">{description}</p>
      <Button size="sm" onClick={() => setCreateAlarmModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Alarm
      </Button>
    </div>
  );

  return (
    <>
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <CleanCard 
            className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                activeTab === 'today' && "ring-2 ring-primary/50"
            )} 
            onClick={() => setActiveTab('today')}
        >
          <CleanCardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-bold">{todayAlarms.length}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </CleanCardContent>
        </CleanCard>
        <CleanCard className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/alarms/bank')}>
          <CleanCardContent className="p-3 text-center">
            <Mic className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <div className="text-2xl font-bold">{alarms.filter(a => a.voiceRecording).length}</div>
            <div className="text-xs text-muted-foreground">Recordings</div>
          </CleanCardContent>
        </CleanCard>
        <CleanCard className="cursor-pointer hover:shadow-md transition-shadow">
          <CleanCardContent className="p-3 text-center">
            <Bell className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <div className="text-2xl font-bold">{alarms.filter(a => a.isEnabled).length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CleanCardContent>
        </CleanCard>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          {todayAlarms.length > 0 ? (
            <div className="space-y-3 mt-4">
              {todayAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} onToggle={toggleAlarm} onDelete={deleteAlarm} onDuplicate={duplicateAlarm} />)}
            </div>
          ) : (
            <EmptyState message="No Alarms for Today" description="Create a new alarm to get started." />
          )}
        </TabsContent>
        <TabsContent value="upcoming">
          {upcomingAlarms.length > 0 ? (
            <div className="space-y-3 mt-4">
              {upcomingAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} onToggle={toggleAlarm} onDelete={deleteAlarm} onDuplicate={duplicateAlarm} />)}
            </div>
          ) : (
            <EmptyState 
              message="No Upcoming Alarms" 
              description="You're all set for the future. Create a new alarm to see it here." 
            />
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAlarms.length > 0 ? (
            <div className="space-y-3 mt-4">
              {pastAlarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} onToggle={toggleAlarm} onDelete={deleteAlarm} onDuplicate={duplicateAlarm} />)}
            </div>
          ) : (
            <EmptyState 
              message="No Past Alarms"
              description="Your history of triggered alarms will appear here."
            />
          )}
        </TabsContent>
      </Tabs>

    </div>
    <CreateAlarm 
        isOpen={isCreateAlarmModalOpen} 
        onClose={() => setCreateAlarmModalOpen(false)}
        initialTime={location.state?.time}
        initialLabel={location.state?.label}
    />
    </>
  );
};

export default Alarms;
