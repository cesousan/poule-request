import { createFeature, createSelector } from '@ngrx/store';
import { authReducer } from './auth.reducer';
export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
  extraSelectors: ({selectToken}) => ({
    selectIsAuthenticated: createSelector(
      selectToken,
      (token): boolean => token !== null
    )
  })
});

export const {
  selectAuthState,
  selectUser,
  selectToken,
  selectLoading,
  selectError,
  selectIsAuthenticated,
} = authFeature;
