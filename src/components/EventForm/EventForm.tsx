import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { CalendarEvent, EventColor, RecurrencePattern } from '../../types';
import RecurrenceOptions from './RecurrenceOptions';
import { useCalendarStore } from '../../store/calendarStore';
import { format } from 'date-fns';
import { createEvent, checkEventConflicts } from '../../utils/eventUtils';

interface EventFormProps {
  event?: CalendarEvent;
  date?: Date;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, date, onClose }) => {
  const { addEvent, updateEvent, deleteEvent, events } = useCalendarStore();
  
  // Initialize form state
  const [title, setTitle] = useState(event?.title || '');
  const [eventDate, setEventDate] = useState(
    format(event?.date || date || new Date(), 'yyyy-MM-dd')
  );
  const [eventTime, setEventTime] = useState(
    event?.date ? format(event.date, 'HH:mm') : '12:00'
  );
  const [description, setDescription] = useState(event?.description || '');
  const [color, setColor] = useState<EventColor>(event?.color || 'blue');
  const [recurrence, setRecurrence] = useState<RecurrencePattern>(
    event?.recurrence || { type: 'none' }
  );
  const [conflicts, setConflicts] = useState<CalendarEvent[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRecurrences, setDeleteRecurrences] = useState(false);

  // Colors for selection
  const colorOptions: { value: EventColor; label: string }[] = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'gray', label: 'Gray' },
  ];

  // Check for conflicts when the form data changes
  useEffect(() => {
    // Create a temporary event object for conflict checking
    const tempEvent: CalendarEvent = {
      id: event?.id || 'temp',
      title,
      date: new Date(`${eventDate}T${eventTime}`),
      description,
      color,
      recurrence,
    };
    
    // Check for conflicts
    const conflictingEvents = checkEventConflicts(events, tempEvent);
    setConflicts(conflictingEvents);
  }, [title, eventDate, eventTime, recurrence, events, event?.id]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a date object from the form inputs
    const fullDate = new Date(`${eventDate}T${eventTime}`);
    
    if (event) {
      // Update existing event
      updateEvent({
        ...event,
        title,
        date: fullDate,
        description,
        color,
        recurrence,
      });
    } else {
      // Create new event
      const newEvent = createEvent({
        title,
        date: fullDate,
        description,
        color,
        recurrence,
      });
      
      addEvent(newEvent);
    }
    
    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id, deleteRecurrences);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Form header */}
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {event ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add title"
            />
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time *
              </label>
              <input
                type="time"
                id="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add description"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`
                    w-8 h-8 rounded-full border-2
                    ${color === option.value ? 'border-gray-900' : 'border-transparent'}
                    bg-${option.value}-500 hover:opacity-90 transition-opacity duration-200
                  `}
                  style={{ backgroundColor: getColorHex(option.value) }}
                  aria-label={option.label}
                />
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <RecurrenceOptions
            value={recurrence}
            onChange={setRecurrence}
          />

          {/* Conflicts warning */}
          {conflicts.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-yellow-400 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-700">
                    There {conflicts.length === 1 ? 'is' : 'are'} {conflicts.length} existing event
                    {conflicts.length === 1 ? '' : 's'} on this day:
                  </p>
                  <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                    {conflicts.map((conflict) => (
                      <li key={conflict.id}>{conflict.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Delete confirmation */}
          {showDeleteConfirm && event && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800 mb-2">
                Are you sure you want to delete this event?
              </p>
              
              {event.recurrence?.type !== 'none' && (
                <div className="mb-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={deleteRecurrences}
                      onChange={(e) => setDeleteRecurrences(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-red-800">
                      Delete all recurring instances
                    </span>
                  </label>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Form actions */}
          <div className="flex items-center justify-between pt-2">
            {event && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {event ? 'Update' : 'Add'} Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to get hex color based on color name
function getColorHex(color: EventColor): string {
  switch (color) {
    case 'blue': return '#3B82F6';
    case 'green': return '#10B981';
    case 'purple': return '#8B5CF6';
    case 'red': return '#EF4444';
    case 'yellow': return '#F59E0B';
    case 'gray': return '#6B7280';
    default: return '#3B82F6';
  }
}

export default EventForm;