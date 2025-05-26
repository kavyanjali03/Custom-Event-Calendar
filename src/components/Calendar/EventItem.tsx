import React from 'react';
import { useDrag } from 'react-dnd';
import { CalendarEvent } from '../../types';
import { getEventColorClasses } from '../../utils/eventUtils';
import { Repeat } from 'lucide-react';

interface EventItemProps {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get color classes based on event color
  const colorClasses = getEventColorClasses(event.color);
  
  // Check if it's a recurring event
  const isRecurring = event.recurrence && event.recurrence.type !== 'none';

  return (
    <div
      ref={drag}
      className={`
        ${colorClasses} 
        px-2 py-1 text-xs rounded border truncate cursor-pointer
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5
        flex items-center justify-between
      `}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="truncate">{event.title}</span>
      
      {isRecurring && (
        <Repeat size={12} className="ml-1 flex-shrink-0" />
      )}
    </div>
  );
};

export default EventItem;