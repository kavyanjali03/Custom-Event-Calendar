import React from 'react';
import { format } from 'date-fns';
import { useDrop } from 'react-dnd';
import { CalendarDay, CalendarEvent } from '../../types';
import EventItem from './EventItem';
import { useCalendarStore } from '../../store/calendarStore';

interface DayCellProps {
  day: CalendarDay;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({ day, onEventClick, onAddEvent }) => {
  const { moveEvent } = useCalendarStore();
  
  // Set up drag and drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: (item: { event: CalendarEvent }) => {
      moveEvent(item.event, day.date);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Determine cell styling based on day properties
  const cellClasses = `
    h-24 sm:h-32 md:h-36 lg:h-40 p-1 border border-gray-200 overflow-hidden
    ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
    ${day.isToday ? 'bg-blue-50' : ''}
    ${isOver ? 'bg-blue-100' : ''}
    transition-colors duration-200
  `;

  // Helper to limit the number of events displayed
  const maxVisibleEvents = 3;
  const visibleEvents = day.events.slice(0, maxVisibleEvents);
  const hiddenEventsCount = day.events.length - maxVisibleEvents;

  return (
    <div
      ref={drop}
      className={cellClasses}
      onClick={() => onAddEvent(day.date)}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-medium ${day.isToday ? 'text-blue-600 rounded-full bg-blue-100 w-6 h-6 flex items-center justify-center' : ''}`}>
          {format(day.date, 'd')}
        </span>
        {day.isCurrentMonth && (
          <button
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddEvent(day.date);
            }}
          >
            <span className="sr-only">Add event</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
        {visibleEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          />
        ))}
        
        {hiddenEventsCount > 0 && (
          <div className="text-xs text-gray-500 bg-gray-100 rounded p-1 text-center">
            +{hiddenEventsCount} more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;