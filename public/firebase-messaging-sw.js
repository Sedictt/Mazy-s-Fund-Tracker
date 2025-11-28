importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: 'AIzaSyCkBhPCkP-6oFHyZDKPX_CT6OeMn2FzO2Q',
    authDomain: 'aetheria-4a391.firebaseapp.com',
    projectId: 'aetheria-4a391',
    storageBucket: 'aetheria-4a391.firebasestorage.app',
    messagingSenderId: '910312544469',
    appId: '1:910312544469:web:da4b7aa45a5001c0fdea5c',
    measurementId: 'G-V90T5V86NJ',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
