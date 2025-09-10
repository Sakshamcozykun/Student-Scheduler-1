import { ClassSession } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportScheduleAsText = (classes: ClassSession[]): string => {
  const sortedClasses = [...classes].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayCompare = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  let output = '📅 STUDENT SCHEDULE\n';
  output += '═══════════════════\n\n';

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  dayOrder.forEach(day => {
    const dayClasses = sortedClasses.filter(cls => cls.day === day);
    if (dayClasses.length > 0) {
      output += `${day.toUpperCase()}\n`;
      output += '─'.repeat(day.length) + '\n';
      
      dayClasses.forEach(cls => {
        const formatTime = (time: string): string => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return `${hour12}:${minutes} ${ampm}`;
        };

        output += `• ${cls.courseName}\n`;
        output += `  📍 ${cls.location}\n`;
        output += `  🕐 ${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}\n`;
        if (cls.description) {
          output += `  📝 ${cls.description}\n`;
        }
        output += '\n';
      });
    }
  });

  output += `\nTotal Classes: ${classes.length}\n`;
  output += `Generated on: ${new Date().toLocaleDateString()}\n`;

  return output;
};

export const downloadSchedule = (classes: ClassSession[]): void => {
  const content = exportScheduleAsText(classes);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `student-schedule-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportScheduleAsPDF = async (classes: ClassSession[]): Promise<void> => {
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Student Schedule', pageWidth / 2, 20, { align: 'center' });
  
  // Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayWidth = (pageWidth - 40) / 7;
  const startX = 20;
  const startY = 45;
  
  // Draw day headers
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  days.forEach((day, index) => {
    const x = startX + (index * dayWidth);
    pdf.text(day.substring(0, 3), x + dayWidth / 2, startY, { align: 'center' });
    
    // Draw vertical lines
    pdf.line(x, startY + 5, x, pageHeight - 20);
  });
  
  // Draw final vertical line
  pdf.line(startX + (7 * dayWidth), startY + 5, startX + (7 * dayWidth), pageHeight - 20);
  
  // Draw horizontal lines for hours (7 AM to 9 PM)
  const hourHeight = (pageHeight - startY - 40) / 14;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  
  for (let hour = 7; hour <= 21; hour++) {
    const y = startY + 10 + ((hour - 7) * hourHeight);
    pdf.line(startX, y, startX + (7 * dayWidth), y);
    
    // Time labels
    const timeLabel = hour === 0 ? '12 AM' : hour <= 12 ? `${hour} ${hour === 12 ? 'PM' : 'AM'}` : `${hour - 12} PM`;
    pdf.text(timeLabel, startX - 5, y - 2, { align: 'right' });
  }
  
  // Add classes
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  
  const sortedClasses = [...classes].sort((a, b) => {
    const dayCompare = days.indexOf(a.day) - days.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    return a.startTime.localeCompare(b.startTime);
  });
  
  sortedClasses.forEach(cls => {
    const dayIndex = days.indexOf(cls.day);
    const x = startX + (dayIndex * dayWidth) + 2;
    
    const startTime = cls.startTime.split(':').map(Number);
    const endTime = cls.endTime.split(':').map(Number);
    const startHour = startTime[0] + startTime[1] / 60;
    const endHour = endTime[0] + endTime[1] / 60;
    
    const y = startY + 10 + ((startHour - 7) * hourHeight);
    const height = (endHour - startHour) * hourHeight;
    
    // Convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 254, g: 197, b: 187 };
    };
    
    const color = hexToRgb(cls.color);
    pdf.setFillColor(color.r, color.g, color.b);
    pdf.rect(x, y, dayWidth - 4, Math.max(height, 10), 'F');
    
    // Add text
    pdf.setTextColor(0, 0, 0);
    pdf.text(cls.courseName, x + 2, y + 5, { maxWidth: dayWidth - 8 });
    pdf.text(cls.location, x + 2, y + 10, { maxWidth: dayWidth - 8 });
    
    const formatTime = (time: string): string => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    pdf.text(`${formatTime(cls.startTime)}-${formatTime(cls.endTime)}`, x + 2, y + 15, { maxWidth: dayWidth - 8 });
  });
  
  // Save the PDF
  pdf.save(`student-schedule-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportScheduleAsJPEG = async (): Promise<void> => {
  const calendarElement = document.querySelector('[data-calendar-export]') as HTMLElement;
  
  if (!calendarElement) {
    throw new Error('Calendar element not found');
  }
  
  // Create a temporary container with better styling for export
  const exportContainer = document.createElement('div');
  exportContainer.style.position = 'fixed';
  exportContainer.style.top = '-9999px';
  exportContainer.style.left = '-9999px';
  exportContainer.style.width = '1200px';
  exportContainer.style.backgroundColor = '#ffffff';
  exportContainer.style.padding = '20px';
  exportContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Clone the calendar
  const clonedCalendar = calendarElement.cloneNode(true) as HTMLElement;
  
  // Add title
  const title = document.createElement('div');
  title.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 10px; color: #333; font-size: 24px; font-weight: bold;">Student Schedule</h1>
    <p style="text-align: center; margin-bottom: 20px; color: #666; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
  `;
  
  exportContainer.appendChild(title);
  exportContainer.appendChild(clonedCalendar);
  document.body.appendChild(exportContainer);
  
  try {
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: 1200,
      height: exportContainer.scrollHeight
    });
    
    // Convert to JPEG and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `student-schedule-${new Date().toISOString().split('T')[0]}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', 0.95);
    
  } finally {
    document.body.removeChild(exportContainer);
  }
};