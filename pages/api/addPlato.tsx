import { NextApiRequest, NextApiResponse } from "next";
import { queryBuilder } from '../../lib/planetscale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'POST') {
        const { idCategoria, plato } = req.body;
        console.log(idCategoria);
        try {
            await queryBuilder
                .insertInto('platos')
                .columns(['nombre', 'precio', 'categoria_id', 'ingredientes'])
                .values({ nombre: plato.nombre, precio: plato.precio, categoria_id: idCategoria, ingredientes: plato.description })
                .execute();

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
