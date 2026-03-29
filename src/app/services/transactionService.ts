import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
   private apiUrl = 'http://localhost:8080/transaction';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer toutes les transactions d'une entreprise
  getByEntreprise(idEntreprise: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${idEntreprise}`);
  }

  // ✅ Ajouter une transaction
  addTransaction(transaction: any): Observable<any> {
    return this.http.post(this.apiUrl, transaction);
  }

  // ✅ Modifier une transaction
  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction);
  }

  // ✅ Supprimer une transaction
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ Récupérer une seule transaction
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}
