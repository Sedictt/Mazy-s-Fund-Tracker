
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const countContributionDays = (startDateStr: string, endDateStr: string): number => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Set to midnight UTC to avoid timezone issues during iteration
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);
  
  if (startDate > endDate) {
    return 0;
  }

  let count = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Exclude Monday (1), Friday (5), and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 1 && dayOfWeek !== 5) {
      count++;
    }
    
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  return count;
};
