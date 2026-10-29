import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
  nuevo?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  busqueda = '';

  categorias = [
    { nombre: 'Todos', icono: 'bi-grid' },
    { nombre: 'Computación', icono: 'bi-laptop' },
    { nombre: 'Accesorios', icono: 'bi-headphones' },
    { nombre: 'Almacenamiento', icono: 'bi-device-ssd' },
    { nombre: 'Periféricos', icono: 'bi-keyboard' }
  ];

  categoriaSeleccionada = 'Todos';

  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Teclado mecánico',
      descripcion: 'Teclado mecánico con conexión USB',
      categoria: 'Periféricos',
      precio: 899,
      imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
      nuevo: true
    },
    {
      id: 2,
      nombre: 'Audífonos inalámbricos',
      descripcion: 'Audífonos para trabajo y entretenimiento',
      categoria: 'Accesorios',
      precio: 649,
      imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 3,
      nombre: 'Laptop profesional',
      descripcion: 'Equipo portátil para productividad',
      categoria: 'Computación',
      precio: 12499,
      imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80',
      nuevo: true
    },
    {
      id: 4,
      nombre: 'Mouse inalámbrico',
      descripcion: 'Mouse ergonómico para uso diario',
      categoria: 'Periféricos',
      precio: 399,
      imagen: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 5,
      nombre: 'Unidad de almacenamiento',
      descripcion: 'Almacenamiento externo compacto',
      categoria: 'Almacenamiento',
      precio: 1099,
      imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 6,
      nombre: 'Monitor',
      descripcion: 'Pantalla para tu espacio de trabajo',
      categoria: 'Computación',
      precio: 3299,
      imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80'
    }
  ];

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

  seleccionarCategoria(nombre: string): void {
    this.categoriaSeleccionada = nombre;
  }

  actualizarBusqueda(event: Event): void {
    this.busqueda = (event.target as HTMLInputElement).value;
  }
}
