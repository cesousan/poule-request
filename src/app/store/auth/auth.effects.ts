import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { AUTH_SERVICE, IAuthService } from '../../services/auth.interface';

const initializeAuth = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject<IAuthService>(AUTH_SERVICE)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        const token = localStorage.getItem('gitlab_token');
        if (!token) {
          return of(AuthActions.initializeAuthFailure({ error: 'No token found' }));
        }
        return authService.loadUser(token).pipe(
          map(user => AuthActions.initializeAuthSuccess({ user, token })),
          catchError((error) => of(AuthActions.initializeAuthFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

const login = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject<IAuthService>(AUTH_SERVICE)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ token }) =>
        authService.login(token).pipe(
          map(user => AuthActions.loginSuccess({ user, token })),
          catchError(error => 
            of(AuthActions.loginFailure({ 
              error: error?.message || 'Login failed' 
            }))
          )
        )
      )
    );
  },
  { functional: true }
);

const authSuccess = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.initializeAuthSuccess),
      tap(({ token }) => {
        localStorage.setItem('gitlab_token', token);
        router.navigate(['/mrs']);
      })
    );
  },
  { functional: true, dispatch: false }
);

const logout = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('gitlab_token');
        router.navigate(['/login']);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const authEffects = {
  initializeAuth,
  login,
  authSuccess,
  logout
}; 