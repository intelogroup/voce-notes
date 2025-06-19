
import React, { useState } from 'react';
import { useAlarmStore } from '@/store/alarmStore';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Mic, Play, Edit, Trash2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AlarmsTab = () => {
  const { alarms, toggleAlarm, deleteAlarm } = useAlarmStore();
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const today = new Date().toDateString();

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === today
  );

  const upcomingAlarms = alarms.filter(alarm => 
    new Date(alarm.date) > now
  );

  const pastAlarms = alarms.filter(alarm => 
    new Date(alarm.date) < now && new Date(alarm.date).toDateString() !== today
  );

  const filteredAlarms = (alarmList: typeof alarms) => 
    alarmList.filter(alarm => 
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery)
    );

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

  const getTimeUntilAlarm = (time: string, date: Date) => {
    const [hours, minutes] = time.split(':');
    const alarmTime = new Date(date);
    alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const diff = alarmTime.getTime() - now.getTime();
    const hours_diff = Math.floor(diff / (1000 * 60 * 60));
    const minutes_diff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours_diff > 0) {
      return `${hours_diff}h ${minutes_diff}m`;
    }
    return `${minutes_diff}m`;
  };

  const AlarmCard = ({ alarm, showCountdown = false }: { alarm: any, showCountdown?: boolean }) => (
    <GlassCard variant="subtle" className="mb-3 hover:bg-white/10 transition-all duration-300">
      <GlassCardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-bold text-white">
                {formatTime(alarm.time)}
              </div>
              {showCountdown && alarm.isEnabled && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {getTimeUntilAlarm(alarm.time, alarm.date)}
                </Badge>
              )}
              {!alarm.isEnabled && (
                <Badge variant="outline" className="border-white/20 text-white/60">
                  Disabled
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
              <Calendar className="h-4 w-4" />
              {formatDate(alarm.date)}
            </div>
            
            {alarm.label && (
              <p className="text-white/80 font-medium mb-2">{alarm.label}</p>
            )}
            
            {alarm.voiceRecording && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mic className="h-4 w-4" />
                Voice message ({alarm.voiceRecording.duration.toFixed(1)}s)
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={alarm.isEnabled}
              onCheckedChange={() => toggleAlarm(alarm.id)}
            />
            
            <div className="flex gap-1">
              {alarm.voiceRecording && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => deleteAlarm(alarm.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-28 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Alarms</h1>
            <p className="text-white/60">
              {alarms.length} alarm{alarms.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Alarm
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search alarms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="today" className="data-[state=active]:bg-white/20">
              Today ({todayAlarms.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/20">
              Upcoming ({upcomingAlarms.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-white/20">
              Past ({pastAlarms.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6">
            {filteredAlarms(todayAlarms).length > 0 ? (
              <div className="space-y-3">
                {filteredAlarms(todayAlarms).map((alarm) => (
                  <AlarmCard key={alarm.id} alarm={alarm} showCountdown={true} />
                ))}
              </div>
            ) : (
              <GlassCard variant="subtle" className="text-center py-12">
                <GlassCardContent>
                  <Clock className="h-16 w-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No alarms today</h3>
                  <p className="text-white/60">Create an alarm to get started</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {filteredAlarms(upcomingAlarms).length > 0 ? (
              <div className="space-y-3">
                {filteredAlarms(upcomingAlarms).map((alarm) => (
                  <AlarmCard key={alarm.id} alarm={alarm} />
                ))}
              </div>
            ) : (
              <GlassCard variant="subtle" className="text-center py-12">
                <GlassCardContent>
                  <Calendar className="h-16 w-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No upcoming alarms</h3>
                  <p className="text-white/60">Schedule future alarms here</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {filteredAlarms(pastAlarms).length > 0 ? (
              <div className="space-y-3">
                {filteredAlarms(pastAlarms).map((alarm) => (
                  <AlarmCard key={alarm.id} alarm={alarm} />
                ))}
              </div>
            ) : (
              <GlassCard variant="subtle" className="text-center py-12">
                <GlassCardContent>
                  <Clock className="h-16 w-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No past alarms</h3>
                  <p className="text-white/60">Your alarm history will appear here</p>
                </GlassCardContent>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlarmsTab;
