import { authGuard } from './guards/auth.guard';
import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';

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
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro').then(m => m.Registro)
  },
  {
      path: 'perfil',
      canActivate: [authGuard],
      loadComponent: () =>
        import('./pages/perfil/perfil').then(m => m.Perfil)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.Admin)
  },
  {
    path: 'admin/categorias',
    canActivate: [adminGuard],
    component: AdminCategorias
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
