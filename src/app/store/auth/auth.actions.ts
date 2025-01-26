import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GitlabUser } from '../../services/auth.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Initialize Auth': emptyProps(),
    'Initialize Auth Success': props<{ user: GitlabUser; token: string }>(),
    'Initialize Auth Failure': props<{ error: string }>(),
    'Login': props<{ token: string }>(),
    'Login Success': props<{ user: GitlabUser; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
  }
}); 