import React from 'react';
import { Palette, Check } from 'lucide-react';
import { COLOR_PALETTES } from '../utils/colorPalettes';

interface ThemeSelectorProps {
  onThemeSelect: (paletteId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeSelect }) => {
  const [selectedTheme, setSelectedTheme] = React.useState<string>('warm');
  const [previewTheme, setPreviewTheme] = React.useState<string>('warm');

  React.useEffect(() => {
    // Apply preview theme to CSS variables
    const palette = COLOR_PALETTES.find(p => p.id === previewTheme) || COLOR_PALETTES[0];
    const root = document.documentElement;
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-muted', palette.muted);
    root.style.setProperty('--color-border', palette.border);
  }, [previewTheme]);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setPreviewTheme(themeId);
  };

  const handleContinue = () => {
    onThemeSelect(selectedTheme);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-2xl mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Student Scheduler
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Choose your perfect color theme to get started
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            You can always change this later in settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {COLOR_PALETTES.map((palette) => (
            <div
              key={palette.id}
              className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedTheme === palette.id ? 'scale-105 ring-4 ring-accent ring-opacity-50' : ''
              }`}
              onClick={() => handleThemeSelect(palette.id)}
              onMouseEnter={() => setPreviewTheme(palette.id)}
              onMouseLeave={() => setPreviewTheme(selectedTheme)}
            >
              <div className="bg-surface rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
                {/* Theme Preview */}
                <div className="mb-4">
                  <div 
                    className="h-24 rounded-lg mb-3 relative overflow-hidden"
                    style={{ backgroundColor: palette.background }}
                  >
                    <div 
                      className="absolute inset-x-0 top-0 h-8 opacity-90"
                      style={{ backgroundColor: palette.accent }}
                    />
                    <div 
                      className="absolute bottom-2 left-2 right-2 h-4 rounded opacity-80"
                      style={{ backgroundColor: palette.surface }}
                    />
                    <div 
                      className="absolute bottom-2 left-2 w-12 h-4 rounded"
                      style={{ backgroundColor: palette.eventColors[0] }}
                    />
                  </div>
                  
                  {/* Color Palette Preview */}
                  <div className="flex gap-1 mb-3">
                    {palette.eventColors.slice(0, 8).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {palette.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {palette.id === 'warm' && 'Soft and welcoming'}
                    {palette.id === 'ocean' && 'Cool and refreshing'}
                    {palette.id === 'forest' && 'Natural and calming'}
                    {palette.id === 'purple' && 'Royal and elegant'}
                    {palette.id === 'autumn' && 'Warm and cozy'}
                    {palette.id === 'midnight' && 'Dark and modern'}
                    {palette.id === 'dark-gradient' && 'Vibrant and bold'}
                    {palette.id === 'pastel' && 'Light and airy'}
                  </p>
                </div>

                {/* Selection Indicator */}
                {selectedTheme === palette.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            Continue to Scheduler
          </button>
        </div>
      </div>
    </div>
  );
};