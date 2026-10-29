import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';
import { Categoria, CategoriasService } from '../../services/categorias';
import {
  Productos,
  Producto,
  ProductoRequest
} from '../../services/productos';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';
  modoEdicion = false;
  productoEditandoId: number | null = null;

  formulario = {
    nombre: '',
    descripcion: '',
    stock: 0,
    categoriaId: 0
  };

  constructor(
    public auth: Auth,
    private productosService: Productos,
    private categoriasService: CategoriasService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.auth.estaAutenticado() || !this.auth.esAdministrador()) {
      this.router.navigate([
        this.auth.estaAutenticado() ? '/catalogo' : '/login'
      ]);
      return;
    }

    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.error = 'No fue posible cargar las categorías.';
        this.cdr.detectChanges();
      }
    });
  }
  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.productosService.obtenerProductos()
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: productos => {
          this.productos = productos;
        },
        error: error => {
          console.error('Error al cargar productos:', error);
          this.error = 'No fue posible cargar los productos.';
        }
      });
  }

  guardarProducto(): void {
    this.mensaje = '';
    this.error = '';

    const nombre = this.formulario.nombre.trim();
    const descripcion = this.formulario.descripcion.trim();
    const stock = Number(this.formulario.stock);
    const categoriaId = Number(this.formulario.categoriaId);

    if (
      !nombre ||
      !descripcion ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isInteger(categoriaId) ||
      categoriaId <= 0
    ) {
      this.error =
        'Completa todos los campos con valores válidos.';
      return;
    }

    const datos: ProductoRequest = {
      nombre,
      descripcion,
      stock,
      categoria: {
        idcategoria: categoriaId
      }
    };

    this.guardando = true;

    const peticion = this.modoEdicion && this.productoEditandoId !== null
      ? this.productosService.actualizarProducto(
          this.productoEditandoId,
          datos
        )
      : this.productosService.crearProducto(datos);

    peticion
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.mensaje = this.modoEdicion
            ? 'Producto actualizado correctamente.'
            : 'Producto registrado correctamente.';

          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: error => {
          console.error('Error al guardar producto:', error);
          this.error =
            'No fue posible guardar el producto. Verifica la categoría y los datos enviados.';
        }
      });
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;

    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      stock: producto.stock,
      categoriaId: producto.categoriaId
    };

    this.mensaje = '';
    this.error = '';
  }

  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Seguro que deseas eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.productosService.eliminarProducto(producto.id)
      .subscribe({
        next: () => {
          this.mensaje = 'Producto eliminado correctamente.';
          this.productos = this.productos.filter(
            item => item.id !== producto.id
          );
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error al eliminar producto:', error);
          this.error =
            'No fue posible eliminar el producto.';
          this.cdr.detectChanges();
        }
      });
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.productoEditandoId = null;

    this.formulario = {
      nombre: '',
      descripcion: '',
      stock: 0,
      categoriaId: 0
    };
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/catalogo']);
  }
}
