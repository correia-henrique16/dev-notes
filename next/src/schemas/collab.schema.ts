import { z } from "zod";

export const permissionSchema = z.enum(['READONLY', 'EDITOR'])

export const addCollaboratorSchema = z.object({
    userName: z.string().min(1, 'O username do colaborador é obrigatório'),
    permission: permissionSchema.default('READONLY'),
})

export const editCollaboratorSchema = z.object({
    permission: permissionSchema.default('READONLY')
})

export type typePermission = z.infer<typeof permissionSchema>;
export type typeAddColl = z.infer<typeof addCollaboratorSchema>;