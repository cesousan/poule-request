import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface GitlabUser {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
}

export interface IAuthService {
  currentUser$: Observable<GitlabUser | null>;
  currentUser: GitlabUser | null;
  login(token: string, organizationId: string): Observable<GitlabUser>;
  logout(): void;
  getToken(): string | null;
  getOrganizationId(): string | null;
  loadUser(token: string): Observable<GitlabUser>;
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE'); 