import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthService, AUTH_SERVICE } from '../../../services/auth.interface';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectError, selectLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center mb-6">Login to GitLab</h2>
          
          @if (error()) {
            <div class="alert alert-error mb-4">
              {{ error() }}
            </div>
          }

          <form (submit)="onSubmit($event)" class="form-control gap-4">
            <div>
              <label class="label">
                <span class="label-text">Personal Access Token</span>
              </label>
              <input
                type="password"
                [(ngModel)]="token"
                name="token"
                placeholder="Enter your GitLab token"
                class="input input-bordered w-full"
                [class.input-error]="error()"
              />
              <label class="label">
                <span class="label-text-alt">
                  <a href="https://gitlab.com/-/profile/personal_access_tokens" 
                     target="_blank"
                     class="link link-primary">
                    Generate a token
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  private readonly store = inject(Store);
  
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  
  token = '';

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.token) {
      return;
    }

    this.store.dispatch(AuthActions.login({ token: this.token }));
  }
} 