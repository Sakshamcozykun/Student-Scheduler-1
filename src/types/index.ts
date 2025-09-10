export interface ClassSession {
  id: string;
  courseName: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  description?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingClass?: ClassSession;
  message?: string;
}

export interface FreeSlot {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface ColorPalette {
  id: string;
  name: string;
  background: string;
  surface: string;
  accent: string;
  muted: string;
  border: string;
  eventColors: string[];
}

export type CalendarView = 'daily' | 'weekly' | 'monthly';