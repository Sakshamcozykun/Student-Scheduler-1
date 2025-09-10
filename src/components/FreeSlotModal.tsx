import React, { useState } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { FreeSlot, DayOfWeek } from '../types';

interface FreeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggest: (duration: number, preferredDays?: DayOfWeek[]) => FreeSlot[];
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const FreeSlotModal: React.FC<FreeSlotModalProps> = ({
  isOpen,
  onClose,
  onSuggest
}) => {
  const [duration, setDuration] = useState(60);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);

  const handleSuggest = () => {
    const slots = onSuggest(duration, selectedDays.length > 0 ? selectedDays : undefined);
    setFreeSlots(slots);
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface dark:bg-gray-800 border-b border-border dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Find Free Time Slots
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-2" />
              Minimum Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FEC5BB] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Preferred Days (optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDays.includes(day)
                      ? 'bg-[#FEC5BB] text-gray-800'
                      : 'bg-muted dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-accent dark:hover:bg-gray-600'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            {selectedDays.length > 0 && (
              <button
                onClick={() => setSelectedDays([])}
                className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear selection
              </button>
            )}
          </div>

          <button
            onClick={handleSuggest}
            className="w-full px-4 py-2 bg-[#FEC5BB] text-gray-800 rounded-lg hover:bg-[#FCD5CE] transition-colors font-medium"
          >
            Find Free Slots
          </button>

          {freeSlots.length > 0 && (
            <div className="border-t border-border dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Available Time Slots
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {freeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-muted dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {slot.day}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#FEC5BB]">
                        {formatDuration(slot.duration)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        available
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {freeSlots.length === 0 && duration && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Find Free Slots" to see available time slots</p>
            </div>
          )}
        </div>

        <div className="border-t border-border dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-border dark:border-gray-600 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-muted dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};