// types.ts
export interface Plato {
  id: number;
  idCategoria: number;
  nombre: string;
  precio: number;
  ingredientes: string;
  orden: number; // Añadido el campo 'orden'
}

export interface Categoria {
  id: number;
  nombre: string;
  platos: Plato[];
  orden: number; // Añadido el campo 'orden'
}

export interface Carta {
  id: number
  nombre: string;
  categorias: Categoria[];
}