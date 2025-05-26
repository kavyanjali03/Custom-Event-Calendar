import React, { useState } from 'react';
import { RecurrencePattern, RecurrenceType } from '../../types';

interface RecurrenceOptionsProps {
  value: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({ value, onChange }) => {
  // Create local state to manage the form values
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(value.type || 'none');
  const [interval, setInterval] = useState<number>(value.interval || 1);
  const [weekdays, setWeekdays] = useState<number[]>(value.weekdays || []);
  const [endDate, setEndDate] = useState<string>(
    value.endDate ? value.endDate.toISOString().split('T')[0] : ''
  );

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as RecurrenceType;
    setRecurrenceType(newType);
    
    // Update the parent component
    onChange({
      ...value,
      type: newType,
      // Reset other values when changing type
      weekdays: newType === 'weekly' ? [new Date().getDay()] : [],
    });
  };

  // Handle interval change
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = parseInt(e.target.value) || 1;
    setInterval(newInterval);
    onChange({ ...value, interval: newInterval });
  };

  // Handle weekday toggle
  const handleWeekdayToggle = (day: number) => {
    const newWeekdays = weekdays.includes(day)
      ? weekdays.filter(d => d !== day)
      : [...weekdays, day];
    
    setWeekdays(newWeekdays);
    onChange({ ...value, weekdays: newWeekdays });
  };

  // Handle end date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onChange({
      ...value,
      endDate: newEndDate ? new Date(newEndDate) : null,
    });
  };

  // Day names for weekly recurrence
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="recurrence-type" className="block text-sm font-medium text-gray-700">
          Recurrence
        </label>
        <select
          id="recurrence-type"
          value={recurrenceType}
          onChange={handleTypeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {recurrenceType !== 'none' && (
        <>
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
              {recurrenceType === 'daily' && 'Repeat every X days'}
              {recurrenceType === 'weekly' && 'Repeat every X weeks'}
              {recurrenceType === 'monthly' && 'Repeat every X months'}
              {recurrenceType === 'custom' && 'Custom interval (days)'}
            </label>
            <input
              type="number"
              id="interval"
              min="1"
              value={interval}
              onChange={handleIntervalChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {recurrenceType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat on
              </label>
              <div className="flex space-x-2 flex-wrap gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWeekdayToggle(index)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm
                      ${weekdays.includes(index)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      transition-colors duration-200
                    `}
                  >
                    {day.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
              End date (optional)
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RecurrenceOptions;