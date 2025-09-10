import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ClassSession, DayOfWeek } from '../types';

interface MonthlyCalendarProps {
  classes: ClassSession[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEditClass: (classSession: ClassSession) => void;
  onAddClass: () => void;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  classes,
  currentDate,
  onDateChange,
  onEditClass,
  onAddClass
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  const getClassesForDate = (date: number): ClassSession[] => {
    const dayOfWeek = new Date(year, month, date).getDay();
    const dayName = DAYS[dayOfWeek];
    return classes.filter(cls => cls.day === dayName);
  };

  const isToday = (date: number): boolean => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === date;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
  };

  // Generate calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push(date);
  }

  return (
    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" data-calendar-export>
      <div className="p-4 bg-gradient-to-r from-accent to-surface text-gray-800 dark:text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Monthly Schedule</h2>
            <p className="text-gray-700 dark:text-gray-200">{MONTH_NAMES[month]} {year}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-1 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {day.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (date === null) {
              return <div key={index} className="h-24 bg-gray-50 dark:bg-gray-900 rounded-lg"></div>;
            }

            const dayClasses = getClassesForDate(date);
            const today = isToday(date);

            return (
              <div
                key={date}
                className={`h-24 p-1 border rounded-lg transition-colors hover:bg-muted dark:hover:bg-gray-700 ${
                  today 
                    ? 'bg-accent bg-opacity-20 border-accent' 
                    : 'bg-white dark:bg-gray-800 border-border dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    today ? 'text-accent font-bold' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {date}
                  </span>
                  {dayClasses.length === 0 && (
                    <button
                      onClick={onAddClass}
                      className="opacity-0 hover:opacity-100 p-1 text-gray-400 hover:text-accent transition-all"
                      title="Add class"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {dayClasses.slice(0, 2).map(classSession => (
                    <div
                      key={classSession.id}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{ 
                        backgroundColor: classSession.color,
                        color: '#ffffff'
                      }}
                      onClick={() => onEditClass(classSession)}
                      title={`${classSession.courseName} - ${formatTime(classSession.startTime)}`}
                    >
                      <div className="font-medium truncate">{classSession.courseName}</div>
                      <div className="opacity-90">{formatTime(classSession.startTime)}</div>
                    </div>
                  ))}
                  
                  {dayClasses.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                      +{dayClasses.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};