import { z } from "zod";
import { Permission } from '@prisma/client'
import { permission } from "node:process";

export const createNoteSchema = z.object({
    title: z.string()
        .trim()
        .max(40, 'Máximo de 40 carateres no titulo')
        .default('Sem título'),

    content: z.string()
        .max(50000, 'Máximo de 50 000 carateres'),

    tagIds: z.array(
        z.number().int().positive('Tag inválida'))
        .default([1]),

    collabs: z.array(
        z.object({
            userName: z.string().min(1, 'UserName obrigatório'),
            permission: z.nativeEnum(Permission).default(Permission.READONLY)
        })
    ).default([]),
    
    isPublic: z.boolean().default(false),

    publicPermission: z.nativeEnum(Permission).default(Permission.READONLY),
})

export type typeCreateNote = z.infer<typeof createNoteSchema>;