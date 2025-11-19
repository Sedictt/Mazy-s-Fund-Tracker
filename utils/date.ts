
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

  // November 17, 2025 - the date when Mondays became contribution days
  const mondayStartDate = new Date('2025-11-17');
  mondayStartDate.setUTCHours(0, 0, 0, 0);

  let count = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    // Before Nov 17, 2025: Exclude Monday (1), Friday (5), and Sunday (0)
    // After Nov 17, 2025: Exclude Friday (5) and Sunday (0) only (Mondays included)
    if (currentDate < mondayStartDate) {
      // Old rule: exclude Monday, Friday, Sunday
      if (dayOfWeek !== 0 && dayOfWeek !== 1 && dayOfWeek !== 5) {
        count++;
      }
    } else {
      // New rule: exclude Friday and Sunday only (Mondays are now contribution days)
      if (dayOfWeek !== 0 && dayOfWeek !== 5) {
        count++;
      }
    }
    
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  return count;
};
