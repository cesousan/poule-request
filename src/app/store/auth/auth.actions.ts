import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GitlabUser } from '../../services/auth.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ token: string }>(),
    'Login Success': props<{ user: GitlabUser; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Load User': emptyProps(),
    'Load User Success': props<{ user: GitlabUser }>(),
    'Load User Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
  }
}); 