// /api/updatePlatoOrder.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Plato } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { idPlato, visible } = req.body;
        try {
            await queryBuilder
                .updateTable('platos')
                .set({ visible: visible })
                .where('plato_id', '=', idPlato)
                .execute();

            res.status(200).json({ message: 'Platos visibility updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating platos visibility' });
            console.error(error);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}