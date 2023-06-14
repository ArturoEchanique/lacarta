import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {idCarta} = req.body;

    // Actualizar la tabla de cartas
    try {
      await queryBuilder
        .deleteFrom('platos')
        .where('carta_id', '=', idCarta)
        .execute();

      res.status(200).json({ message: 'Carta and platos updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating carta and platos' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

