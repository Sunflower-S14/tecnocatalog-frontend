import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  mostrarPassword = false;
  cargando = false;
  error = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  iniciarSesion(): void {
    if (!this.email.trim() || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.auth.iniciarSesion({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.cargando = false;

        if (err.status === 0) {
          this.error = 'No fue posible conectar con el servidor.';
        } else if (err.status === 401 || err.status === 403) {
          this.error = 'Correo o contraseña incorrectos.';
        } else {
          this.error = 'Ocurrió un error al iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }
}
