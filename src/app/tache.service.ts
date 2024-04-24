import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tache } from '../app/models/tache.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
  
})
export class TacheService {

  private apiUrl = 'http://localhost:8081/tache'; 

  constructor(private http: HttpClient) { }

  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/all`);
  }

  addTache(newTache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/add`, newTache);
  }

  updateTacheStatus(taskId: number, newStatus: string): Observable<Tache> {
    const url = `${this.apiUrl}/tache/updateStatus/${taskId}`; // Update endpoint as needed
    return this.http.put<Tache>(url, { newStatus });
  }
  deleteTache(taskId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${taskId}`; // Update endpoint as needed
    return this.http.delete(url);
  }
}
