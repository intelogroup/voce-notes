
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Mic, Bell } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';

const Record = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { recordingState, startRecording, stopRecording } = useVoiceRecording();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-foreground mb-2">Record</h1>
        </div>

        {/* Greeting Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {getGreeting()}
                </h2>
                <p className="text-muted-foreground">
                  Ready to set your voice alarms?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-purple-400"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
              classNames={{
                months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full flex flex-col",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-lg font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm flex-1 text-center",
                row: "flex w-full mt-2",
                cell: "h-12 w-full text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                ),
                day_selected: "bg-purple-500 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </CardContent>
        </Card>

        {/* Floating Record Button */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2">
          <Button
            size="icon"
            className={cn(
              "h-20 w-20 rounded-full shadow-lg transition-all duration-200",
              recordingState.isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-purple-500 hover:bg-purple-600"
            )}
            onClick={recordingState.isRecording ? stopRecording : startRecording}
          >
            <Mic className="h-8 w-8 text-white" />
          </Button>
        </div>

        {/* Recording Timer */}
        {recordingState.isRecording && (
          <div className="fixed bottom-56 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {recordingState.duration.toFixed(1)}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;
