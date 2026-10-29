import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Auth } from './auth';

export interface ProductoApi {
  idproducto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  categoria: {
    idcategoria: number;
    nombre: string;
    descripcion: string;
  };
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  categoriaId: number;
  stock: number;
}

export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  stock: number;
  categoria: {
    idcategoria: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Productos {
  private readonly apiUrl = 'http://localhost:8080/api/productos';

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {}

  private obtenerHeaders(): HttpHeaders {
    const token = this.auth.obtenerToken();

    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<ProductoApi[]>(this.apiUrl).pipe(
      map(productos =>
        productos.map(producto => ({
          id: producto.idproducto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria.nombre,
          categoriaId: producto.categoria.idcategoria,
          stock: producto.stock
        }))
      )
    );
  }

  crearProducto(producto: ProductoRequest): Observable<ProductoApi> {
    return this.http.post<ProductoApi>(
      this.apiUrl,
      producto,
      { headers: this.obtenerHeaders() }
    );
  }

  actualizarProducto(
    id: number,
    producto: ProductoRequest
  ): Observable<ProductoApi> {
    return this.http.put<ProductoApi>(
      `${this.apiUrl}/${id}`,
      producto,
      { headers: this.obtenerHeaders() }
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.obtenerHeaders() }
    );
  }
}
