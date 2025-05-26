import React from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';

interface ViewSelectorProps {
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onViewChange('month')}
        className={`p-2 rounded-md flex items-center ${
          view === 'month'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <CalendarIcon size={16} className="mr-1" />
        Month
      </button>
      <button
        onClick={() => onViewChange('week')}
        className={`p-2 rounded-md flex items-center ${
          view === 'week'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List size={16} className="mr-1" />
        Week
      </button>
    </div>
  );
};

export default ViewSelector;