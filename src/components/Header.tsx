import React from 'react';
import { Plus, Calendar, Moon, Sun, Download, Trash2, FileText, Image, Palette, CalendarDays, Grid3X3 } from 'lucide-react';
import { COLOR_PALETTES } from '../utils/colorPalettes';
import { CalendarView } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  currentPalette: string;
  currentView: CalendarView;
  onToggleTheme: () => void;
  onChangePalette: (paletteId: string) => void;
  onChangeView: (view: CalendarView) => void;
  onAddClass: () => void;
  onFindFreeSlots: () => void;
  onExportText: () => void;
  onExportPDF: () => void;
  onExportJPEG: () => void;
  onClearAll: () => void;
  classCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  currentPalette,
  currentView,
  onToggleTheme,
  onChangePalette,
  onChangeView,
  onAddClass,
  onFindFreeSlots,
  onExportText,
  onExportPDF,
  onExportJPEG,
  onClearAll,
  classCount
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = React.useState(false);
  const [showViewMenu, setShowViewMenu] = React.useState(false);

  const getViewIcon = (view: CalendarView) => {
    switch (view) {
      case 'daily': return Calendar;
      case 'weekly': return CalendarDays;
      case 'monthly': return Grid3X3;
    }
  };

  const getViewLabel = (view: CalendarView) => {
    switch (view) {
      case 'daily': return 'Daily View';
      case 'weekly': return 'Weekly View';
      case 'monthly': return 'Monthly View';
    }
  };

  return (
    <header className="bg-surface dark:bg-gray-800 shadow-lg border-b border-border dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-accent to-surface rounded-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Student Scheduler
              </h1>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {classCount} {classCount === 1 ? 'class' : 'classes'} scheduled
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {React.createElement(getViewIcon(currentView), { className: "w-4 h-4" })}
                {getViewLabel(currentView)}
              </button>
              
              {showViewMenu && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 z-50">
                  <div className="py-2">
                    {(['daily', 'weekly', 'monthly'] as CalendarView[]).map(view => {
                      const Icon = getViewIcon(view);
                      return (
                        <button
                          key={view}
                          onClick={() => {
                            onChangeView(view);
                            setShowViewMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                            currentView === view ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {getViewLabel(view)}
                          {currentView === view && (
                            <div className="ml-auto w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onFindFreeSlots}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Find Free Time
            </button>

            <button
              onClick={onAddClass}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>

            <div className="flex items-center space-x-2 border-l pl-3 border-border dark:border-gray-600">
              <div className="relative">
                <button
                  onClick={() => setShowPaletteMenu(!showPaletteMenu)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Change Color Palette"
                >
                  <Palette className="w-5 h-5" />
                </button>
                
                {showPaletteMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Color Palettes
                      </div>
                      {COLOR_PALETTES.map(palette => (
                        <button
                          key={palette.id}
                          onClick={() => {
                            onChangePalette(palette.id);
                            setShowPaletteMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${
                            currentPalette === palette.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <div className="flex gap-1">
                            {palette.eventColors.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{palette.name}</span>
                          {currentPalette === palette.id && (
                            <div className="ml-auto w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export Schedule"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onExportText();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Export as Text
                      </button>
                      <button
                        onClick={() => {
                          onExportPDF();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => {
                          onExportJPEG();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Image className="w-4 h-4" />
                        Export as JPEG
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onClearAll}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Clear All Classes"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};