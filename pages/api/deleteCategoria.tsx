import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {idCategoria} = req.body;

    try {

      await queryBuilder
        .deleteFrom('categorias')
        .where('categoria_id', '=', idCategoria)
        .execute();

      res.status(200).json({message: 'Categoria eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando categoria' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}