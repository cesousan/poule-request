import { GitlabUser } from '../../services/auth.interface';

export interface AuthState {
  user: GitlabUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
}; 