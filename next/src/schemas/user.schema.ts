import {z} from 'zod'

export const loginSchema = z.object({
  userName: z.string().min(1, 'O userName é obrigatório'),
  password: z.string().min(1, 'A password é obrigatória')
});

export const registerSchema = loginSchema.extend({
    name: z.string()
        .min(2, "Minimo de 2 caratéres no nome")
        .max(30, "Máximo de 30 caratéres no nome"),

    userName: z.string()
        .min(1, 'O userName é obrigatório')
        .max(30, 'Máximo de 30 caratéres'),

    password: z.string()
        .min(8, "A password deve ter pelo menos 8 caracteres")
        .refine((value) => /[A-Z]/.test(value), {
        message: "A password deve conter pelo menos uma letra maiúscula",
        })
        .refine((value) => /[a-z]/.test(value), {
        message: "A password deve conter pelo menos uma letra minúscula",
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "A password deve conter pelo menos um carater especial (!@#$...)",
        }),

});

export const editProfileSchema = z.object({
    name: z.string()
        .min(2, "Minimo de 2 caratéres no nome")
        .max(30, "Máximo de 30 caratéres no nome"),

    userName: z.string()
        .min(1, 'O userName é obrigatório')
        .max(30, 'Máximo de 30 caratéres'),
    
})

export const changePassSchema = z.object({
    password: z.string()
        .min(8, "A password deve ter pelo menos 8 caracteres")
        .refine((value) => /[A-Z]/.test(value), {
        message: "A password deve conter pelo menos uma letra maiúscula",
        })
        .refine((value) => /[a-z]/.test(value), {
        message: "A password deve conter pelo menos uma letra minúscula",
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "A password deve conter pelo menos um carater especial (!@#$...)",
        }),
})

export type typeLogin = z.infer<typeof loginSchema>;
export type typeRegister = z.infer<typeof registerSchema>;
export type typeEditProfile = z.infer<typeof editProfileSchema>;
export type typeChangePass = z.infer<typeof changePassSchema>;