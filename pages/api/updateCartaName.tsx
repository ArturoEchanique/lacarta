import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("holi");
  if (req.method === 'POST') {
    const { nombre, cartaID } = req.body;

    // Actualizar la tabla de cartas
    try {
      await queryBuilder
        .updateTable('cartas')
        .set({ nombre })
        .where('carta_id', '=', cartaID)
        .execute();

      res.status(200).json({ message: 'Carta name successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating carta' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
