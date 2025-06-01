export function FormatTime(timeString) {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':').map(Number);
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
}
