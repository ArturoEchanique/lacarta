import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { plato } = req.body;
    try {
      const updatedPlato = await prisma.platos.update({
        where: {
          plato_id: plato.id
        },
        data: {
          nombre: plato.nombre,
          precio: plato.precio,
          ingredientes: plato.descripcion,
          categoria_id: plato.idCategoria,
          orden: plato.orden,
        },
      });

      res.status(200).json({
        message: "Plato updated successfully",
        plato: updatedPlato,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating plato" });
      console.error(error);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
