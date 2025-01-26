import { effects as mergeRequestEffects } from './merge-requests/merge-requests.effects';
import { authEffects } from './auth/auth.effects';

export const effects = [
  mergeRequestEffects,
  authEffects
]; 