import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  //baseUrl = 'https://tactyl-dev.online/api/';
  //baseUrl = 'https://tactyl.online/api/';
  //baseUrl = 'http://192.168.1.16:4009/api/';
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {
    const authToken = localStorage.getItem('tactylToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.get<T>(this.baseUrl + url, { headers: headers });
  };

  post<T, U>(url: string, data: U): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, data)
  };

  patch<T, U>(url: string, data: U): Observable<T> {
    return this.http.patch<T>(this.baseUrl + url, data)
  };

  postAPI(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('austriaAdminToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.baseUrl + url, data, { headers: headers })
  }

  update<T, U>(url: string, data: U): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, data)
  };

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url);
  };


  setToken(token: string) {
    localStorage.setItem('tactylToken', token)
  }

  private refreshSidebarSource = new BehaviorSubject<void | null>(null);
  refreshSidebar$ = this.refreshSidebarSource.asObservable();

  triggerHeaderRefresh() {
    this.refreshSidebarSource.next(null);
  }

  // private refreshSubject = new Subject<void>();
  // refresh$ = this.refreshSubject.asObservable();

  // triggerRefresh() {
  //   this.refreshSubject.next();
  // }


}
