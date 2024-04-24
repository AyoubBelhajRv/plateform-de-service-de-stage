import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, { username, password })
      .pipe(
        catchError(this.handleError) // Handle errors
      );
  }

  private handleError(error: any): Observable<any> {
    // Handle error logic here, e.g., logging, showing user-friendly message
    console.error('An error occurred:', error);
    // Return an observable with a user-friendly error message
    return throwError('Something went wrong, please try again later.');
  }
}
