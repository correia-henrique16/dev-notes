import { FastifyInstance } from "fastify";
// import { prisma } from '../lib/prisma.ts'

export async function pingRoutes(server: FastifyInstance) {
    server.get('/ping', (request, reply) => {
        return reply.code(200)
            .send({
                ping: 'pong'
            })
    })
}