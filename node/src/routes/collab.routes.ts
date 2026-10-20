import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { addCollaboratorSchema, editCollaboratorSchema } from "../schemas/collab.schema.ts";
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

export async function collabRoutes(server: FastifyInstance) {
    // Tudo o que estiver dentro deste plugin vai correr o isAuthenticated automaticamente:
    // payload já vem preenchido e garantido
    server.addHook('preHandler', isAuthenticated)

    server.get('/collabs', async (request, reply) => {
        const collabs = await prisma.collabs.findMany({
            where: {
                collaburator: request.userId,
            },
            include: {
                note: {
                    include: {
                        owner: {
                            select: {
                            name: true,
                            userName: true,
                            },
                        },
                        notesTags: {
                            include: {
                            tag: true,
                            },
                        },
                    },
                },
            },
        })

        return reply.code(200).send({ collabs })
    })

    server.post<{Params: {noteId: string}}>('/collabs/:noteId', async (request, reply) => {
        const noteId = Number(request.params.noteId)

        const noteValido = await verificarNota(noteId, request.userId)

        if(!noteValido) {
            return reply.code(401)
                .send({
                    error: 'Nota não existe'
                })
        }

        const { permission, userName } = addCollaboratorSchema.parse(request.body)

        const userToCollab = await prisma.users.findUnique({
            where: { userName },
        })

        if (!userToCollab) {
            return reply.code(404).send({ error: 'Utilizador não encontrado' })
        }

        if (userToCollab.id === request.userId) {
            return reply.code(400).send({ error: 'Não te podes adicionar como colaborador da tua própria nota' })
        }

        const jaEColaborador = await prisma.collabs.findUnique({
            where: {
                noteId_collaburator: {
                    noteId,
                    collaburator: userToCollab.id,
                },
            },
        })

        if (jaEColaborador) {
            return reply.code(400).send({ error: 'Este utilizador já é colaborador desta nota' })
        }

        const collab = await prisma.collabs.create({
            data: {
                noteId,
                collaburator: userToCollab.id,
                permission

            },
            include: {
                user: {
                    select: {
                    id: true,
                    name: true,
                    userName: true,
                    },
                },
            },
        })

        return reply.code(201)
            .send({
                collab: collab
            })
    })

    server.patch<{Params: {id: string}}>('/collabs/:id', async (request, reply) => {
        const collabId = Number(request.params.id)

        const validCollab = await prisma.collabs.findUnique({
            where: {
                collabId
            }
        })

        if (!validCollab) {
            return reply.code(404).send({ error: 'Colaboração inexistente' })
        }

        const noteId = validCollab.noteId

        const noteValido = await verificarNota(noteId, request.userId)

        if(!noteValido) {
            return reply.code(401)
                .send({
                    error: 'Colaboração inexistente'
                })
        }

        const collab = editCollaboratorSchema.parse(request.body)

        const { permission } = collab

        await prisma.collabs.update({
            where: {
                collabId
            }, 
            data: {
                permission

            },
            include: {
                user: {
                    select: {
                    id: true,
                    name: true,
                    userName: true,
                    },
                },
            }
        })

        return reply.code(200)
            .send({
                message: 'Collab editada',
                collab: collab
            })
    })

    server.delete<{Params: {id: string}}>('/collabs/:id', async (request, reply) => {
        const collabId = Number(request.params.id)

        const validCollab = await prisma.collabs.findUnique({
            where: {
                collabId
            }
        })

        if (!validCollab) {
            return reply.code(404).send({ error: 'Colaboração inexistente' })
        }

        const noteId = validCollab.noteId

        const noteValido = await verificarNota(noteId, request.userId)

        if(!noteValido) {
            return reply.code(401)
                .send({
                    error: 'Colaboração inexistente'
                })
        }

        await prisma.collabs.delete({
            where: {
                collabId: collabId
            }
        })

        return reply.code(200)
            .send({
                message: 'Collab apagada'
            })
    })
}