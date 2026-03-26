importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDeJErx-QtoxonqHjWbEtwz6RTEI8gmUZQ",
    authDomain: "tactyl-c1f20.firebaseapp.com",
    projectId: "tactyl-c1f20",
    storageBucket: "tactyl-c1f20.firebasestorage.app",
    messagingSenderId: "564246362102",
    appId: "1:564246362102:web:07af3dcfd14232e80eb9d7",
    measurementId: "G-K6Q22QBJ1S",
    vapidKey: 'BPjxqLEv-ptuDVkJU355FbMJbPhtRxiG-uM7anKryNFpDTvEDQpdVTVPtaZ5rWnh3I_0_aSpl-ojlRT8wwccsu4'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'No Title';
    const notificationOptions = {
        // title: payload.notification?.title || 'No Title',
        body: payload.notification?.body || 'No Body',
        icon: payload.notification?.icon || '/firebase-logo.png'
    };
    console.log('Attempting to show notification:', notificationTitle, notificationOptions);

    self.registration.showNotification(notificationTitle, notificationOptions);

});

console.log("service worker", messaging);