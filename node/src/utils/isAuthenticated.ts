import { verifyJWT, UserTokenPayload } from '../lib/jwt.ts'
import { FastifyRequest, FastifyReply } from 'fastify'

// Injeta os campos no FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    userId: string
    userName: string
  }
}

export async function isAuthenticated (request: FastifyRequest, reply: FastifyReply) {
    let accessToken = request.cookies.token

    if (!accessToken) {
        const rawToken = request.headers?.authorization

        if (!rawToken || !rawToken.startsWith('Bearer ')) {
            return reply.status(401).send({ error: 'Token não fornecido ou mal formatado' })
        }
    }

    if (!accessToken) {
        return reply.status(401).send({ error: 'Token não fornecido ou mal formatado' })
    }

    const payload = verifyJWT(accessToken) as UserTokenPayload | null

    if (!payload) {
        return reply.code(401)
            .send({
                error: 'Invalid Token'
            })
    }

    const {id, userName} = payload

    request.userId = id
    request.userName = userName

}