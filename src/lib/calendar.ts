import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  durationMinutes?: number;
}

function toVCalendarDate(date: Date): string {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

export function createIcsFileContent(event: CalendarEvent): string {
  const { title, description, startDate } = event;
  const durationMinutes = event.durationMinutes || 30;

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//voce-notes//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${new Date().toISOString()}@voce-notes.com`,
    `DTSTAMP:${toVCalendarDate(new Date())}`,
    `DTSTART:${toVCalendarDate(startDate)}`,
    `DTEND:${toVCalendarDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
} 