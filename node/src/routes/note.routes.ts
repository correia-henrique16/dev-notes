import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { createNoteSchema } from "../schemas/note.schema.ts";
import { isAuthenticated } from "../utils/isAuthenticated.ts";

const verificarNota = async (noteId: number, userId: string) => {
    if(!noteId) {
        return null
    }

    const note = await prisma.notes.findUnique({
        where: {
            id: noteId
        }
    })

    if (!note?.ownerId || note.ownerId != userId) {
        return null
    }

    return note
}

const verificarTags = async (tagIds: number[], userId: string) => {
    if(!tagIds) {
        return null
    }

    const tagsValidas = await prisma.tags.findMany({
        where: {
            id: { in: tagIds}, //procurar pelos ids q tao dentro do array
            OR: [
                { userId: userId},
                { userId: null }
            ]
        }
    })

    if (tagsValidas.length != tagIds.length) {
        return null
    }

    return tagsValidas
}

export async function noteRoutes(server: FastifyInstance) {
    // Tudo o que estiver dentro deste plugin vai correr o isAuthenticated automaticamente:
    // payload já vem preenchido e garantido
    server.addHook('preHandler', isAuthenticated)

    server.get('/notes', async (request, reply) => {
        const notes = await prisma.notes.findMany({
            where: {
                OR: [
                    {ownerId: request.userId},
                    {isPublic: true},
                ]
                
            }
        })

        return reply.code(200)
            .send({
                notes
            })
    })

    server.post('/notes', async (request, reply) => {
        const { content, isPublic, publicPermission, tagIds, title } = createNoteSchema.parse(request.body)
        

        //VERIFICAR SE O GAJO É O CRIADOR DAS TAGS
        const tagsValidas = await verificarTags(tagIds, request.userId)

        if (!tagsValidas){
            return reply.code(401)
                .send({
                    error: 'Possui tags inválidas'
                })
        }

        const note = await prisma.notes.create({
            data: {
                title,
                content,
                isPublic,
                publicPermission,
                ownerId: request.userId,

                notesTags: {
                    create: tagIds.map((tagId) => ({
                        tagId
                    }))
                }
            },
            include: {
                notesTags: {
                    include: {
                        tag: true
                    }
                }
            }
        })

        return reply.code(201)
            .send({
                note: note
            })
    })
}