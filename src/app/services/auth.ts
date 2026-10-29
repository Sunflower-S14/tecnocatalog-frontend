
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  nombre: string;
  numeroCelular: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombre: string;
  email: string;
  rolId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly usuariosUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  iniciarSesion(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      datos
    ).pipe(
      tap(respuesta => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta));
      })
    );
  }

  registrarUsuario(datos: RegistroRequest): Observable<unknown> {
    return this.http.post(
      `${this.usuariosUrl}/registro`,
      datos
    );
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): AuthResponse | null {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario) as AuthResponse;
    } catch {
      localStorage.removeItem('usuario');
      return null;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  esAdministrador(): boolean {
    return this.obtenerUsuario()?.rolId === 1;
  }

  esUsuario(): boolean {
    return this.obtenerUsuario()?.rolId === 2;
  }
}
