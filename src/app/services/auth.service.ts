import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GitlabUser, IAuthService } from './auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly apiUrl = 'https://gitlab.com/api/v4';
  private readonly tokenKey = 'gitlab_token';
  private readonly _currentUser = new BehaviorSubject<GitlabUser | null>(null);

  private readonly http = inject(HttpClient);

  get currentUser$(): Observable<GitlabUser | null> {
    return this._currentUser.asObservable();
  }

  get currentUser(): GitlabUser | null {
    return this._currentUser.value;
  }

  login(token: string): Observable<GitlabUser> {
    return this.loadUser(token).pipe(
      tap(() => this.setToken(token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._currentUser.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  loadUser(token: string): Observable<GitlabUser> {
    return this.http.get<GitlabUser>(`${this.apiUrl}/user`, {
      headers: new HttpHeaders({
        'PRIVATE-TOKEN': token
      })
    }).pipe(
      tap(user => this._currentUser.next(user))
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
} 