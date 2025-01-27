import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GitlabUser, IAuthService } from './auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  readonly #apiUrl = 'https://gitlab.com/api/v4';
  readonly #tokenKey = 'gitlab_token';
  readonly #orgIdKey = 'gitlab_org_id';
  readonly #currentUser = new BehaviorSubject<GitlabUser | null>(null);

  readonly http = inject(HttpClient);

  get currentUser$(): Observable<GitlabUser | null> {
    return this.#currentUser.asObservable();
  }

  get currentUser(): GitlabUser | null {
    return this.#currentUser.value;
  }

  login(token: string, organizationId: string): Observable<GitlabUser> {
    return this.loadUser(token).pipe(
      tap(() => this.setCredentials(token, organizationId))
    );
  }

  logout(): void {
    localStorage.removeItem(this.#tokenKey);
    localStorage.removeItem(this.#orgIdKey);
    this.#currentUser.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.#tokenKey);
  }

  getOrganizationId(): string | null {
    return localStorage.getItem(this.#orgIdKey);
  }

  setCredentials(token: string, organizationId: string): void {
    localStorage.setItem(this.#tokenKey, token);
    localStorage.setItem(this.#orgIdKey, organizationId);
  }

  loadUser(token: string): Observable<GitlabUser> {
    return this.http.get<GitlabUser>(`${this.#apiUrl}/user`, {
      headers: new HttpHeaders({
        'PRIVATE-TOKEN': token
      })
    }).pipe(
      tap(user => this.#currentUser.next(user))
    );
  }
} 