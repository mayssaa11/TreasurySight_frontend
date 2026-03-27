import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // récupérer le token stocké (après login)
    const token = localStorage.getItem('token');
    console.log('📌 TOKEN récupéré :', token);

    if (token) {
      // cloner la requête pour ajouter le header Authorization
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
       console.log('📤 REQUÊTE AVEC TOKEN :');
    console.log('URL:', clonedReq.url);
    console.log('Headers:', clonedReq.headers);
    console.log('Authorization header:', clonedReq.headers.get('Authorization'));
      return next.handle(clonedReq);
    }
    // si pas de token, envoyer la requête normalement
    return next.handle(req);
  }
}
