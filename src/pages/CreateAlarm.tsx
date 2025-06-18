
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Mic, Save } from 'lucide-react';
import { useAlarmStore } from '@/store/alarmStore';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CreateAlarm = () => {
  const navigate = useNavigate();
  const { addAlarm } = useAlarmStore();
  
  const [time, setTime] = useState('07:00');
  const [date, setDate] = useState<Date>(new Date());
  const [label, setLabel] = useState('');
  const [voiceRecording, setVoiceRecording] = useState(null);

  const handleSaveAlarm = () => {
    addAlarm({
      time,
      date,
      label: label || 'Wake up',
      isEnabled: true,
      voiceRecording,
      repeatDays: [],
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create Alarm</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-2xl font-bold h-16 text-center"
              />
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Label */}
          <Card>
            <CardHeader>
              <CardTitle>Label (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Wake up, Meeting, Medication..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-12"
              />
            </CardContent>
          </Card>

          {/* Voice Recording */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceRecorder onRecordingComplete={setVoiceRecording} />
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSaveAlarm} 
            size="lg" 
            className="w-full h-14 text-lg gap-2"
          >
            <Save className="h-5 w-5" />
            Save Alarm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlarm;
