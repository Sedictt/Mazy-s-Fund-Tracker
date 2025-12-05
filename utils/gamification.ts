import { Contribution, Member } from '../types';
import { isContributionDay, getTodayDateString, calculateExpectedTotal } from './date';

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
}

export const BADGES: Record<string, Badge> = {
    ON_FIRE: {
        id: 'on_fire',
        name: 'On Fire',
        icon: '🔥',
        description: '3+ day contribution streak!',
        color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
    SUPER_STREAK: {
        id: 'super_streak',
        name: 'Super Streak',
        icon: '⚡',
        description: '7+ day contribution streak!',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    RELIABLE: {
        id: 'reliable',
        name: 'Reliable',
        icon: '💎',
        description: '100% contribution rate',
        color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    NEWCOMER: {
        id: 'newcomer',
        name: 'Newcomer',
        icon: '👶',
        description: 'Joined in the last 7 days',
        color: 'bg-green-100 text-green-600 border-green-200'
    },
    EARLY_BIRD: {
        id: 'early_bird',
        name: 'Early Bird',
        icon: '🌅',
        description: 'Often pays in the morning',
        color: 'bg-sky-100 text-sky-600 border-sky-200'
    }
};

export const calculateStreak = (memberId: string, contributions: Contribution[]): number => {
    const today = new Date();

    // Sort contributions by date descending for easier checking
    const memberContributions = contributions
        .filter(c => c.memberId === memberId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const paidDates = new Set(memberContributions.map(c => c.date));

    let streak = 0;
    let currentDate = new Date(today);

    // Helper to get YYYY-MM-DD in local time
    const getLocalYMD = (d: Date) => {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check today first
    const todayStr = getLocalYMD(currentDate);
    if (isContributionDay(currentDate)) {
        if (paidDates.has(todayStr)) {
            streak++;
        }
    }

    // Move to yesterday
    currentDate.setDate(currentDate.getDate() - 1);

    // Loop backwards
    while (true) {
        // Safety break for infinite loops
        if (streak > 3650) break;

        // If we went back before 2024 (project start), stop
        if (currentDate.getFullYear() < 2024) break;

        if (isContributionDay(currentDate)) {
            const dateStr = getLocalYMD(currentDate);
            if (paidDates.has(dateStr)) {
                streak++;
            } else {
                // Missed a contribution day! Streak ends.
                break;
            }
        }
        // If not a contribution day, just skip it and continue checking backwards
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
};

export const getMemberBadges = (member: Member, contributions: Contribution[]): Badge[] => {
    const badges: Badge[] = [];
    const streak = calculateStreak(member.id, contributions);

    // Streak Badges
    if (streak >= 7) {
        badges.push(BADGES.SUPER_STREAK);
    } else if (streak >= 3) {
        badges.push(BADGES.ON_FIRE);
    }

    // Reliable Badge
    const today = getTodayDateString();
    const expectedTotal = calculateExpectedTotal(member.joinDate, today);
    // Avoid division by zero for new members
    if (expectedTotal > 0 && member.totalContributions >= expectedTotal) {
        badges.push(BADGES.RELIABLE);
    }

    // Newcomer Badge
    const joinDate = new Date(member.joinDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (joinDate >= sevenDaysAgo) {
        badges.push(BADGES.NEWCOMER);
    }

    return badges;
};
