import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../../lib/planetscale';
import Carta from '.././carta';  // Asegúrate de tener un componente CartaTable

interface Carta {
  nombre: string;
  categorias: Categoria[];
}

interface Categoria {
  id: number;
  nombre: string;
  orden: number;
  platos: Plato[];
}

interface Plato {
  nombre: string;
  precio: number;
  ingredientes: string;
}

export const dynamic = 'force-dynamic';

export default async function CartaPage({
  idCarta
}: {
  idCarta: number;
}) {

  idCarta = 1

  const cartaData = await queryBuilder
    .selectFrom('cartas')
    .select(['nombre'])
    .where('carta_id', '=', idCarta)
    .execute();

  const carta: Carta[] = cartaData.map((data: any) => ({
    nombre: data.nombre,
    categorias: []
  }));

  const categoriasData = await queryBuilder
    .selectFrom('categorias')
    .select(['nombre', 'orden', 'categoria_id'])
    .where('carta_id', '=', idCarta)
    .execute();

  const categorias: Categoria[] = categoriasData.map((data: any) => ({
    id: data.categoria_id,
    nombre: data.nombre,
    orden: data.orden,
    platos: []
  }));

  for (let i = 0; i < categorias.length; i++) {
    const platosData = await queryBuilder
      .selectFrom('platos')
      .select(['nombre', 'precio', 'ingredientes'])
      .where('categoria_id', '=', categorias[i].id)
      .execute();
    const platos: Plato[] = platosData.map((data: any) => ({
      nombre: data.nombre,
      precio: data.precio,
      ingredientes: data.ingredientes
    }));
    categorias[i].platos = platos;
  }
  carta[0].categorias = categorias;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Restaurante Paco</Title>
      <Card className="mt-6">
        <Carta carta={carta[0]} />
      </Card>
    </main>
  );
}