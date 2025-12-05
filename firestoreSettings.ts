import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface ContributionRule {
    effectiveDate: string; // YYYY-MM-DD
    amount: number;
}

export interface AppSettings {
    goal: number;
    contributionRules: ContributionRule[];
}

const SETTINGS_DOC_ID = 'global_settings';

export const loadSettingsFromFirestore = async (): Promise<AppSettings | null> => {
    try {
        const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Ensure contributionRules exists for backward compatibility
            return {
                goal: data.goal || 5000,
                contributionRules: data.contributionRules || [
                    { effectiveDate: '2025-11-17', amount: 10 },
                    { effectiveDate: '2025-12-01', amount: 20 }
                ]
            } as AppSettings;
        } else {
            // Initialize default
            const defaultSettings: AppSettings = {
                goal: 5000,
                contributionRules: [
                    { effectiveDate: '2025-11-17', amount: 10 },
                    { effectiveDate: '2025-12-01', amount: 20 }
                ]
            };
            await setDoc(docRef, defaultSettings);
            return defaultSettings;
        }
    } catch (error) {
        console.error("Error loading settings:", error);
        return null;
    }
};

export const saveSettingsToFirestore = async (settings: Partial<AppSettings>) => {
    try {
        const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error saving settings:", error);
    }
};
