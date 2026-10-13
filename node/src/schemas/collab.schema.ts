import { z } from "zod";

export const permissionSchema = z.enum(['READ', 'WRITE'])

export const addCollaboratorSchema = z.object({
    userName: z.string().min(1, 'O username do colaborador é obrigatório'),
    permission: permissionSchema.default('READ'),
})

export type typePermission = z.infer<typeof permissionSchema>;
export type typeAddColl = z.infer<typeof addCollaboratorSchema>;