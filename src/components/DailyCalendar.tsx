import React from 'react';
import { Edit2, Trash2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClassSession, DayOfWeek } from '../types';

interface DailyCalendarProps {
  classes: ClassSession[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEditClass: (classSession: ClassSession) => void;
  onDeleteClass: (day: DayOfWeek, classId: string) => void;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

export const DailyCalendar: React.FC<DailyCalendarProps> = ({
  classes,
  currentDate,
  onDateChange,
  onEditClass,
  onDeleteClass
}) => {
  const currentDay = DAYS[currentDate.getDay()];
  
  const getClassesForDay = (): ClassSession[] => {
    return classes.filter(cls => cls.day === currentDay).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };

  const getClassPosition = (startTime: string, endTime: string) => {
    const parseTime = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const startOffset = (start - 7) * 80; // 80px per hour
    const duration = (end - start) * 80;

    return {
      top: `${startOffset}px`,
      height: `${Math.max(duration, 40)}px`
    };
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden" data-calendar-export>
      <div className="p-4 bg-gradient-to-r from-accent to-surface text-gray-800 dark:text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Daily Schedule</h2>
            <p className="text-gray-700 dark:text-gray-200">{formatDate(currentDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
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
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] flex">
          {/* Time column */}
          <div className="w-24 flex-shrink-0 border-r border-border dark:border-gray-700">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-20 border-b border-border dark:border-gray-700 flex items-start justify-end pr-3 pt-2"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} ${hour === 12 ? 'PM' : 'AM'}` : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="flex-1">
            <div className="relative" style={{ height: `${15 * 80}px` }}>
              {/* Grid lines */}
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-b border-border dark:border-gray-700"
                  style={{ top: `${(hour - 7) * 80}px`, height: '80px' }}
                />
              ))}

              {/* Classes */}
              {getClassesForDay().map(classSession => {
                const position = getClassPosition(classSession.startTime, classSession.endTime);
                return (
                  <div
                    key={classSession.id}
                    className="absolute left-2 right-2 rounded-lg p-3 text-white overflow-hidden group cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      ...position,
                      backgroundColor: classSession.color,
                      color: '#ffffff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onClick={() => onEditClass(classSession)}
                  >
                    <div className="font-bold text-lg mb-2">
                      {classSession.courseName}
                    </div>
                    <div className="flex items-center mb-2 opacity-90">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{classSession.location}</span>
                    </div>
                    <div className="text-sm opacity-80">
                      {formatTime(classSession.startTime)} - {formatTime(classSession.endTime)}
                    </div>
                    {classSession.description && (
                      <div className="text-sm opacity-75 mt-2 line-clamp-2">
                        {classSession.description}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClass(classSession);
                        }}
                        className="w-7 h-7 bg-white bg-opacity-20 rounded hover:bg-opacity-30 flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClass(classSession.day, classSession.id);
                        }}
                        className="w-7 h-7 bg-red-500 bg-opacity-80 rounded hover:bg-opacity-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {getClassesForDay().length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-lg font-medium">No classes scheduled</p>
                    <p className="text-sm">Enjoy your free day!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};