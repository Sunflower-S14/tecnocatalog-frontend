import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';
import { Favoritos } from '../../services/favoritos';
import { Productos, Producto } from '../../services/productos';

@Component({
  selector: 'app-favoritos',
  imports: [RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class FavoritosPage implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  error = '';

  constructor(
    public auth: Auth,
    private router: Router,
    private favoritosService: Favoritos,
    private productosService: Productos,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.auth.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    const usuario = this.auth.obtenerUsuario();

    if (!usuario) {
      this.auth.cerrarSesion();
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;
    this.error = '';

    this.favoritosService.obtenerFavoritos(usuario.usuarioId)
      .subscribe({
        next: (ids) => {
          this.productosService.obtenerProductos()
            .pipe(
              finalize(() => {
                this.cargando = false;
                this.cdr.detectChanges();
              })
            )
            .subscribe({
              next: (productos) => {
                this.productos = productos.filter(
                  producto => ids.includes(producto.id)
                );
              },
              error: (error) => {
                console.error('Error al cargar productos:', error);
                this.error = 'No fue posible cargar los productos.';
              }
            });
        },
        error: (error) => {
          console.error('Error al cargar favoritos:', error);
          this.error = 'No fue posible cargar tus favoritos.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  quitarFavorito(productoId: number): void {
    const usuario = this.auth.obtenerUsuario();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.favoritosService
      .eliminarFavorito(usuario.usuarioId, productoId)
      .subscribe({
        next: () => {
          this.productos = this.productos.filter(
            producto => producto.id !== productoId
          );
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al quitar favorito:', error);
          this.error = 'No fue posible quitar el favorito.';
          this.cdr.detectChanges();
        }
      });
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/catalogo']);
  }
}
