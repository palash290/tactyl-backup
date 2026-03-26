import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { initializeApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private messaging = getMessaging(initializeApp(environment.firebaseConfig));


  async requestPermissionAndGetToken() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: environment.firebaseConfig.vapidKey
      });

      return token;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log("Message received:", payload);

      new Notification(payload.notification?.title || 'New alert', {
        body: payload.notification?.body || '',
        icon: '/img/calender_bg_icon.png'
      });
    });
  }


}
