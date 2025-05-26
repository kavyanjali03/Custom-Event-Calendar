import React from 'react';
import { format } from 'date-fns';
import { CalendarMonth, CalendarEvent } from '../../types';
import DayCell from './DayCell';

interface MonthViewProps {
  calendarMonth: CalendarMonth;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  calendarMonth,
  onEventClick,
  onAddEvent,
}) => {
  // Days of the week header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group days into weeks for display
  const weeks: Array<typeof calendarMonth.days> = [];
  for (let i = 0; i < calendarMonth.days.length; i += 7) {
    weeks.push(calendarMonth.days.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day) => (
              <DayCell
                key={day.date.toString()}
                day={day}
                onEventClick={onEventClick}
                onAddEvent={onAddEvent}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;