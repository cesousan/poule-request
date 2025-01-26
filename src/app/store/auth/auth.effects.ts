import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { AUTH_SERVICE, IAuthService } from '../../services/auth.interface';

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

const loginSuccess = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => router.navigate(['/mrs']))
    );
  },
  { functional: true, dispatch: false }
);

const loadUser = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject<IAuthService>(AUTH_SERVICE)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        authService.currentUser$.pipe(
          map(user => {
            if (!user) throw new Error('User not found');
            return AuthActions.loadUserSuccess({ user });
          }),
          catchError(error => 
            of(AuthActions.loadUserFailure({ 
              error: error?.message || 'Failed to load user' 
            }))
          )
        )
      )
    );
  },
  { functional: true }
);

const logout = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject<IAuthService>(AUTH_SERVICE),
    router = inject(Router)
  ) => {
    return actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        authService.logout();
        router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    );
  },
  { functional: true }
);

export const authEffects = {
  login,
  loginSuccess,
  loadUser,
  logout
}; 