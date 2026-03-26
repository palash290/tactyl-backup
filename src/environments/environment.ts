// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
      production: true,
      // baseUrl: 'https://tactyl-dev.online/api/auth/',
      baseUrl: 'https://tactyl.online/api/auth/',
      // baseUrl: 'http://192.168.1.14:4006/api/',

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      firebaseConfig: {
            apiKey: "AIzaSyDeJErx-QtoxonqHjWbEtwz6RTEI8gmUZQ",
            authDomain: "tactyl-c1f20.firebaseapp.com",
            projectId: "tactyl-c1f20",
            storageBucket: "tactyl-c1f20.firebasestorage.app",
            messagingSenderId: "564246362102",
            appId: "1:564246362102:web:07af3dcfd14232e80eb9d7",
            measurementId: "G-K6Q22QBJ1S",
            vapidKey: 'BPjxqLEv-ptuDVkJU355FbMJbPhtRxiG-uM7anKryNFpDTvEDQpdVTVPtaZ5rWnh3I_0_aSpl-ojlRT8wwccsu4'
      }
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
