import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { authentication } from '../constants/authentication';
import { TokenPayload } from '../models/token-payload';
import { TokenResponse } from '../models/token-response';
import { UserTokenDetails } from '../models/user-token-details';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  public register(user: TokenPayload): Observable<TokenResponse> {
    return this.sendAuthRequest('register', user);
  }

  public login(user: TokenPayload): Observable<TokenResponse> {
    return this.sendAuthRequest('login', user);
  }

  public logout(): void {
    this.token = '';

    window.localStorage.removeItem(authentication.TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }

  public getUserDetailsFromToken(): UserTokenDetails | null {
    const token = this.getToken();

    if (token) {
      let payload = window.atob(token.split('.')[1]);
      return JSON.parse(payload);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetailsFromToken();

    if (user) {
      return user.exp > Date.now() / 1000;
    }

    return false;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem(authentication.TOKEN_KEY) as string;
    }

    return this.token;
  }

  //#region Private Methods

  private saveToken(token: string): void {
    localStorage.setItem(authentication.TOKEN_KEY, token);
    this.token = token;
  }

  private sendAuthRequest(
    requestType: 'login' | 'register',
    user: TokenPayload
  ): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(environment.apiUrl + '/auth/' + requestType, user)
      .pipe(
        map((data: TokenResponse) => {
          if (data.token) {
            this.saveToken(data.token);
          }

          return data;
        })
      );
  }

  //#endregion
}
