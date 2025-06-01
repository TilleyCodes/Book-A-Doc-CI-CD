export const generateMockTimes = () => {
  const mockTimes = [];
  // eslint-disable-next-line no-plusplus
  for (let hour = 9; hour < 17; hour++) {
    mockTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    mockTimes.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return mockTimes.filter(() => Math.random() > 0.3);
};
