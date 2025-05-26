import { create } from 'zustand';
import { CalendarEvent } from '../types';
import { saveEvents, loadEvents } from '../utils/storageUtils';
import { format } from 'date-fns';

interface CalendarStore {
  events: CalendarEvent[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string, deleteRecurrences?: boolean) => void;
  moveEvent: (event: CalendarEvent, newDate: Date) => void;
  setEvents: (events: CalendarEvent[]) => void;
}

// Create UUID generator
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: loadEvents(),
  currentDate: new Date(),
  
  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },
  
  setEvents: (events: CalendarEvent[]) => {
    set({ events });
    saveEvents(events);
  },
  
  addEvent: (event: CalendarEvent) => {
    set((state) => {
      const updatedEvents = [...state.events, event];
      saveEvents(updatedEvents);
      return { events: updatedEvents };
    });
  },
  
  updateEvent: (event: CalendarEvent) => {
    set((state) => {
      const updatedEvents = state.events.map((e) =>
        e.id === event.id ? event : e
      );
      saveEvents(updatedEvents);
      return { events: updatedEvents };
    });
  },
  
  deleteEvent: (id: string, deleteRecurrences = false) => {
    set((state) => {
      let updatedEvents;
      
      if (deleteRecurrences) {
        // Find the event to get its parentId (if it's a recurrence)
        const event = state.events.find(e => e.id === id);
        const parentId = event?.parentId || id;
        
        // Delete the event and all related recurrences
        updatedEvents = state.events.filter(event => 
          event.id !== id && 
          event.id !== parentId && 
          event.parentId !== parentId
        );
      } else {
        // Just delete the specific event
        updatedEvents = state.events.filter(event => event.id !== id);
      }
      
      saveEvents(updatedEvents);
      return { events: updatedEvents };
    });
  },
  
  moveEvent: (event: CalendarEvent, newDate: Date) => {
    set((state) => {
      // Calculate the time difference between dates
      const currentTime = format(event.date, 'HH:mm:ss');
      const newDateTime = new Date(`${format(newDate, 'yyyy-MM-dd')}T${currentTime}`);
      
      // If it's a recurring event instance (has parentId)
      if (event.parentId) {
        // Create a new event based on the recurring event
        const newEvent: CalendarEvent = {
          id: generateId(),
          title: event.title,
          date: newDateTime,
          description: event.description,
          color: event.color,
          recurrence: { type: 'none' }, // Single event
        };
        
        const updatedEvents = [...state.events, newEvent];
        saveEvents(updatedEvents);
        return { events: updatedEvents };
      } else {
        // Update the original event
        const updatedEvents = state.events.map((e) => {
          if (e.id === event.id) {
            return { ...e, date: newDateTime };
          }
          return e;
        });
        
        saveEvents(updatedEvents);
        return { events: updatedEvents };
      }
    });
  },
}));