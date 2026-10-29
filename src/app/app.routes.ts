import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo').then(m => m.Catalogo)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
{
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.Admin)
  },
    {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos/favoritos').then(m => m.FavoritosPage)
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];
