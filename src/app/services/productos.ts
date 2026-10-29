import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class Productos {
  private readonly apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<ProductoApi[]>(this.apiUrl).pipe(
      map(productos =>
        productos.map(producto => ({
          id: producto.idproducto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria.nombre,
          stock: producto.stock
        }))
      )
    );
  }
}
