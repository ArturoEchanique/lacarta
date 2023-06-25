// types.ts
export interface Plato {
  id: number;
  idCategoria: number;
  nombre: string;
  precio: number;
  descripcion: string;
  orden: number; // Añadido el campo 'orden'
  visible: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  platos: Plato[];
  orden: number; // Añadido el campo 'orden'
  visible: boolean;
}

export interface Carta {
  id: number
  nombre: string;
  categorias: Categoria[];
}