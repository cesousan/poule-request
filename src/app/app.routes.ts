import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';
import { ShellComponent } from './ui/shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./ui/pages/login/login.page').then(m => m.LoginPage),
    canActivate: [loginGuard]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'mrs',
        loadComponent: () => import('./ui/pages/merge-request-list/merge-request-list.page').then(m => m.MergeRequestsListPage),
      },
      {
        path: '',
        redirectTo: 'mrs',
        pathMatch: 'full'
      }
    ]
  }
];
