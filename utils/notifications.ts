import { messaging, db } from '../firebase';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

// Replace with your VAPID Key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Configuration
const VAPID_KEY = 'BPj_Zts-fmEnBOk8ebr-3ln5yKlvoI9qNoI7FPoZC4Jy7fQL8tS4zzorAp2Nln1IGWwI6rc1C0XSXG9S8vuahas';

export const requestNotificationPermission = async (memberId?: string) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      if (memberId) {
        // Get FCM Token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY
        });

        if (token) {
          console.log('FCM Token:', token);
          // Save token to Firestore
          await updateDoc(doc(db, 'members', memberId), {
            fcmToken: token
          });
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token or requesting permission: ', error);
  }
};

export const showContributionNotification = (memberName: string, amount: number) => {
  if (Notification.permission === 'granted') {
    new Notification('New Contribution', {
      body: `${memberName} contributed ₱${amount}`,
      icon: '/logo.png'
    });
  }
};

export const playNotificationSound = async () => {
  try {
    const audio = new Audio('/notification.mp3');
    await audio.play();
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};
