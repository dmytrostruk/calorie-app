import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public get<TResponse>(endpoint: string): Observable<TResponse> {
    return this.http.get<TResponse>(
      environment.apiUrl + endpoint,
      this.getHeaders()
    );
  }

  public post<TResponse>(endpoint: string, data: any): Observable<TResponse> {
    return this.http.post<TResponse>(
      environment.apiUrl + endpoint,
      data,
      this.getHeaders()
    );
  }

  public patch<TResponse>(endpoint: string, data: any): Observable<TResponse> {
    return this.http.patch<TResponse>(
      environment.apiUrl + endpoint,
      data,
      this.getHeaders()
    );
  }

  // #region Private Methods

  private getHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` },
    };
  }

  // #endregion
}
