import { ApplicationConfig } from '@angular/core';
import { InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './interceptors/http.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDeJErx-QtoxonqHjWbEtwz6RTEI8gmUZQ",
  authDomain: "tactyl-c1f20.firebaseapp.com",
  projectId: "tactyl-c1f20",
  storageBucket: "tactyl-c1f20.firebasestorage.app",
  messagingSenderId: "564246362102",
  appId: "1:564246362102:web:07af3dcfd14232e80eb9d7",
  measurementId: "G-K6Q22QBJ1S",
  vapidKey: 'BPjxqLEv-ptuDVkJU355FbMJbPhtRxiG-uM7anKryNFpDTvEDQpdVTVPtaZ5rWnh3I_0_aSpl-ojlRT8wwccsu4'
}
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideRouter(routes, withInMemoryScrolling(scrollConfig)),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    provideAnimationsAsync(),
  ]
};