import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { CalendarEvent } from '../../types';
import EventItem from './EventItem';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="p-4 text-center border-r last:border-r-0"
          >
            <div className="text-sm font-medium text-gray-500">
              {format(day, 'EEE')}
            </div>
            <div className="text-lg font-semibold mt-1">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-7 min-h-[600px]">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="border-r last:border-r-0 p-2"
            onClick={() => onAddEvent(day)}
          >
            <div className="space-y-1">
              {getEventsForDay(day).map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;