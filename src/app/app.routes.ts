import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'sala4a',
    loadComponent: () => import('./pages/sala4a/sala4a.page').then( m => m.Sala4aPage)
  },
  {
    path: 'sala4b',
    loadComponent: () => import('./pages/sala4b/sala4b.page').then( m => m.Sala4bPage)
  },
];
