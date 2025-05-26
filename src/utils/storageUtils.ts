import { CalendarEvent } from '../types';

// Local storage key
const EVENTS_STORAGE_KEY = 'calendar_events';

// Helper to serialize dates in the events
const serializeEvent = (event: CalendarEvent): any => {
  return {
    ...event,
    date: event.date.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : undefined,
    recurrence: {
      ...event.recurrence,
      endDate: event.recurrence.endDate ? event.recurrence.endDate.toISOString() : null,
    },
  };
};

// Helper to deserialize dates in the events
const deserializeEvent = (event: any): CalendarEvent => {
  return {
    ...event,
    date: new Date(event.date),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
    recurrence: {
      ...event.recurrence,
      endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : null,
    },
  };
};

// Save events to local storage
export const saveEvents = (events: CalendarEvent[]): void => {
  try {
    const serializedEvents = events.map(serializeEvent);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(serializedEvents));
  } catch (error) {
    console.error('Error saving events to local storage:', error);
  }
};

// Load events from local storage
export const loadEvents = (): CalendarEvent[] => {
  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      return parsedEvents.map(deserializeEvent);
    }
  } catch (error) {
    console.error('Error loading events from local storage:', error);
  }
  return [];
};