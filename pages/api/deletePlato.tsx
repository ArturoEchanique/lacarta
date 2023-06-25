import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {idPlato} = req.body;

    try {
      // Primero borra todos los platos que pertenecen a las categorías de la carta
      await queryBuilder
        .deleteFrom('platos')
        .where('plato_id', '=', idPlato)
        .execute();

      res.status(200).json({message: 'Plato eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando plato' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}