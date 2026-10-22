import { verifyJWT, UserTokenPayload } from '../lib/jwt.ts'
import { FastifyRequest, FastifyReply } from 'fastify'

// Injeta os campos no FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    userId: string
    userName: string,
    name: string
  }
}

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    let accessToken = request.cookies.token

    // Se não veio por cookie, tenta ler do header Authorization
    if (!accessToken) {
        const rawToken = request.headers?.authorization

        if (!rawToken || !rawToken.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Token não fornecido ou mal formatado' })
        }

        // Extrai a string do token a seguir a "Bearer "
        accessToken = rawToken.split(' ')[1]
    }

    if (!accessToken) {
        return reply.status(401).send({ error: 'Token não fornecido ou mal formatado' })
    }

    const payload = verifyJWT(accessToken) as UserTokenPayload | null

    if (!payload) {
        return reply.status(401).send({ error: 'Invalid Token' })
    }

    const { id, userName, name } = payload

    request.userId = id
    request.userName = userName
    request.name = name
}