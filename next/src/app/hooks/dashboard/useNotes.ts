/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/src/schemas/user.schema";
import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";

interface FormErrors {
  userName?: { _errors?: string[] }
  password?: { _errors?: string[] }
}

export function useNotes(initialNotes: Note[]) {
    const router = useRouter()

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    })

    const [notes, setNotes] = useState<Note[]>(initialNotes)

    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)


        //Captura todos os dados do formulário automaticamente
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        
        const validacao = loginSchema.safeParse(data)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            await api('/auth', {
                method: 'POST',
                body: JSON.stringify(validacao.data)
            })

            router.push('/dashboard')

        } catch (err: unknown) {
            // 1. Servidor desligado / sem rede (TypeError do fetch)
            if (err instanceof TypeError) {
                setServerError('Não foi possível ligar ao servidor.')
                return
            }

            // 2. Erros enviados pelo Fastify (ex: { error: 'Email já registado' })
            const apiError = err as { error?: string; message?: string }
            const message = apiError?.error || ''

            if (message) {
                setServerError(message)
            } else {
                setServerError('Ocorreu um erro inesperado ao logar')
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        notes, setNotes,
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}