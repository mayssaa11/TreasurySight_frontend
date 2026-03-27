import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EvenementService {
  id: number;
  description: string;
  montant?: number;
  type: string;
  dateEcheance: string;
  statut: string;
}

@Injectable({
  providedIn: 'root',
})
export class Event {
  private url='http://localhost:8080/evenements';
  constructor(private http: HttpClient) { }

  // Récupérer les événements par type
  getByType(entreprise_id: number, type: string): Observable<EvenementService[]> {
    return this.http.get<EvenementService[]>(`${this.url}?entreprise_id=${entreprise_id}&type=${type}`);
  }

  // Ajouter ou modifier un événement
  save(EvenementService: EvenementService): Observable<EvenementService> {
    return this.http.post<EvenementService>(this.url, EvenementService);
  }

  //  Supprimer un événement
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
