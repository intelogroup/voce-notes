
import React, { useState } from 'react';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Clock, Calendar, Mic, Trash2, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlarmStore } from '@/store/alarmStore';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const AlarmsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { alarms, toggleAlarm, removeAlarm } = useAlarmStore();

  const today = new Date().toDateString();
  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === today
  );
  const upcomingAlarms = alarms.filter(alarm => 
    new Date(alarm.date) > new Date() && new Date(alarm.date).toDateString() !== today
  );
  const pastAlarms = alarms.filter(alarm => 
    new Date(alarm.date) < new Date() && new Date(alarm.date).toDateString() !== today
  );

  const filteredAlarms = (alarmList: typeof alarms) => {
    if (!searchQuery) return alarmList;
    return alarmList.filter(alarm => 
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery)
    );
  };

  const AlarmCard = ({ alarm, showDate = false }: { alarm: any, showDate?: boolean }) => (
    <CleanCard className="transition-all hover:shadow-md">
      <CleanCardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl font-bold">{alarm.time}</div>
              <Badge variant={alarm.isEnabled ? "default" : "secondary"}>
                {alarm.isEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-1">{alarm.label}</div>
            {showDate && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(alarm.date).toLocaleDateString()}
              </div>
            )}
            {alarm.voiceRecording && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Mic className="h-3 w-3" />
                Voice recording attached
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={alarm.isEnabled}
              onCheckedChange={() => toggleAlarm(alarm.id)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive"
              onClick={() => removeAlarm(alarm.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CleanCardContent>
    </CleanCard>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-8">
      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Alarms</h1>
          </div>
          <Link to="/create-alarm">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </Link>
        </div>
      </nav>

      <EnhancedMobileNavigation />

      <div className="container mx-auto px-4 py-6 pb-20 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alarms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{todayAlarms.length}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{upcomingAlarms.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard>
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{pastAlarms.length}</div>
              <div className="text-sm text-muted-foreground">Past</div>
            </CleanCardContent>
          </CleanCard>
        </div>

        {/* Alarm Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-6">
            {filteredAlarms(todayAlarms).length > 0 ? (
              filteredAlarms(todayAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} />
              ))
            ) : (
              <EmptyState message="No alarms for today" />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {filteredAlarms(upcomingAlarms).length > 0 ? (
              filteredAlarms(upcomingAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} showDate />
              ))
            ) : (
              <EmptyState message="No upcoming alarms" />
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {filteredAlarms(pastAlarms).length > 0 ? (
              filteredAlarms(pastAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} showDate />
              ))
            ) : (
              <EmptyState message="No past alarms" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlarmsTab;
