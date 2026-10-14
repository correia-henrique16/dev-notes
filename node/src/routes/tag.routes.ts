import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { createTagSchema } from "../schemas/tag.schema.ts";
import { isAuthenticated } from "../utils/isAuthenticated.ts";

const verificarTag = async (tagId: number, userId: string) => {
    if(!tagId) {
        return null
    }

    const tag = await prisma.tags.findUnique({
        where: {
            id: tagId
        }
    })

    if (!tag?.userId || tag.userId != userId) {
        return null
    }

    return tag
}

export async function tagRoutes(server: FastifyInstance) {
    // Tudo o que estiver dentro deste plugin vai correr o isAuthenticated automaticamente:
    // payload já vem preenchido e garantido
    server.addHook('preHandler', isAuthenticated)

    server.get('/tags', async (request, reply) => {
        const tags = await prisma.tags.findMany({
            where: {
                OR: [
                    {userId: request.userId},
                    {userId: null},
                ]
                
            }
        })

        return reply.code(200)
            .send({
                tags
            })
    })

    server.post('/tags', async (request, reply) => {
        const { name, color } = createTagSchema.parse(request.body)
        
        const tag = await prisma.tags.create({
            data: {
                name,
                color,
                userId: request.userId
            }
        })

        return reply.code(201)
            .send({
                id: tag.id
            })
    })

    server.put<{Params: {id: string}}>('/tags/:id', async (request, reply) => {
        const tagId = Number(request.params.id)

        const tagValida = await verificarTag(tagId, request.userId)

        if(!tagValida) {
            return reply.code(401)
                .send({
                    error: 'Tag não existe'
                })
        }

        const tag = createTagSchema.parse(request.body)

        const { color, name } = tag

        await prisma.tags.update({
            where: {
                id: tagId
            }, 
            data: {
                name,
                color
            }
        })

        return reply.code(200)
            .send({
                message: 'Tag editada'
            })
    })

    server.delete<{Params: {id: string}}>('/tags/:id', async (request, reply) => {
        const tagId = Number(request.params.id)

        const tagValida = await verificarTag(tagId, request.userId)

        if(!tagValida) {
            return reply.code(401)
                .send({
                    error: 'Tag não existe'
                })
        }

        await prisma.tags.delete({
            where: {
                id: tagId
            }
        })

        return reply.code(200)
            .send({
                message: 'Tag apagada'
            })
    })
}