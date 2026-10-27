import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma.ts'
import { createNoteSchema } from "../schemas/note.schema.ts";
import { isAuthenticated } from "../utils/isAuthenticated.ts";

const verificarCollabs = async (collabs: { userName: string; permission: any }[], currentUserId: string) => {
  if (!collabs || collabs.length === 0) return []

  const collabsValidadas = []

  for (const item of collabs) {
    const user = await prisma.users.findUnique({
      where: { userName: item.userName },
      select: { id: true },
    })

    if (!user || user.id === currentUserId) {
      return null
    }

    collabsValidadas.push({
      collaburator: user.id,
      permission: item.permission,
    })
  }

  return collabsValidadas
}

const verificarNota = async (noteId: number, userId: string) => {
    if(!noteId) {
        return null
    }

    const note = await prisma.notes.findUnique({
        where: {
            id: noteId
        }
    })

    if (!note) return null

    if (!note.ownerId || note.ownerId != userId) {
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

const verificarEditarNota = async (noteId: number, userId: string) => {
    if(!noteId) {
        return null
    }

    const note = await prisma.notes.findUnique({
        where: {
            id: noteId
        }
    })

    if (!note) return null

    //Verificar se o user é o owner, se for devolve logo certo
    const isOwner = note?.ownerId == userId 
    if (isOwner) return 'isOwner'

    //Verificar se a nota é publica, e se o publicPermission é EDITOR, se for devolve logo certo
    const isPublicEditor = note?.isPublic && note.publicPermission == 'EDITOR'
    if (isPublicEditor) return true
    
    //Verificar se o user é colaborador e com permissao e EDITOR, se for devolve logo certo
    const isCollaborator = await prisma.collabs.findFirst({
        where: {
            AND: [
                {noteId},
                {collaburator: userId},
                {permission: "EDITOR"}
            ]
        }
    })
    if (isCollaborator) return true

    //se n passar em nenhum, return null
    return null
}

export async function noteRoutes(server: FastifyInstance) {
    // Tudo o que estiver dentro deste plugin vai correr o isAuthenticated automaticamente:
    // payload já vem preenchido e garantido
    server.addHook('preHandler', isAuthenticated)

    server.get('/notes', async (request, reply) => {
        const notes = await prisma.notes.findMany({
            where: {
                OR: [
                    {ownerId: request.userId}
                ]
                
            },
            include: {
                notesTags: { include: { tag: true } },
                collabs: { include: { user: true } },
            }
        })

        return reply.code(200)
            .send({
                notes
            })
    })

    server.get('/notes/public', async (request, reply) => {
        const notes = await prisma.notes.findMany({
            where: {
                isPublic: true, 
            },
            include: {
                notesTags: { include: { tag: true } },
                collabs: { include: { user: true } },
            }
        })

        return reply.code(200)
            .send({
                notes
            })
    })

    server.get('/notes/collabs', async (request, reply) => {
        const notes = await prisma.notes.findMany({
            where: {
                collabs: {
                    some: {
                        collaburator: request.userId
                    }
                }, 
            },
            include: {
                notesTags: { include: { tag: true } },
                collabs: { include: { user: true } },
            }
        })

        return reply.code(200)
            .send({
                notes
            })
    })

    server.post('/notes', async (request, reply) => {
        const { content, isPublic, publicPermission, tagIds, title, collabs } = createNoteSchema.parse(request.body)
        

        //VERIFICAR SE O GAJO É O CRIADOR DAS TAGS
        const tagsValidas = await verificarTags(tagIds, request.userId)

        if (!tagsValidas){
            return reply.code(401)
                .send({
                    error: 'Possui tags inválidas'
                })
        }

        const collabsProntas = await verificarCollabs(collabs, request.userId)

        if (!collabsProntas) {
            return reply.code(400).send({ error: 'Um ou mais colaboradores são inválidos' })
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
                },

                // Se collabsProntas tiver elementos, cria-os; caso contrário não faz nada
                collabs: collabsProntas.length > 0 ? { create: collabsProntas } : undefined,
            },
            include: {
                notesTags: { include: { tag: true } },
                collabs: { include: { user: true } },
            }
        })

        return reply.code(201)
            .send({
                message: 'Nota criada!',
                note: note
            })
    })

    server.put<{Params: {id: string}}>('/notes/:id', async (request, reply) => {
        const noteId = Number(request.params.id)

        const podeEditar = await verificarEditarNota(noteId, request.userId)

        if(!podeEditar) {
            return reply.code(403)
                .send({
                    error: 'Sem permissão'
                })
        }

        const note = createNoteSchema.parse(request.body)

        const { content, isPublic, publicPermission, tagIds, title } = note

        const isOwner = podeEditar == 'isOwner'

        const updatedNote = await prisma.notes.update({
            where: {
                id: noteId
            }, 
            data: {
                title,
                content,
                isPublic: isOwner ? isPublic : undefined , //se for o owner, atualiza direito, se nao for, fica como tava antes
                publicPermission: isOwner ? publicPermission : undefined, 
                
                notesTags: (isOwner && tagIds) ? {
                    deleteMany: {},
                    create: tagIds.map((tagId) => ({
                        tagId
                    }))
                } : undefined
            },
            include: {
                notesTags: {
                    include: {
                        tag: true
                    }
                }
            }
        })

        return reply.code(200)
            .send({
                message: 'Nota editada',
                note: updatedNote,
                noteId: noteId
            })
    })

    server.delete<{Params: {id: string}}>('/notes/:id', async (request, reply) => {
        const noteId = Number(request.params.id)

        const noteValida = await verificarNota(noteId, request.userId)

        if(!noteValida) {
            return reply.code(401)
                .send({
                    error: 'Nota não existe'
                })
        }

        await prisma.notes.delete({
            where: {
                id: noteId
            }
        })

        return reply.code(200)
            .send({
                message: 'Nota apagada'
            })
    })
}