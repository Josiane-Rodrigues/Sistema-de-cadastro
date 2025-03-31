import express from 'express';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

 const router = express.Router()
 const JWT_SECRET = process.env.JWT_SECRET

 // cadastro 

 router.post('/cadastro', async(req, res) => {

    try{
    const user = req.body
        const salt =  await bcrypt.genSalt(10)
        const hashSenha = await bcrypt.hash(user.senha, salt)

        const userDB = await prisma.user.create({

            data: {
            nome: user.nome, 
            email: user.email,
            senha: hashSenha,
            },
        })

        res.status(201).json(userDB)
    }
    catch(err) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' });
    }
 })
 router.post('/login', async (req, res) =>{

    try{
        const userInfo = req.body
         // busca o usuário no banco de dados 

        const user = await prisma.user.findUnique({where:{email:userInfo.email},
        
        })
        // Verifica se  o usuário  existe no banco de dados 
        if(!user){
            return res.status(404).json({message:"Usuario não entrado"})
        }

       //Compara a senha 

        const isMatch = await bcrypt.compare(userInfo.senha, user.senha)
        if(!isMatch){
            return res.status(400).json({message:'Senha inválida'})
        }

        //Gera o Token 
        const token = jwt.sign({id: user.id}, JWT_SECRET,{expiresIn: '1d'})

        res.status(200).json({ user, token });
    }catch(err) {

        res.status(500).json({ message: 'Erro no servidor, tente novamente' });
    }


 })

 export default router	