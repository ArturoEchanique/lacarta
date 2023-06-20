import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const { idCarta, categoria } = req.body;
        try {
            await queryBuilder
                .insertInto('categorias')
                .columns(['nombre', 'carta_id'])
                .values({ nombre: categoria.nombre, carta_id: idCarta })
                .execute();

            res.status(200).json({ message: 'Categorias updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating categorias' });
            console.error(error);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
