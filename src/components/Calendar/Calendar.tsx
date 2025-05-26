import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { CalendarEvent } from '../../types';
import { getCalendarMonth, nextMonth, previousMonth } from '../../utils/dateUtils';
import { useCalendarStore } from '../../store/calendarStore';

interface CalendarProps {
  view: 'month' | 'week';
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  view,
  events,
  onEventClick,
  onAddEvent
}) => {
  const { currentDate, setCurrentDate } = useCalendarStore();
  
  // Generate the calendar month data
  const calendarMonth = getCalendarMonth(currentDate, events);

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate(previousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(nextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
          >
            <CalendarIcon size={16} className="mr-1" />
            Today
          </button>
          
          <div className="flex">
            <button
              onClick={handlePreviousMonth}
              className="p-1 rounded-l-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-r-md border border-l-0 border-gray-300 bg-white hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        {view === 'month' ? (
          <MonthView
            calendarMonth={calendarMonth}
            onEventClick={onEventClick}
            onAddEvent={onAddEvent}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onAddEvent={onAddEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;