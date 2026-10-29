
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  nombre = '';
  numeroCelular = '';
  email = '';
  password = '';
  confirmarPassword = '';

  mostrarPassword = false;
  mostrarConfirmacion = false;
  cargando = false;
  error = '';
  mensaje = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  registrarUsuario(): void {
    this.error = '';
    this.mensaje = '';

    const nombre = this.nombre.trim();
    const numeroCelular = this.numeroCelular.trim();
    const email = this.email.trim();

    if (!nombre || !numeroCelular || !email || !this.password ||
        !this.confirmarPassword) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (nombre.length > 45) {
      this.error = 'El nombre no puede superar 45 caracteres.';
      return;
    }

    if (!/^\d{10}$/.test(numeroCelular)) {
      this.error = 'El número celular debe contener exactamente 10 dígitos.';
      return;
    }

    if (email.length > 45 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error = 'Ingresa un correo electrónico válido de máximo 45 caracteres.';
      return;
    }

    if (this.password.length < 8 || this.password.length > 72) {
      this.error = 'La contraseña debe tener entre 8 y 72 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    this.auth.registrarUsuario({
      nombre,
      numeroCelular,
      email,
      password: this.password
    }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/login'], {
          queryParams: { registro: 'exitoso' }
        });
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al registrar usuario:', err);

        if (err.status === 0) {
          this.error = 'No fue posible conectar con el servidor.';
        } else if (err.status === 409) {
          this.error =
            err.error?.detail ||
            'El correo electrónico ya está registrado.';
        } else if (err.status === 400) {
          this.error =
            err.error?.detail ||
            err.error?.message ||
            'Revisa los datos ingresados. Algunos campos no son válidos.';
        } else {
          this.error = 'No fue posible crear la cuenta. Intenta nuevamente.';
        }
      }
    });
  }
}
