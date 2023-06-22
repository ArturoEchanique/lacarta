import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { idCarta } = req.body;

    try {
      const cartaData = await queryBuilder
        .selectFrom('cartas')
        .select(['carta_id', 'nombre'])
        .where('carta_id', '=', idCarta)
        .execute();

      const categoriasData = await queryBuilder
        .selectFrom('categorias')
        .select(['nombre', 'orden', 'categoria_id'])
        .where('carta_id', '=', idCarta)
        .execute();

      const carta = cartaData.map((data: any) => ({
        nombre: data.nombre,
        id: data.carta_id,
        categorias: categoriasData.map((catData: any) => ({
          id: catData.categoria_id,
          nombre: catData.nombre,
          orden: catData.orden,
          platos: []
        })),
      }));

      for (let i = 0; i < carta[0].categorias.length; i++) {
        const platosData = await queryBuilder
          .selectFrom('platos')
          .select(['plato_id', 'nombre', 'precio', 'ingredientes', 'orden'])
          .where('categoria_id', '=', carta[0].categorias[i].id)
          .execute();
        const platos = platosData.map((data: any) => ({
          id: data.plato_id,
          idCategoria: carta[0].categorias[i].id,
          nombre: data.nombre,
          precio: data.precio,
          ingredientes: data.ingredientes,
          orden: data.orden
        }));
        platos.forEach((plato, index) => {
          console.log(`Orden del plato ${index} en la categoría ${i}:`, plato.orden);
        });
        carta[0].categorias[i].platos = platos;
      }

      res.status(200).json({ carta: carta[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching carta data' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}