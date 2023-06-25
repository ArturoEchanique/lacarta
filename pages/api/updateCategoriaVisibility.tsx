import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { idCategoria, visible } = req.body;
    try {
      const updatedCategoria = await prisma.categorias.update({
        where: {
          categoria_id: idCategoria
        },
        data: {
          visible: visible
        },
      });

      res.status(200).json({
        message: "Categorias visibility updated successfully",
        categoria: updatedCategoria,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating categorias visibility" });
      console.error(error);
    }
  } else {
    res.setHeader("Allow", "PUT");
    res.status(405).end("Method Not Allowed");
  }
}
