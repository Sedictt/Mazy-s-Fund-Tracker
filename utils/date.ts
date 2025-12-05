import { ContributionRule } from '../firestoreSettings';

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
    if (isContributionDay(currentDate)) {
      count++;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return count;
};

export const isContributionDay = (date: Date): boolean => {
  // November 17, 2025 - the date when Mondays became contribution days
  const mondayStartDate = new Date('2025-11-17');
  mondayStartDate.setUTCHours(0, 0, 0, 0);

  const dayOfWeek = date.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Before Nov 17, 2025: Exclude Monday (1), Friday (5), and Sunday (0)
  // After Nov 17, 2025: Exclude Friday (5) and Sunday (0) only (Mondays included)
  if (date < mondayStartDate) {
    // Old rule: exclude Monday, Friday, Sunday
    return dayOfWeek !== 0 && dayOfWeek !== 1 && dayOfWeek !== 5;
  } else {
    // New rule: exclude Friday and Sunday only (Mondays are now contribution days)
    return dayOfWeek !== 0 && dayOfWeek !== 5;
  }
};

export const calculateExpectedTotal = (startDateStr: string, endDateStr: string, rules?: ContributionRule[]): number => {
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

  // Default rules if not provided
  const effectiveRules = rules && rules.length > 0 ? [...rules] : [
    { effectiveDate: '2025-11-17', amount: 10 },
    { effectiveDate: '2025-12-01', amount: 20 }
  ];

  // Sort rules by date ascending
  effectiveRules.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

  let total = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Determine if it's a contribution day
    const isDay = isContributionDay(currentDate);

    // Add cost if it is a contribution day
    if (isDay) {
      // Find the applicable rule for this date
      // The applicable rule is the latest rule where effectiveDate <= currentDate
      let amount = 10; // Fallback default

      for (let i = effectiveRules.length - 1; i >= 0; i--) {
        const ruleDate = new Date(effectiveRules[i].effectiveDate);
        ruleDate.setUTCHours(0, 0, 0, 0);
        if (currentDate >= ruleDate) {
          amount = effectiveRules[i].amount;
          break;
        }
      }

      total += amount;
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return total;
};

export const getCurrentContributionAmount = (rules?: ContributionRule[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Default rules if not provided
  const effectiveRules = rules && rules.length > 0 ? [...rules] : [
    { effectiveDate: '2025-11-17', amount: 10 },
    { effectiveDate: '2025-12-01', amount: 20 }
  ];

  // Sort rules by date ascending
  effectiveRules.sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

  let amount = 10; // Fallback default
  for (let i = effectiveRules.length - 1; i >= 0; i--) {
    const ruleDate = new Date(effectiveRules[i].effectiveDate);
    ruleDate.setHours(0, 0, 0, 0);
    if (today >= ruleDate) {
      amount = effectiveRules[i].amount;
      break;
    }
  }
  return amount;
};
