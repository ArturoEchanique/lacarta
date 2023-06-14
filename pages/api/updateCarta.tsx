import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nombre, idCarta, platos } = req.body;

    // Actualizar la tabla de cartas
    try {
      await queryBuilder
        .updateTable('cartas')
        .set({ nombre })
        .where('carta_id', '=', idCarta)
        .execute();

      // Insertar platos en la tabla de platos

      for (const plato of platos) {
        await queryBuilder
          .insertInto('platos')
          .columns(['nombre', 'precio', 'carta_id', 'ingredientes'])
          .values({ nombre: plato.nombre, precio: plato.precio, carta_id: idCarta, ingredientes: plato.ingredientes })
          .execute();
      }

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

