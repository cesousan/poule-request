import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  standalone: true
})
export class AppComponent {
  title = 'poule-request';

  constructor() {
    const store = inject(Store);
    store.dispatch(AuthActions.initializeAuth());
  }
}
