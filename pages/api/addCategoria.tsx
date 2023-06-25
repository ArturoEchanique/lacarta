import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { idCarta, categoria } = req.body;
    try {
      const newCategoria = await prisma.categorias.create({
        data: {
          nombre: categoria.nombre,
          carta_id: idCarta,
          orden: categoria.orden,
        },
      });

      res.status(200).json({
        message: "Categorias updated successfully",
        categoria: newCategoria,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating categorias" });
      console.error(error);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}