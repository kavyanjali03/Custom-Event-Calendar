export type EventColor = 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrencePattern {
  type: RecurrenceType;
  interval?: number; // Every X days/weeks/months
  weekdays?: number[]; // For weekly recurrence, days of week (0-6)
  endDate?: Date | null; // End date for recurrence, null for no end
  occurrences?: number | null; // Number of occurrences, null for no limit
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  description?: string;
  color: EventColor;
  recurrence: RecurrencePattern;
  parentId?: string; // For recurring event instances
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarMonth {
  days: CalendarDay[];
  month: number;
  year: number;
}