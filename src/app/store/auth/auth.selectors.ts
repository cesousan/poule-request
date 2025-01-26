import { createFeature, createSelector } from '@ngrx/store';
import { authReducer } from './auth.reducer';
export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const {
  selectAuthState,
  selectUser,
  selectToken,
  selectLoading,
  selectError,
} = authFeature;

export const selectIsAuthenticated = createSelector(
  selectToken,
  (token): boolean => token !== null
); 