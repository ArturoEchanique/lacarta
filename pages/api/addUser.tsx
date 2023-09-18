import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        message: 'User added successfully',
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding user' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
