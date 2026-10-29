import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.estaAutenticado() || !auth.obtenerUsuario()) {
    return router.createUrlTree(['/login']);
  }

  if (!auth.esAdministrador()) {
    return router.createUrlTree(['/catalogo']);
  }

  return true;
};
