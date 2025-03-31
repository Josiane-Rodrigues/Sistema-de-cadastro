import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendToQueue } from './producer'; // importe o producer

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/cadastro', async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashSenha = await bcrypt.hash(user.senha, salt);

    const userDB = await prisma.user.create({
      data: {
        nome: user.nome,
        email: user.email,
        senha: hashSenha,
      },
    });

    // Envia a criação do usuário para a fila RabbitMQ
    sendToQueue(userDB);

    res.status(201).json(userDB);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor, tente novamente' });
  }
});

export default router;
