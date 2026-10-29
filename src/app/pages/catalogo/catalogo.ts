import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Productos, Producto } from '../../services/productos';

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  constructor(
    public auth: Auth,
    private router: Router,
    private productosService: Productos,
    private cdr: ChangeDetectorRef
  ) {}

  // Búsqueda
  busqueda = '';

  // Categorías disponibles
  categorias = [
    { nombre: 'Todos', icono: 'bi-grid' },
    { nombre: 'Computación', icono: 'bi-laptop' },
    { nombre: 'Accesorios', icono: 'bi-headphones' },
    { nombre: 'Almacenamiento', icono: 'bi-device-ssd' },
    { nombre: 'Periféricos', icono: 'bi-keyboard' }
  ];

  categoriaSeleccionada = 'Todos';

  // Productos obtenidos desde el backend
  productos: Producto[] = [];
  cargandoProductos = true;
  errorProductos = '';

  // Paginación
  paginaActual = 1;
  productosPorPagina = 6;


ngOnInit(): void {
  this.productosService.obtenerProductos().subscribe({
    next: (productos) => {
      console.log('Productos recibidos del backend:', productos);

      this.productos = productos;
      this.busqueda = '';
      this.categoriaSeleccionada = 'Todos';
      this.paginaActual = 1;

      this.categorias = [
        { nombre: 'Todos', icono: 'bi-grid' },
        ...Array.from(
          new Set(productos.map(producto => producto.categoria))
        ).map(nombre => ({
          nombre,
          icono: 'bi-tag'
        }))
      ];

      console.log('Productos filtrados:', this.productosFiltrados);
      console.log('Productos de la primera página:', this.productosPaginados);
    },
    error: (error) => {
      console.error('Error al cargar productos:', error);
      this.errorProductos = 'No fue posible cargar los productos.';
      this.cargandoProductos = false;
      this.cdr.detectChanges();
    },
    complete: () => {
      this.cargandoProductos = false;
      this.cdr.detectChanges();
    }
  });
}

  // Filtrar productos por categoría y búsqueda
  get productosFiltrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.productos.filter(producto => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' ||
        producto.categoria === this.categoriaSeleccionada;

      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto);

      return coincideCategoria && coincideBusqueda;
    });
  }

  // Calcular el número de páginas
  get totalPaginas(): number {
    return Math.ceil(
      this.productosFiltrados.length / this.productosPorPagina
    );
  }

  // Obtener únicamente los productos de la página actual
  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;

    return this.productosFiltrados.slice(
      inicio,
      inicio + this.productosPorPagina
    );
  }

  // Crear los números de página
  get paginas(): number[] {
    return Array.from(
      { length: this.totalPaginas },
      (_, i) => i + 1
    );
  }

  // Seleccionar una categoría
  seleccionarCategoria(nombre: string): void {
    this.categoriaSeleccionada = nombre;
    this.paginaActual = 1;
  }

  // Actualizar búsqueda
  actualizarBusqueda(event: Event): void {
    this.busqueda = (event.target as HTMLInputElement).value;
    this.paginaActual = 1;
  }

  // Limpiar búsqueda y filtros
  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoriaSeleccionada = 'Todos';
    this.paginaActual = 1;
  }

  // Cambiar de página
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  // Favoritos (por ahora se mantienen en memoria)
  favoritosIds: number[] = [];

  esFavorito(id: number): boolean {
    return this.favoritosIds.includes(id);
  }

  alternarFavorito(id: number): void {
    if (this.esFavorito(id)) {
      this.favoritosIds = this.favoritosIds.filter(
        favoritoId => favoritoId !== id
      );
    } else {
      this.favoritosIds = [...this.favoritosIds, id];
    }
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/catalogo']);
  }
}
