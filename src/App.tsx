import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Calendar from './components/Calendar/Calendar';
import EventForm from './components/EventForm/EventForm';
import SearchBar from './components/Search/SearchBar';
import ViewSelector from './components/Calendar/ViewSelector';
import { CalendarEvent } from './types';
import { Calendar as CalendarIcon, RefreshCcw } from 'lucide-react';
import {
  initializeGoogleCalendar,
  authenticateGoogleCalendar,
  syncEventsToGoogle,
  importEventsFromGoogle,
} from './services/googleCalendar';
import { useCalendarStore } from './store/calendarStore';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showEventForm, setShowEventForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const { events, setEvents } = useCalendarStore();

  // Initialize Google Calendar
  useEffect(() => {
    const init = async () => {
      const initialized = await initializeGoogleCalendar();
      setIsGoogleInitialized(initialized);
    };
    init();
  }, []);

  // Handle event click (edit event)
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setShowEventForm(true);
  };

  // Handle add event (click on day cell)
  const handleAddEvent = (date: Date) => {
    setSelectedEvent(undefined);
    setSelectedDate(date);
    setShowEventForm(true);
  };

  // Close the event form
  const handleCloseForm = () => {
    setShowEventForm(false);
    setSelectedEvent(undefined);
    setSelectedDate(undefined);
  };

  // Handle Google Calendar sync
  const handleGoogleSync = async () => {
    try {
      await authenticateGoogleCalendar();
      await syncEventsToGoogle(events);
      const googleEvents = await importEventsFromGoogle();
      setEvents([...events, ...googleEvents]);
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
    }
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 flex flex-col p-4 md:p-6">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event Calendar</h1>
            {isGoogleInitialized && (
              <button
                onClick={handleGoogleSync}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                <RefreshCcw size={16} className="mr-2" />
                Sync with Google Calendar
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <ViewSelector view={view} onViewChange={setView} />
          </div>
        </header>
        
        <main className="flex-1 max-w-7xl w-full mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6">
          <Calendar
            view={view}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        </main>
        
        {showEventForm && (
          <EventForm
            event={selectedEvent}
            date={selectedDate}
            onClose={handleCloseForm}
          />
        )}
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Event Calendar. All rights reserved.</p>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;