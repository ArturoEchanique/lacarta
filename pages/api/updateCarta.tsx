import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("holi");
  if (req.method === 'POST') {
    const { nombre, idCarta, categorias } = req.body;

    // Log the data received
    console.log({ nombre, idCarta, categorias });
    // Actualizar la tabla de cartas
    try {
      await queryBuilder
        .updateTable('cartas')
        .set({ nombre })
        .where('carta_id', '=', idCarta)
        .execute();

      // Insertar categorias en la tabla de categorias y platos en la tabla de platos
      for (const categoria of categorias) {
        const results = await queryBuilder
          .insertInto('categorias')
          .columns(['nombre', 'carta_id'])
          .values({ nombre: categoria.nombre, carta_id: idCarta })
          .execute();

        const idCategoria = results[0].insertId; // Obtén el ID de la categoría recién insertada

        for (const plato of categoria.platos) {
          await queryBuilder
            .insertInto('platos')
            .columns(['nombre', 'precio', 'categoria_id', 'ingredientes'])
            .values({ nombre: plato.nombre, precio: plato.precio, categoria_id: idCategoria, ingredientes: plato.description })
            .execute();
        }
      }

      res.status(200).json({ message: 'Carta, categorias y platos updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating carta, categorias and platos' });
      console.error(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
