import { useState, useEffect, useCallback } from 'react';
import { ClassSession, ConflictInfo, FreeSlot, DayOfWeek, CalendarView } from '../types';
import { ScheduleHashMap } from '../utils/dataStructures';
import { getColorPalette } from '../utils/colorPalettes';

export const useScheduler = () => {
  const [scheduleMap] = useState(() => new ScheduleHashMap());
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('warm');
  const [currentView, setCurrentView] = useState<CalendarView>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasSelectedTheme, setHasSelectedTheme] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClasses = localStorage.getItem('studentScheduler_classes');
    const savedTheme = localStorage.getItem('studentScheduler_theme');
    const savedPalette = localStorage.getItem('studentScheduler_palette');
    const savedView = localStorage.getItem('studentScheduler_view');
    const savedDate = localStorage.getItem('studentScheduler_date');
    const savedThemeSelection = localStorage.getItem('studentScheduler_themeSelected');
    
    if (savedClasses) {
      const parsedClasses: ClassSession[] = JSON.parse(savedClasses);
      parsedClasses.forEach(cls => scheduleMap.addClass(cls));
      setClasses(parsedClasses);
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    if (savedPalette) {
      setCurrentPalette(savedPalette);
    }

    if (savedView && ['daily', 'weekly', 'monthly'].includes(savedView)) {
      setCurrentView(savedView as CalendarView);
    }

    if (savedDate) {
      setCurrentDate(new Date(savedDate));
    }

    if (savedThemeSelection) {
      setHasSelectedTheme(true);
    }
  }, [scheduleMap]);

  // Save to localStorage whenever classes change
  useEffect(() => {
    localStorage.setItem('studentScheduler_classes', JSON.stringify(classes));
  }, [classes]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('studentScheduler_theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Save palette preference and update CSS variables
  useEffect(() => {
    localStorage.setItem('studentScheduler_palette', currentPalette);
    const palette = getColorPalette(currentPalette);
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-muted', palette.muted);
    root.style.setProperty('--color-border', palette.border);
  }, [currentPalette]);

  // Save view preference
  useEffect(() => {
    localStorage.setItem('studentScheduler_view', currentView);
  }, [currentView]);

  // Save current date
  useEffect(() => {
    localStorage.setItem('studentScheduler_date', currentDate.toISOString());
  }, [currentDate]);

  const addClass = useCallback((classSession: ClassSession): ConflictInfo => {
    const conflict = scheduleMap.addClass(classSession);
    if (!conflict.hasConflict) {
      setClasses(scheduleMap.getAllClasses());
    }
    return conflict;
  }, [scheduleMap]);

  const removeClass = useCallback((day: DayOfWeek, classId: string) => {
    const success = scheduleMap.removeClass(day, classId);
    if (success) {
      setClasses(scheduleMap.getAllClasses());
    }
    return success;
  }, [scheduleMap]);

  const updateClass = useCallback((updatedClass: ClassSession): ConflictInfo => {
    // Remove old version first
    const oldClass = classes.find(c => c.id === updatedClass.id);
    if (oldClass) {
      scheduleMap.removeClass(oldClass.day, oldClass.id);
    }

    // Add updated version
    const conflict = scheduleMap.addClass(updatedClass);
    if (!conflict.hasConflict) {
      setClasses(scheduleMap.getAllClasses());
    } else if (oldClass) {
      // If there's a conflict, restore the old class
      scheduleMap.addClass(oldClass);
      setClasses(scheduleMap.getAllClasses());
    }
    
    return conflict;
  }, [scheduleMap, classes]);

  const getClassesForDay = useCallback((day: DayOfWeek): ClassSession[] => {
    return scheduleMap.getClassesForDay(day);
  }, [scheduleMap]);

  const detectConflict = useCallback((classSession: ClassSession): ConflictInfo => {
    return scheduleMap.detectConflict(classSession);
  }, [scheduleMap]);

  const suggestFreeSlots = useCallback((duration: number = 60, preferredDays?: DayOfWeek[]): FreeSlot[] => {
    return scheduleMap.suggestFreeSlots(duration, preferredDays);
  }, [scheduleMap]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const changePalette = useCallback((paletteId: string) => {
    setCurrentPalette(paletteId);
    // Mark theme as selected when changed
    if (!hasSelectedTheme) {
      setHasSelectedTheme(true);
      localStorage.setItem('studentScheduler_themeSelected', 'true');
    }
  }, []);

  const changeView = useCallback((view: CalendarView) => {
    setCurrentView(view);
  }, []);

  const changeDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const clearAllClasses = useCallback(() => {
    setClasses([]);
    // Create new schedule map
    const newScheduleMap = new ScheduleHashMap();
    Object.setPrototypeOf(scheduleMap, Object.getPrototypeOf(newScheduleMap));
    Object.assign(scheduleMap, newScheduleMap);
  }, [scheduleMap]);

  const selectInitialTheme = useCallback((paletteId: string) => {
    setCurrentPalette(paletteId);
    setHasSelectedTheme(true);
    localStorage.setItem('studentScheduler_themeSelected', 'true');
  }, []);
  return {
    classes,
    isDarkMode,
    currentPalette,
    currentView,
    currentDate,
    hasSelectedTheme,
    addClass,
    removeClass,
    updateClass,
    getClassesForDay,
    detectConflict,
    suggestFreeSlots,
    toggleTheme,
    changePalette,
    changeView,
    changeDate,
    clearAllClasses,
    selectInitialTheme
  };
};