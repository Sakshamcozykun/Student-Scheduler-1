import React, { useState } from 'react';
import { Header } from './components/Header';
import { ThemeSelector } from './components/ThemeSelector';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { DailyCalendar } from './components/DailyCalendar';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { ClassList } from './components/ClassList';
import { ClassModal } from './components/ClassModal';
import { FreeSlotModal } from './components/FreeSlotModal';
import { Toast } from './components/Toast';
import { useScheduler } from './hooks/useScheduler';
import { downloadSchedule, exportScheduleAsPDF, exportScheduleAsJPEG } from './utils/exportUtils';
import { ClassSession, DayOfWeek, ConflictInfo } from './types';

function App() {
  const {
    classes,
    isDarkMode,
    currentPalette,
    currentView,
    currentDate,
    hasSelectedTheme,
    addClass,
    removeClass,
    updateClass,
    suggestFreeSlots,
    toggleTheme,
    changePalette,
    changeView,
    changeDate,
    clearAllClasses,
    selectInitialTheme
  } = useScheduler();

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isFreeSlotModalOpen, setIsFreeSlotModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSession | undefined>();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddClass = () => {
    setEditingClass(undefined);
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classSession: ClassSession) => {
    setEditingClass(classSession);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (classSession: ClassSession): ConflictInfo => {
    let conflict: ConflictInfo;
    
    if (editingClass) {
      conflict = updateClass(classSession);
      if (!conflict.hasConflict) {
        showToast('Class updated successfully!', 'success');
      } else {
        showToast(conflict.message || 'Scheduling conflict detected', 'error');
      }
    } else {
      conflict = addClass(classSession);
      if (!conflict.hasConflict) {
        showToast('Class added successfully!', 'success');
      } else {
        showToast(conflict.message || 'Scheduling conflict detected', 'error');
      }
    }
    
    return conflict;
  };

  const handleDeleteClass = (day: DayOfWeek, classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const success = removeClass(day, classId);
      if (success) {
        showToast('Class deleted successfully!', 'success');
      } else {
        showToast('Failed to delete class', 'error');
      }
    }
  };

  const handleExportText = () => {
    try {
      downloadSchedule(classes);
      showToast('Schedule exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export schedule', 'error');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportScheduleAsPDF(classes);
      showToast('PDF exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export PDF', 'error');
    }
  };

  const handleExportJPEG = async () => {
    try {
      await exportScheduleAsJPEG();
      showToast('JPEG exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export JPEG', 'error');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all classes? This action cannot be undone.')) {
      clearAllClasses();
      showToast('All classes cleared!', 'success');
    }
  };

  // Show theme selector if user hasn't selected a theme yet
  if (!hasSelectedTheme) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <ThemeSelector onThemeSelect={selectInitialTheme} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-background'
    }`}>
      <Header
        isDarkMode={isDarkMode}
        currentPalette={currentPalette}
        currentView={currentView}
        onToggleTheme={toggleTheme}
        onChangePalette={changePalette}
        onChangeView={changeView}
        onAddClass={handleAddClass}
        onFindFreeSlots={() => setIsFreeSlotModalOpen(true)}
        onExportText={handleExportText}
        onExportPDF={handleExportPDF}
        onExportJPEG={handleExportJPEG}
        onClearAll={handleClearAll}
        classCount={classes.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'monthly' ? (
          <div className="space-y-8">
            <MonthlyCalendar
              classes={classes}
              currentDate={currentDate}
              onDateChange={changeDate}
              onEditClass={handleEditClass}
              onAddClass={handleAddClass}
            />
            <ClassList
              classes={classes}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentView === 'daily' ? (
                <DailyCalendar
                  classes={classes}
                  currentDate={currentDate}
                  onDateChange={changeDate}
                  onEditClass={handleEditClass}
                  onDeleteClass={handleDeleteClass}
                />
              ) : (
                <WeeklyCalendar
                  classes={classes}
                  onEditClass={handleEditClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <ClassList
                classes={classes}
                onEditClass={handleEditClass}
                onDeleteClass={handleDeleteClass}
              />
            </div>
          </div>
        )}
      </main>

      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        editingClass={editingClass}
        currentPalette={currentPalette}
      />

      <FreeSlotModal
        isOpen={isFreeSlotModalOpen}
        onClose={() => setIsFreeSlotModalOpen(false)}
        onSuggest={suggestFreeSlots}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;