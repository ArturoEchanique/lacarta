import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {idCarta} = req.body;

    try {
      // Primero borra todos los platos que pertenecen a las categorías de la carta
      await queryBuilder
        .deleteFrom('platos')
        .execute();

      // Luego borra todas las categorías que pertenecen a la carta
      await queryBuilder
        .deleteFrom('categorias')
        .where('carta_id', '=', idCarta)
        .execute();

      res.status(200).json({message: 'Categorias y platos eliminados exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando categorias y platos' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}