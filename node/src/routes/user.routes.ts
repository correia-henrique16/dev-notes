import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { registerSchema, loginSchema } from "../schemas/user.schema.ts";
import {hash, compare} from "../lib/bcrypt.ts"
import { signJWT } from '../lib/jwt.ts'
import { isAuthenticathed } from "../utils/isAuthenticathed.ts";

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

        return reply.code(201)
            .send({
                id: user.id.toString()
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
                    message : 'Password incorreta'
                })
        }

        const isValidPassword = await compare(password, user.password)

        if(!isValidPassword) {
            return reply.code(401)
                .send({
                    message : 'Password incorreta'
                })
        }

        const accessToken = signJWT({
            id: user.id,
            userName: user.userName
        })

        return reply.code(200)
        .send({
            accessToken
        })
    })

    server.get('/me', {preHandler: isAuthenticathed}, async (request, reply) => {
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
}