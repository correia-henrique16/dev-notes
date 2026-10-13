import { z } from "zod";

export const createTagSchema = z.object({
    name: z.string()
        .min(1, 'O nome não pode estar vazio')
        .max(15, 'Máximo de 15 carateres na tag'),

    color: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color") //Hexadecimal
})

export type typeCreateTag = z.infer<typeof createTagSchema>;