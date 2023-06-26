import { useState, useEffect, FC } from 'react';
import MetaCartaEdit from '../../../components/metaCartaEdit/MetaCartaEdit';
import { Categoria, Carta, Plato } from '../../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import { Card, Title, Text } from '@tremor/react';
import type { AppProps } from 'next/app'
import { queryBuilder } from '../../../lib/planetscale';
import VerCartaComponent from '../../../components/verCartaComponent/verCartaComponent';  // Asegúrate de tener un componente CartaTable


export interface paramsa {
  id: number
}
export default async function CartaPage({ params }: { params: paramsa }) {

  const idCarta = params.id
  console.log("id carta is", idCarta)


  const cartaData = await queryBuilder
    .selectFrom('cartas')
    .select(['nombre'])
    .where('carta_id', '=', idCarta)
    .execute();

  const carta: Carta[] = cartaData.map((data: any) => ({
    id: idCarta,
    nombre: data.nombre,
    categorias: []
  }));

  const categoriasData = await queryBuilder
    .selectFrom('categorias')
    .select(['nombre', 'orden', 'categoria_id', 'visible'])
    .where('carta_id', '=', idCarta)
    .where('visible', '=', true) // Solo selecciona categorías visibles
    .execute();

  const categorias: Categoria[] = categoriasData.map((data: any) => ({
    id: data.categoria_id,
    nombre: data.nombre,
    platos: [],
    orden: data.orden,
    visible: data.visible
  }));

  categorias.sort((a: Categoria, b: Categoria) => a.orden - b.orden);


  for (let i = 0; i < categorias.length; i++) {
    const platosData = await queryBuilder
      .selectFrom('platos')
      .select(['plato_id', 'nombre', 'precio', 'ingredientes', 'orden', 'visible'])
      .where('categoria_id', '=', categorias[i].id)
      .where('visible', '=', true) // Solo selecciona platos visibles
      .execute();
    const platos: Plato[] = platosData.map((data: any) => ({
      id: data.plato_id,
      idCategoria: categorias[i].id,
      nombre: data.nombre,
      precio: data.precio,
      descripcion: data.ingredientes,
      orden: data.orden,
      visible: data.visible
    }));
    categorias[i].platos = platos;
  }

  categorias.forEach((categoria: Categoria) => {
    categoria.platos.sort((a: Plato, b: Plato) => a.orden - b.orden);
  });

  carta[0].categorias = categorias;


  // if (!carta[0]) {
  //   return <div>Loading...</div>;  // Puedes mostrar un spinner de carga aquí
  // }

  return (
    <div className="carta">
      <Card className="mt-6">
        <VerCartaComponent carta={carta[0]} />
      </Card>
    </div>
  );
}