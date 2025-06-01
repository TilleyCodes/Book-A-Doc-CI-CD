export function FormatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();

  // Use a function instead of nested ternary expressions
  const getSuffix = (dayNum) => {
    if (dayNum === 1 || dayNum === 21 || dayNum === 31) {
      return 'st';
    }
    if (dayNum === 2 || dayNum === 22) {
      return 'nd';
    }
    if (dayNum === 3 || dayNum === 23) {
      return 'rd';
    }
    return 'th';
  };

  const suffix = getSuffix(day);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(date);

  return `${day}${suffix} ${formattedDate}`;
}
