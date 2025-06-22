import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Bell, User, Clock, Calendar as CalendarIcon, Plus, Timer, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { useNoteStore } from '@/store/noteStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CleanCard, CleanCardContent, CleanCardHeader, CleanCardTitle } from '@/components/ui/clean-card';
import { CalendarRecordingModal } from '@/components/ui/calendar-recording-modal';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNowStrict, differenceInDays, isToday } from 'date-fns';

const Index = () => {
  const { alarms } = useAlarmStore();
  const { notes } = useNoteStore();
  const { toast } = useToast();

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getNextAlarmInfo = () => {
    const now = new Date();
    const sortedAlarms = alarms
      .filter(a => a.isEnabled)
      .map(a => {
        const [hour, minute] = a.time.split(':');
        const alarmDate = new Date(a.date);
        alarmDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        return { ...a, alarmDate };
      })
      .filter(a => a.alarmDate > now)
      .sort((a, b) => a.alarmDate.getTime() - b.alarmDate.getTime());

    if (sortedAlarms.length > 0) {
      const nextAlarm = sortedAlarms[0];
      const timeToAlarm = formatDistanceToNowStrict(nextAlarm.alarmDate, { addSuffix: true });
      
      let displayText = `Next: ${timeToAlarm}`;
      if (!isToday(nextAlarm.alarmDate)) {
        const daysToAlarm = differenceInDays(nextAlarm.alarmDate, now);
        displayText = `Next: in ${daysToAlarm} day(s)`;
      }

      return {
        label: nextAlarm.label,
        time: format(nextAlarm.alarmDate, 'p'),
        displayText: displayText,
      };
    }

    return null;
  };
  
  const nextAlarmInfo = getNextAlarmInfo();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      toast({
        title: "Invalid Date",
        description: "Cannot select past dates",
        variant: "destructive",
      });
      return;
    }

    setSelectedDate(date);

    if (selectedDay >= today) {
      setShowCalendarModal(true);
    }
  };

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === new Date().toDateString()
  );
  
  const upcomingAlarms = alarms
    .filter(a => new Date(a.date) > new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
    
  const recentNote = notes.length > 0
    ? [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : undefined;
  
  const todayAlarmsByDate = alarms.reduce((acc, alarm) => {
    const dateStr = format(new Date(alarm.date), 'yyyy-MM-dd');
    if (isToday(new Date(alarm.date))) {
        if (!acc[dateStr]) acc[dateStr] = 0;
        acc[dateStr]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const upcomingAlarmsByDate = alarms.reduce((acc, alarm) => {
    const dateStr = format(new Date(alarm.date), 'yyyy-MM-dd');
    if (new Date(alarm.date) > new Date() && !isToday(new Date(alarm.date))) {
        if (!acc[dateStr]) acc[dateStr] = 0;
        acc[dateStr]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const pastAlarmsByDate = alarms.reduce((acc, alarm) => {
    const dateStr = format(new Date(alarm.date), 'yyyy-MM-dd');
    if (new Date(alarm.date) < new Date() && !isToday(new Date(alarm.date))) {
        if (!acc[dateStr]) acc[dateStr] = 0;
        acc[dateStr]++;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <CleanCard>
        <CleanCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CleanCardTitle className="text-xl mb-1">
                {getGreeting()}
              </CleanCardTitle>
              <p className="text-sm text-muted-foreground">
                {format(currentTime, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {format(currentTime, 'p')}
              </div>
               {nextAlarmInfo && (
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1.5 mt-1">
                   <Bell className="h-3 w-3 text-amber-500" />
                   {nextAlarmInfo.label} - {nextAlarmInfo.displayText}
                </p>
              )}
            </div>
          </div>
        </CleanCardHeader>
      </CleanCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <CleanCard>
              <CleanCardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="w-full"
                  todayAlarmsByDate={todayAlarmsByDate}
                  upcomingAlarmsByDate={upcomingAlarmsByDate}
                  pastAlarmsByDate={pastAlarmsByDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const checkDate = new Date(date);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate < today;
                  }}
                  classNames={{
                    months: "flex w-full flex-col space-y-4",
                    month: "space-y-4 w-full flex flex-col",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-full text-center text-sm p-0 relative flex-1 flex items-center justify-center",
                    day: cn(
                      "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm transition-colors relative"
                    ),
                    day_selected:
                      "bg-blue-700 text-white hover:bg-blue-800 focus:bg-blue-700 focus:text-white rounded-full",
                    day_today: "bg-accent text-accent-foreground rounded-full",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                  }}
                />
              </CleanCardContent>
            </CleanCard>
        </div>

        <div className="space-y-6">
            {/* Upcoming Alarms */}
            <CleanCard>
              <CleanCardHeader>
                <CleanCardTitle>Upcoming Alarms</CleanCardTitle>
              </CleanCardHeader>
              <CleanCardContent>
                {upcomingAlarms.length > 0 ? (
                  <ul className="space-y-3">
                    {upcomingAlarms.map(alarm => (
                      <li key={alarm.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {alarm.label || 'Untitled Alarm'}
                            {alarm.voiceRecording && <Mic className="h-3 w-3 text-muted-foreground" />}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(alarm.date), 'EEE, MMM d')} at {alarm.time}
                          </p>
                        </div>
                        <Bell className="h-4 w-4 text-amber-500" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming alarms.</p>
                )}
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                    <Link to="/alarms">
                        View All
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
              </CleanCardContent>
            </CleanCard>
            
            {/* Recent Note */}
            <CleanCard>
              <CleanCardHeader>
                <CleanCardTitle>Recent Note</CleanCardTitle>
              </CleanCardHeader>
              <CleanCardContent>
                {recentNote ? (
                    <div>
                        <h4 className="font-semibold">{recentNote.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {recentNote.content}
                        </p>
                    </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent notes.</p>
                )}
                <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                    <Link to="/notes">
                        View All Notes
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
              </CleanCardContent>
            </CleanCard>
        </div>
      </div>

      {/* Calendar Recording Modal */}
      <CalendarRecordingModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Index;
