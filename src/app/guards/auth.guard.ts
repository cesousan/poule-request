import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { IAuthService, AUTH_SERVICE } from '../services/auth.interface';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject<IAuthService>(AUTH_SERVICE);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject<IAuthService>(AUTH_SERVICE);
  const router = inject(Router);

  if (authService.getToken()) {
    return router.createUrlTree(['/mrs']);
  }

  return true;
}; 