import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCkBhPCkP-6oFHyZDKPX_CT6OeMn2FzO2Q',
  authDomain: 'aetheria-4a391.firebaseapp.com',
  projectId: 'aetheria-4a391',
  storageBucket: 'aetheria-4a391.firebasestorage.app',
  messagingSenderId: '910312544469',
  appId: '1:910312544469:web:da4b7aa45a5001c0fdea5c',
  measurementId: 'G-V90T5V86NJ',
};

const app = initializeApp(firebaseConfig);

// Initialize analytics conditionally with error handling
let analytics;
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics could not be initialized:', error);
}

const db = getFirestore(app);
const storage = getStorage(app);

// Initialize messaging conditionally with error handling
let messaging;
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  } else {
    console.warn('Service workers are not supported in this browser. Push notifications will be disabled.');
  }
} catch (error) {
  console.warn('Firebase Messaging could not be initialized:', error);
}

console.log('Firebase initialized');

export { app, analytics, db, storage, messaging };
