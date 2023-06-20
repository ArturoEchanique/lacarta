import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { idCarta } = req.body;

    try {
      const cartaData = await queryBuilder
        .selectFrom('cartas')
        .select(['nombre'])
        .where('carta_id', '=', idCarta)
        .execute();

      const categoriasData = await queryBuilder
        .selectFrom('categorias')
        .select(['nombre', 'orden', 'categoria_id'])
        .where('carta_id', '=', idCarta)
        .execute();

      const carta = cartaData.map((data: any) => ({
        nombre: data.nombre,
        categorias: categoriasData.map((catData: any) => ({
          categoriaID: catData.categoria_id,
          nombre: catData.nombre,
          orden: catData.orden,
          platos: []
        })),
      }));

      for (let i = 0; i < carta[0].categorias.length; i++) {
        const platosData = await queryBuilder
          .selectFrom('platos')
          .select(['nombre', 'precio', 'ingredientes'])
          .where('categoria_id', '=', carta[0].categorias[i].categoriaID)
          .execute();
        const platos = platosData.map((data: any) => ({
          nombre: data.nombre,
          precio: data.precio,
          ingredientes: data.ingredientes
        }));
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