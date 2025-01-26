import { mergeRequestsReducer } from './merge-requests/merge-requests.reducer';
import { authReducer } from './auth/auth.reducer';

export const reducers = {
  mergeRequests: mergeRequestsReducer,
  auth: authReducer
}; 