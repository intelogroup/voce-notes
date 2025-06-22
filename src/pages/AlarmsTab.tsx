import React, { useState } from 'react';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Clock, Calendar as CalendarIcon, Mic, Trash2, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlarmStore } from '@/store/alarmStore';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

const AlarmsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { alarms, toggleAlarm, removeAlarm } = useAlarmStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const processAlarms = (filterFn: (alarm: any) => boolean) => {
    return alarms.filter(filterFn).reduce((acc, alarm) => {
      const date = new Date(alarm.date);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (!acc[dateString]) {
        acc[dateString] = 0;
      }
      acc[dateString]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const todayAlarmsByDate = processAlarms(a => new Date(a.date).toDateString() === today.toDateString());
  const upcomingAlarmsByDate = processAlarms(a => new Date(a.date) > today);
  const pastAlarmsByDate = processAlarms(a => new Date(a.date) < today);

  const selectedDayAlarms = alarms.filter(alarm => 
    selectedDate && new Date(alarm.date).toDateString() === selectedDate.toDateString()
  );

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === today.toDateString()
  );
  const upcomingAlarms = alarms.filter(alarm => 
    new Date(alarm.date) > today
  );
  const pastAlarms = alarms.filter(alarm => 
    new Date(alarm.date) < today
  );

  const filteredAlarms = (alarmList: typeof alarms) => {
    if (!searchQuery) return alarmList;
    return alarmList.filter(alarm => 
      alarm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.time.includes(searchQuery)
    );
  };

  const AlarmCard = ({ alarm, showDate = false }: { alarm: any, showDate?: boolean }) => (
    <CleanCard className="transition-all duration-200 hover:shadow-md border-border/50">
      <CleanCardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-semibold text-foreground tracking-tight">
                {alarm.time}
              </div>
              <Badge 
                variant={alarm.isEnabled ? "default" : "secondary"} 
                className={cn(
                  "text-xs font-medium",
                  alarm.isEnabled 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {alarm.isEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{alarm.label}</div>
              
              {showDate && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(alarm.date).toLocaleDateString()}
                </div>
              )}
              
              {alarm.voiceRecording && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mic className="h-3 w-3" />
                  Voice message attached
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={alarm.isEnabled}
              onCheckedChange={() => toggleAlarm(alarm.id)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
    <div className="text-center py-16">
      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
      <p className="text-muted-foreground font-medium">{message}</p>
      <p className="text-sm text-muted-foreground/60 mt-1">Create your first alarm to get started</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">Alarms</h1>
          </div>
          <Link to="/create-alarm">
            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              New Alarm
            </Button>
          </Link>
        </div>
      </nav>

      <EnhancedMobileNavigation />

      <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alarms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-background border-border/60 focus:border-primary/60"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <CleanCard className="border-border/50">
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayAlarms.length}</div>
              <div className="text-sm text-muted-foreground font-medium">Today</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard className="border-border/50">
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{upcomingAlarms.length}</div>
              <div className="text-sm text-muted-foreground font-medium">Upcoming</div>
            </CleanCardContent>
          </CleanCard>
          <CleanCard className="border-border/50">
            <CleanCardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{pastAlarms.length}</div>
              <div className="text-sm text-muted-foreground font-medium">Past</div>
            </CleanCardContent>
          </CleanCard>
        </div>

        {/* Alarm Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 h-11 rounded-lg">
            <TabsTrigger 
              value="today" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium"
            >
              Today
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium"
            >
              Past
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium"
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-3 mt-6">
            {filteredAlarms(todayAlarms).length > 0 ? (
              filteredAlarms(todayAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} />
              ))
            ) : (
              <EmptyState message="No alarms for today" />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 mt-6">
            {filteredAlarms(upcomingAlarms).length > 0 ? (
              filteredAlarms(upcomingAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} showDate />
              ))
            ) : (
              <EmptyState message="No upcoming alarms" />
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-3 mt-6">
            {filteredAlarms(pastAlarms).length > 0 ? (
              filteredAlarms(pastAlarms).map((alarm) => (
                <AlarmCard key={alarm.id} alarm={alarm} showDate />
              ))
            ) : (
              <EmptyState message="No past alarms" />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                todayAlarmsByDate={todayAlarmsByDate}
                upcomingAlarmsByDate={upcomingAlarmsByDate}
                pastAlarmsByDate={pastAlarmsByDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-3 mt-6">
              {selectedDayAlarms.length > 0 ? (
                selectedDayAlarms.map((alarm) => (
                  <AlarmCard key={alarm.id} alarm={alarm} showDate />
                ))
              ) : (
                <EmptyState message="No alarms for this day" />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlarmsTab;
