"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface Time {
  hour: number; // 0-23
  minute: number;
}

interface ClockTimePickerProps {
  onTimeChange: (time: Time) => void;
  initialTime?: Time;
  isOpen?: boolean;
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({ onTimeChange, initialTime, isOpen }) => {
  const [time, setTime] = React.useState<Time>(initialTime || { hour: 12, minute: 0 });
  const [view, setView] = React.useState<"hours" | "minutes">("hours");

  const ampm = time.hour >= 12 ? "PM" : "AM";
  const displayHour = time.hour % 12 || 12;

  React.useEffect(() => {
    onTimeChange(time);
  }, [time, onTimeChange]);

  React.useEffect(() => {
    if (isOpen) {
      setView("hours");
    }
  }, [isOpen]);

  const handleHourSelect = (selectedHour: number) => {
    const currentAmPm = ampm;
    let newHour = selectedHour;
    if (currentAmPm === 'PM' && selectedHour !== 12) {
      newHour += 12;
    }
    if (currentAmPm === 'AM' && selectedHour === 12) {
      newHour = 0;
    }
    setTime({ ...time, hour: newHour });
    setView("minutes");
  };

  const handleMinuteSelect = (selectedMinute: number) => {
    setTime({ ...time, minute: selectedMinute });
  };

  const handleAmPmChange = (newAmPm: "AM" | "PM") => {
    if (ampm !== newAmPm) {
      setTime(t => ({ ...t, hour: (t.hour + 12) % 24 }));
    }
  };

  const ClockFace = () => {
    const numbers = view === 'hours'
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i * 5);

    const handAngle = view === 'hours'
      ? (displayHour % 12) * 30
      : (time.minute / 5) * 30;

    return (
      <div className="relative w-56 h-56 mx-auto">
        <div className="w-full h-full bg-muted rounded-full" />
        {/* Center Dot */}
        <div className={cn(
          "absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10",
          view === 'hours' ? 'bg-primary' : 'bg-orange-500'
        )} />

        {/* Hand */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 w-[40%] h-0.5 origin-left transition-all duration-300 ease-in-out",
            view === 'hours' ? 'bg-primary' : 'bg-orange-500'
          )}
          style={{
            transform: `rotate(${handAngle - 90}deg)`,
          }}
        />

        {numbers.map((num) => {
          const angle = view === 'hours' ? (num % 12) * 30 : (num / 5) * 30;
          const x = 50 + 40 * Math.cos((angle - 90) * Math.PI / 180);
          const y = 50 + 40 * Math.sin((angle - 90) * Math.PI / 180);
          const isSelected =
            (view === 'hours' && num === displayHour) ||
            (view === 'minutes' && (num === time.minute || (num === 0 && time.minute === 0)));

          return (
            <div
              key={num}
              className={cn(
                "absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors text-sm",
                isSelected && view === 'hours' && "bg-primary text-primary-foreground",
                isSelected && view === 'minutes' && "bg-orange-500 text-white",
                !isSelected && "hover:bg-primary/20"
              )}
              style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => {
                if (view === 'hours') handleHourSelect(num);
                else handleMinuteSelect(num);
              }}
            >
              {view === 'minutes' && num === 0 ? '00' : num}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 w-fit mx-auto">
      <div className="flex items-center justify-center mb-4 text-4xl sm:text-5xl font-mono">
        <div
          className={cn("cursor-pointer p-2 rounded-md transition-colors", view === 'hours' && "bg-primary/10 text-primary")}
          onClick={() => setView('hours')}
        >
          {displayHour.toString().padStart(2, '0')}
        </div>
        <div className="mx-1">:</div>
        <div
          className={cn("cursor-pointer p-2 rounded-md transition-colors", view === 'minutes' && "bg-orange-500/10 text-orange-500")}
          onClick={() => setView('minutes')}
        >
          {time.minute.toString().padStart(2, '0')}
        </div>
        <div className="flex flex-col ml-2 sm:ml-4 space-y-1">
          <Button variant={ampm === "AM" ? "secondary" : "ghost"} size="sm" onClick={() => handleAmPmChange("AM")} className="text-xs h-7 sm:h-8">AM</Button>
          <Button variant={ampm === "PM" ? "secondary" : "ghost"} size="sm" onClick={() => handleAmPmChange("PM")} className="text-xs h-7 sm:h-8">PM</Button>
        </div>
      </div>
      <ClockFace />
    </div>
  );
}; 