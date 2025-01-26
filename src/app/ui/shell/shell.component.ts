import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AUTH_SERVICE } from '../../services/auth.interface';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-base-200">
      <!-- Header -->
      <header class="navbar bg-base-100 shadow-lg px-4">
        <div class="flex-1">
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <span class="text-xl">🐔</span>
            Poule Request
          </h1>
        </div>
        <div class="flex-none gap-2">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img [src]="currentUser()?.avatar_url" alt="Profile" />
              </div>
            </div>
            <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a (click)="logout()">Logout</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class ShellComponent {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);
  
  readonly currentUser = computed(() => this.authService.currentUser);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 