import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  todayAlarmsByDate?: Record<string, number>;
  upcomingAlarmsByDate?: Record<string, number>;
  pastAlarmsByDate?: Record<string, number>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  todayAlarmsByDate = {},
  upcomingAlarmsByDate = {},
  pastAlarmsByDate = {},
  ...props
}: CalendarProps) {
  const DayContent = (dayProps: DayProps) => {
    const date = dayProps.date;
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    
    const todayAlarmCount = todayAlarmsByDate[dateString];
    const upcomingAlarmCount = upcomingAlarmsByDate[dateString];
    const pastAlarmCount = pastAlarmsByDate[dateString];

    let marker = null;

    if (todayAlarmCount > 0) {
      marker = (
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
          {todayAlarmCount}
        </div>
      );
    } else if (upcomingAlarmCount > 0) {
      marker = (
        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
          {upcomingAlarmCount}
        </div>
      );
    } else if (pastAlarmCount > 0) {
      marker = (
        <div className="absolute top-0 right-0 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-[10px]">
          {pastAlarmCount}
        </div>
      );
    }

    return (
      <>
        {date.getDate()}
        {marker}
      </>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: DayContent,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
