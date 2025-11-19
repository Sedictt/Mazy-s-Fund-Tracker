import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log('Firebase initialized');

export { app, analytics, db };
