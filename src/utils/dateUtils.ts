import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  parseISO,
  getDay,
  addDays,
  addWeeks,
  addMonths as addMonthsFn,
  isWithinInterval,
  isBefore,
  isAfter,
} from 'date-fns';
import { CalendarDay, CalendarMonth, CalendarEvent, RecurrencePattern } from '../types';

// Get all days in a month including days from previous/next month to fill the calendar grid
export const getCalendarMonth = (date: Date, events: CalendarEvent[]): CalendarMonth => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(
    (day) => ({
      date: day,
      isCurrentMonth: isSameMonth(day, monthStart),
      isToday: isToday(day),
      events: getEventsForDay(day, events),
    })
  );

  return {
    days: calendarDays,
    month: monthStart.getMonth(),
    year: monthStart.getFullYear(),
  };
};

// Get events for a specific day, including recurring events
export const getEventsForDay = (day: Date, events: CalendarEvent[]): CalendarEvent[] => {
  const dayEvents = events.filter(event => {
    // Direct match for the day
    if (isSameDay(day, event.date)) {
      return true;
    }
    
    // Check if it's a recurring event
    if (event.recurrence && event.recurrence.type !== 'none') {
      return isRecurringEventOnDay(event, day);
    }
    
    return false;
  });
  
  return dayEvents;
};

export const isRecurringEventOnDay = (event: CalendarEvent, day: Date): boolean => {
  const { recurrence } = event;
  if (!recurrence || recurrence.type === 'none') return false;
  
  // Don't show recurring events before their start date
  if (isBefore(day, event.date)) return false;
  
  // Check if the recurrence has ended
  if (recurrence.endDate && isAfter(day, recurrence.endDate)) return false;
  
  const eventDate = new Date(event.date);
  const startDate = new Date(event.date);
  
  switch (recurrence.type) {
    case 'daily':
      // For daily recurrence, check if the day is a multiple of the interval from the start date
      const dayDiff = Math.round(
        (day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return dayDiff % (recurrence.interval || 1) === 0;
      
    case 'weekly':
      // For weekly recurrence, check if the day of week matches and if the week is a multiple of the interval
      if (!recurrence.weekdays || recurrence.weekdays.length === 0) {
        // If no weekdays specified, use the original event's day of week
        recurrence.weekdays = [getDay(eventDate)];
      }
      
      const weekDiff = Math.floor(
        (day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      
      return (
        recurrence.weekdays.includes(getDay(day)) &&
        weekDiff % (recurrence.interval || 1) === 0
      );
      
    case 'monthly':
      // For monthly recurrence, check if the day of month matches and if the month is a multiple of the interval
      const monthDiff = (day.getFullYear() - startDate.getFullYear()) * 12 +
        (day.getMonth() - startDate.getMonth());
        
      return (
        day.getDate() === startDate.getDate() &&
        monthDiff % (recurrence.interval || 1) === 0
      );
      
    case 'custom':
      // Custom recurrence based on the interval (in days)
      const customDayDiff = Math.round(
        (day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return customDayDiff % (recurrence.interval || 1) === 0;
      
    default:
      return false;
  }
};

// Format date to display in calendar
export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr);
};

// Navigation functions
export const nextMonth = (date: Date) => addMonths(date, 1);
export const previousMonth = (date: Date) => subMonths(date, 1);

// Helper to check for conflicting events
export const hasEventConflict = (event: CalendarEvent, existingEvents: CalendarEvent[]): boolean => {
  // Basic time check for events on the same day
  const sameDay = existingEvents.filter(e => 
    isSameDay(e.date, event.date) && e.id !== event.id
  );
  
  // For now, just check if there are multiple events on the same day
  // In a real app, you'd check time conflicts as well
  return sameDay.length > 0;
};

// Generate an event instance for a recurring event on a specific date
export const generateEventInstance = (
  event: CalendarEvent,
  date: Date
): CalendarEvent => {
  return {
    ...event,
    id: `${event.id}-${format(date, 'yyyy-MM-dd')}`,
    date: new Date(date),
    parentId: event.id,
  };
};

// Get array of dates for a recurring event
export const getRecurringEventDates = (
  event: CalendarEvent,
  startDate: Date,
  endDate: Date
): Date[] => {
  if (!event.recurrence || event.recurrence.type === 'none') {
    return [event.date];
  }

  const { recurrence } = event;
  const dates: Date[] = [];
  const interval = recurrence.interval || 1;

  let currentDate = new Date(Math.max(event.date.getTime(), startDate.getTime()));
  const recurrenceEndDate = recurrence.endDate || endDate;

  while (currentDate <= recurrenceEndDate) {
    if (isRecurringEventOnDay(event, currentDate)) {
      dates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};