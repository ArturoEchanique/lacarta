// /api/updatePlatoOrder.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Plato } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { platos } = req.body;
        try {
            await Promise.all(platos.map(async (plato: Plato) => {
                await queryBuilder
                    .updateTable('platos')
                    .set({orden: plato.orden})
                    .where('plato_id', '=', plato.id)
                    .where('categoria_id', '=', plato.idCategoria)
                    .execute();
            }));

            res.status(200).json({ message: 'Platos order updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating platos order' });
            console.error(error);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}