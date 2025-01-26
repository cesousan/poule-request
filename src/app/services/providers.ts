import { Provider } from '@angular/core';
import { AUTH_SERVICE } from './auth.interface';
import { GITLAB_SERVICE } from './gitlab.interface';
import { AuthService } from './auth.service';
import { GitlabService } from './gitlab.service';

export const provideAuthService = (): Provider => ({
  provide: AUTH_SERVICE,
  useClass: AuthService
});

export const provideGitlabService = (): Provider => ({
  provide: GITLAB_SERVICE,
  useClass: GitlabService
}); 