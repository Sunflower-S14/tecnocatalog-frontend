import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Auth } from './auth';
import { ProductoApi } from './productos';

@Injectable({
  providedIn: 'root'
})
export class Favoritos {
  private readonly apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {}

  private obtenerHeaders(): HttpHeaders {
    const token = this.auth.obtenerToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerFavoritos(usuarioId: number): Observable<number[]> {
    return this.http.get<ProductoApi[]>(
      `${this.apiUrl}/${usuarioId}/favoritos`,
      { headers: this.obtenerHeaders() }
    ).pipe(
      map(productos => productos.map(producto => producto.idproducto))
    );
  }

  agregarFavorito(
    usuarioId: number,
    productoId: number
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/${usuarioId}/favoritos/${productoId}`,
      {},
      { headers: this.obtenerHeaders() }
    );
  }

  eliminarFavorito(
    usuarioId: number,
    productoId: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}/${usuarioId}/favoritos/${productoId}`,
      { headers: this.obtenerHeaders() }
    );
  }
}
