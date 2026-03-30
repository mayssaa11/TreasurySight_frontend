import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ImportService {

  constructor(private http: HttpClient) {}

  parsePdf(file: File, entrepriseId: number) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any[]>(
      `http://localhost:8080/api/import/pdf/${entrepriseId}`,
      formData
    );
  }
}