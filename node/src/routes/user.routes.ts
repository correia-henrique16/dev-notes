import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { registerSchema, loginSchema } from "../schemas/user.schema.ts";
import {hash, compare} from "../lib/bcrypt.ts"
import { signJWT } from '../lib/jwt.ts'
import { isAuthenticated } from "../utils/isAuthenticated.ts";

export async function userRoutes(server: FastifyInstance) {

    server.post('/signup', async (request, reply) => {

        const {name, userName, password} = registerSchema.parse(request.body)
        
        const isUserNameAvailable = await prisma.users.count({
            where: {
                userName
            }
        }) == 0

        if (!isUserNameAvailable) {
            return reply.code(400)
                .send({
                    error : 'User name already exists'
                })
        }

        const user = await prisma.users.create({
            data: {
                name,
                userName, 
                password: await hash(password)
            }
        })

        const accessToken = signJWT({
            id: user.id,
            userName: user.userName,
            name: user.name
        })

        reply.setCookie('token', accessToken, {
            path: '/', // Define que o cookie é valido para o site inteiro (tudo oq comesse com /)
            httpOnly: true, // O JavaScript do cliente não consegue ler nem roubar
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 ano inteiro em segundos (60s * 60m * 24h * 365d)
        })

        return reply.code(201)
            .send({
                message: 'Conta criada com sucesso!',
                accessToken
            })
    })

    server.post('/auth', async (request, reply) => {
        const { userName, password } = loginSchema.parse(request.body)

        const user = await prisma.users.findFirst({
            where: {
                userName
            }
        })

        if (!user) {
            return reply.code(401)
                .send({
                    error : 'Password incorreta'
                })
        }

        const isValidPassword = await compare(password, user.password)

        if(!isValidPassword) {
            return reply.code(401)
                .send({
                    error : 'Password incorreta'
                })
        }

        const accessToken = signJWT({
            id: user.id,
            userName: user.userName,
            name: user.name
        })

        reply.setCookie('token', accessToken, {
            path: '/', // Define que o cookie é valido para o site inteiro (tudo oq comesse com /)
            httpOnly: true, // O JavaScript do cliente não consegue ler nem roubar
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 ano inteiro em segundos (60s * 60m * 24h * 365d)
        })

        return reply.code(200)
        .send({
            message: 'Logado com sucesso',
            accessToken
        })
    })

    server.get('/me', {preHandler: isAuthenticated}, async (request, reply) => {
        const userId = request.userId
        const userName = request.userName

        const user = await prisma.users.findUnique({
            where: {
                id: userId,
                userName
            }
        })

        if (!user) {
            return reply.code(404)
                .send({
                    error: 'User not found!'
                })
        }

        return reply.code(201)
            .send({
                id: userId,
                userName: userName,
                name: user.name,
                createdAt: user.createdAt
            })
    })

    server.post('/logout', async (request, reply) => {
        reply.clearCookie('token', {
            path: '/',
        })

        return reply.send({ message: 'Logout efetuado com sucesso' })
    })
}