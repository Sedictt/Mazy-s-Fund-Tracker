
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

  // Set to midnight UTC to compare just dates and avoid timezone issues
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  if (startDate > endDate) {
    return 0;
  }
  
  const diffTime = endDate.getTime() - startDate.getTime();
  // Add 1 to make the count inclusive of the start day
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return diffDays;
};
