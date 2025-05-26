import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, RecurrencePattern } from '../types';
import { isRecurringEventOnDay } from './dateUtils';

// Create a new event
export const createEvent = (eventData: Partial<CalendarEvent>): CalendarEvent => {
  return {
    id: uuidv4(),
    title: eventData.title || 'Untitled Event',
    date: eventData.date || new Date(),
    endDate: eventData.endDate,
    description: eventData.description || '',
    color: eventData.color || 'blue',
    recurrence: eventData.recurrence || { type: 'none' },
  };
};

// Update an existing event
export const updateEvent = (
  events: CalendarEvent[],
  updatedEvent: CalendarEvent
): CalendarEvent[] => {
  return events.map((event) => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
};

// Delete an event and optionally its recurrences
export const deleteEvent = (
  events: CalendarEvent[],
  eventId: string,
  deleteRecurrences: boolean = false
): CalendarEvent[] => {
  if (deleteRecurrences) {
    // Find the event to get its parentId (if it's a recurrence)
    const event = events.find(e => e.id === eventId);
    const parentId = event?.parentId || eventId;
    
    // Delete the event and all related recurrences
    return events.filter(event => 
      event.id !== eventId && 
      event.id !== parentId && 
      event.parentId !== parentId
    );
  }
  
  // Just delete the specific event
  return events.filter(event => event.id !== eventId);
};

// Check if there are any conflicts with the new/updated event
export const checkEventConflicts = (
  events: CalendarEvent[],
  event: CalendarEvent
): CalendarEvent[] => {
  // For simplicity, we'll just check for same-day conflicts
  // In a real app, you'd check time overlaps as well
  return events.filter(e => 
    e.id !== event.id && 
    new Date(e.date).toDateString() === new Date(event.date).toDateString()
  );
};

// Get recurring event instances within a date range
export const getRecurringEventInstances = (
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] => {
  const instances: CalendarEvent[] = [];
  
  // Filter for recurring events
  const recurringEvents = events.filter(
    event => event.recurrence && event.recurrence.type !== 'none'
  );
  
  // For each recurring event, generate instances
  recurringEvents.forEach(event => {
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (isRecurringEventOnDay(event, currentDate)) {
        // Create a new instance with a unique ID
        const instance: CalendarEvent = {
          ...event,
          id: `${event.id}-${currentDate.toISOString().split('T')[0]}`,
          date: new Date(currentDate),
          parentId: event.id,
        };
        
        instances.push(instance);
      }
      
      // Move to next day
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
  });
  
  return instances;
};

// Generate color classes based on event color
export const getEventColorClasses = (color: string): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'green':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'purple':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'red':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'gray':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Get recurrence text description
export const getRecurrenceText = (recurrence: RecurrencePattern): string => {
  if (!recurrence || recurrence.type === 'none') {
    return '';
  }
  
  const interval = recurrence.interval || 1;
  
  switch (recurrence.type) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
    case 'weekly':
      return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
    case 'monthly':
      return interval === 1 ? 'Monthly' : `Every ${interval} months`;
    case 'custom':
      return `Custom (every ${interval} days)`;
    default:
      return '';
  }
};