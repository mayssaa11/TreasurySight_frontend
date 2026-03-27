import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl='http://localhost:8080';// l'url du  backend

  constructor(private http:HttpClient) {};

  register(userData:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/register`,userData);
  }

  login(loginData:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/login`,loginData);
  }

}
