import { z } from "zod";

export const creteNoteSchema = z.object({
    title: z.string()
        .max(40, 'Máximo de 40 carateres no titulo')
        .optional(),

    content: z.string()
        .max(50000, 'Máximo de 50 000 carateres'),
    
    tagIds: z.array(z.number().int().positive('ID de tag inválido'))
        .optional()
})

export type typeCreateNote = z.infer<typeof creteNoteSchema>;