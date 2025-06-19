
import React, { useState } from 'react';
import { EnhancedMobileNavigation } from '@/components/enhanced-mobile-navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Bell, User, Play, Square, RotateCcw, Check, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAlarmStore } from '@/store/alarmStore';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { FloatingButton } from '@/components/ui/floating-button';
import { StatsWidget } from '@/components/ui/stats-widget';
import { WaveformVisualizer } from '@/components/ui/waveform-visualizer';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, startRecording, stopRecording, resetRecording, createVoiceRecording } = useVoiceRecording();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const { addAlarm, alarms } = useAlarmStore();
  const { toast } = useToast();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const handleRecordClick = () => {
    if (recordingState.isRecording) {
      stopRecording();
    } else if (recordingState.audioUrl) {
      setShowAlarmDialog(true);
    } else {
      startRecording();
    }
  };

  const handlePlayback = () => {
    if (recordingState.audioUrl) {
      const audio = new Audio(recordingState.audioUrl);
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleSaveAlarm = async () => {
    if (!alarmTime || !alarmLabel || !recordingState.audioUrl) return;

    const recording = await createVoiceRecording();
    if (recording) {
      addAlarm({
        time: alarmTime,
        date: selectedDate,
        label: alarmLabel,
        isEnabled: true,
        voiceRecording: recording,
        repeatDays: [],
      });

      toast({
        title: "🎉 Alarm Created Successfully!",
        description: `Voice alarm set for ${alarmTime} on ${selectedDate.toDateString()}`,
      });

      setShowAlarmDialog(false);
      setAlarmTime('');
      setAlarmLabel('');
      resetRecording();
    }
  };

  const todayAlarms = alarms.filter(alarm => 
    new Date(alarm.date).toDateString() === new Date().toDateString()
  );

  const stats = [
    {
      label: 'Today\'s Alarms',
      value: todayAlarms.length,
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-blue-500/20 text-blue-300'
    },
    {
      label: 'Total Recordings',
      value: alarms.filter(a => a.voiceRecording).length,
      icon: <Mic className="h-5 w-5" />,
      color: 'bg-purple-500/20 text-purple-300'
    },
    {
      label: 'Active Alarms',
      value: alarms.filter(a => a.isEnabled).length,
      icon: <Bell className="h-5 w-5" />,
      color: 'bg-green-500/20 text-green-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Enhanced Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white">Voce Alarm</span>
              <div className="text-xs text-white/60">Voice-powered wake ups</div>
            </div>
          </div>

          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900/95 backdrop-blur-xl border-gray-700">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex items-center space-x-4 pb-4 border-b border-gray-700">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-white">John Doe</h3>
                    <p className="text-sm text-gray-400">john@example.com</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Pro Member</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <User className="h-4 w-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    Settings
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <EnhancedMobileNavigation />
      
      <div className="container mx-auto px-4 py-6 pb-28 max-h-screen overflow-y-auto relative z-10">
        {/* Enhanced Greeting Card */}
        <GlassCard variant="default" className="mb-6">
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <GlassCardTitle className="text-2xl mb-2">
                  {getGreeting()} ✨
                </GlassCardTitle>
                <p className="text-white/70 text-sm">
                  Perfect {getTimeOfDay()} to set your voice alarms
                </p>
              </div>
              <div className="text-right">
                <div className="text-white/90 text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-white/60 text-xs">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </GlassCardHeader>
        </GlassCard>

        {/* Stats Widget */}
        <StatsWidget stats={stats} />

        {/* Enhanced Calendar with Recording Integration */}
        <div className="relative">
          <GlassCard variant="default" className="calendar-with-button mb-0 relative overflow-visible">
            <GlassCardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                classNames={{
                  months: "flex w-full flex-col space-y-2",
                  month: "space-y-2 w-full flex flex-col",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-lg font-semibold text-white/90",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-white/60 rounded-md w-full font-medium text-sm flex-1 text-center",
                  row: "flex w-full mt-2",
                  cell: "h-10 w-full text-center text-sm p-0 relative flex-1",
                  day: cn(
                    "h-10 w-full p-0 font-medium aria-selected:opacity-100 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white text-sm text-white/70 rounded-lg transition-all duration-200"
                  ),
                  day_selected: "bg-gradient-to-br from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 focus:from-purple-600 focus:to-blue-700 shadow-lg",
                  day_today: "bg-white/10 text-white font-bold ring-2 ring-white/20",
                  day_outside: "text-white/30 opacity-50",
                  day_disabled: "text-white/20 opacity-30",
                }}
              />
              
              {/* Enhanced deformation effect */}
              <div className="calendar-bottom-deform h-12 relative">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b from-transparent to-white/5 transition-all duration-500 ease-out",
                  "rounded-b-xl",
                  recordingState.isRecording || recordingState.audioUrl
                    ? "record-indent opacity-100" 
                    : "opacity-0"
                )}>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Recording Timer with Waveform */}
          {recordingState.isRecording && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-40">
              <GlassCard variant="strong" className="px-4 py-2">
                <GlassCardContent className="p-0 flex items-center gap-3">
                  <div className="text-red-400 text-sm font-bold">
                    {recordingState.duration.toFixed(1)}s
                  </div>
                  <WaveformVisualizer isRecording={recordingState.isRecording} />
                </GlassCardContent>
              </GlassCard>
            </div>
          )}

          {/* Enhanced Floating Record Button */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-50">
            <FloatingButton
              onClick={handleRecordClick}
              variant={
                recordingState.isRecording 
                  ? "danger" 
                  : recordingState.audioUrl 
                  ? "success" 
                  : "primary"
              }
              size="xl"
              isLoading={false}
              className={cn(
                recordingState.isRecording && "animate-pulse shadow-red-500/40",
                recordingState.audioUrl && "shadow-green-500/40"
              )}
            >
              {recordingState.isRecording ? (
                <Square className="h-8 w-8 text-white" />
              ) : recordingState.audioUrl ? (
                <Check className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </FloatingButton>
          </div>
        </div>

        {/* Enhanced Recording Controls */}
        {recordingState.audioUrl && !recordingState.isRecording && (
          <div className="mt-20 flex justify-center gap-4">
            <Button
              onClick={handlePlayback}
              disabled={isPlaying}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              {isPlaying ? 'Playing...' : 'Preview'}
            </Button>

            <Button
              onClick={resetRecording}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Re-record
            </Button>
          </div>
        )}

        <div className="h-16"></div>
      </div>

      {/* Enhanced Alarm Creation Dialog */}
      <Dialog open={showAlarmDialog} onOpenChange={setShowAlarmDialog}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Create Voice Alarm
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white/90 font-medium">Alarm Time</Label>
              <Input
                id="time"
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="bg-white/10 border-white/20 text-white text-lg h-12 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label" className="text-white/90 font-medium">Alarm Label</Label>
              <Input
                id="label"
                placeholder="Enter alarm label"
                value={alarmLabel}
                onChange={(e) => setAlarmLabel(e.target.value)}
                className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
              />
            </div>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-white/70">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">Date: {selectedDate.toDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Mic className="h-4 w-4" />
                <span>Recording Duration: {recordingState.duration.toFixed(1)}s</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAlarmDialog(false)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAlarm}
                disabled={!alarmTime || !alarmLabel}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0"
              >
                <Check className="h-4 w-4 mr-2" />
                Create Alarm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .calendar-with-button {
          position: relative;
          overflow: visible;
        }
        
        .calendar-bottom-deform {
          background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 100%);
        }
        
        .record-indent {
          clip-path: polygon(
            0% 0%, 
            35% 0%, 
            40% 40%, 
            50% 70%, 
            60% 40%, 
            65% 0%, 
            100% 0%, 
            100% 100%, 
            0% 100%
          );
          background: linear-gradient(
            180deg, 
            rgba(255,255,255,0.05) 0%, 
            rgba(147,51,234,0.1) 100%
          );
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Index;
