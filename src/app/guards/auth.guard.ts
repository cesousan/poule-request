import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { IAuthService, AUTH_SERVICE } from '../services/auth.interface';
import { Store } from '@ngrx/store';
import { selectToken } from '../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const token = store.selectSignal(selectToken);

  if (token()) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const token = store.selectSignal(selectToken);
  const router = inject(Router);

  if (token()) {
    return router.createUrlTree(['/mrs']);
  }

  return true;
}; 