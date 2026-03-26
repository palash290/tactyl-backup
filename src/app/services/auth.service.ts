import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
      
      constructor(private router: Router) { }

      getToken() {
            return localStorage.getItem('tactylToken')
      };

      isLogedIn() {
            return this.getToken() !== null
      }


}