import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

interface Categoria {
  idcategoria: number;
  nombre: string;
  descripcion: string | null;
}

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css'
})
export class AdminCategorias implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/api/categorias';

  categorias: Categoria[] = [];

  categoria: { nombre: string; descripcion: string } = {
    nombre: '',
    descripcion: ''
  };

  categoriaEditando: number | null = null;
  cargando = false;
  guardando = false;
  error = '';
  mensaje = '';

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
  }


listarCategorias(): void {
  this.cargando = true;
  this.error = '';

  console.log('Consultando categorías:', this.apiUrl);

  this.http.get<Categoria[]>(this.apiUrl).subscribe({
    next: (datos) => {
      console.log('Categorías recibidas en Angular:', datos);

      this.categorias = datos;
      this.cargando = false;

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar categorías:', err);
      this.error = `No fue posible cargar las categorías. Código HTTP: ${err.status}`;
      this.cargando = false;
    }
  });
}


  guardarCategoria(): void {
    this.error = '';
    this.mensaje = '';

    const nombre = this.categoria.nombre.trim();
    const descripcion = this.categoria.descripcion.trim();

    if (!nombre) {
      this.error = 'El nombre de la categoría es obligatorio.';
      return;
    }

    if (nombre.length > 45) {
      this.error = 'El nombre no puede superar los 45 caracteres.';
      return;
    }

    if (descripcion.length > 100) {
      this.error = 'La descripción no puede superar los 100 caracteres.';
      return;
    }

    const datos = {
      nombre,
      descripcion: descripcion || null
    };

    this.guardando = true;

    const peticion = this.categoriaEditando !== null
      ? this.http.put<Categoria>(
          `${this.apiUrl}/${this.categoriaEditando}`,
          datos
        )
      : this.http.post<Categoria>(this.apiUrl, datos);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.categoriaEditando !== null
          ? 'Categoría actualizada correctamente.'
          : 'Categoría creada correctamente.';

        this.limpiarFormulario();
        this.guardando = false;

        this.cdr.detectChanges();

        this.listarCategorias();
      },
      error: (err) => {
        console.error('Error al guardar categoría:', err);
        this.error = 'No fue posible guardar la categoría. Verifica los datos e inténtalo nuevamente.';
        this.guardando = false;
      }
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditando = categoria.idcategoria;
    this.categoria = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? ''
    };

    this.error = '';
    this.mensaje = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarCategoria(categoria: Categoria): void {
    const confirmar = window.confirm(
      `¿Estás segura de eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.error = '';
    this.mensaje = '';

    this.http.delete<void>(
      `${this.apiUrl}/${categoria.idcategoria}`
    ).subscribe({
      next: () => {
        this.mensaje = 'Categoría eliminada correctamente.';
        this.listarCategorias();
      },
      error: (err) => {
        console.error('Error al eliminar categoría:', err);
        this.error =
          'No fue posible eliminar la categoría. Comprueba si tiene productos asociados.';
      }
    });
  }

  limpiarFormulario(): void {
    this.categoria = {
      nombre: '',
      descripcion: ''
    };

    this.categoriaEditando = null;
    this.error = '';
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/catalogo']);
  }
}
