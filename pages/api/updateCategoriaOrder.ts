// /api/updateCategoriaOrder.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Categoria } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { categorias } = req.body;
        try {
            await Promise.all(categorias.map(async (categoria: Categoria) => {
                await queryBuilder
                    .updateTable('categorias')
                    .set({ orden: categoria.orden })
                    .where('categoria_id', '=', categoria.id)
                    .execute();
            }));


            res.status(200).json({ message: 'Categorias order updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating categorias order' });
            console.error(error);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}





