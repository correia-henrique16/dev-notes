/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/src/schemas/user.schema";
import { api } from "@/src/lib/api";

interface FormErrors {
  name?: { _errors?: string[] }
  userName?: { _errors?: string[] }
  password?: { _errors?: string[] }
  confirmPassword?: { _errors?: string[] }
}

export function useRegister() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        password: '',
        confirm: ''
    })

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

        const { confirmPassword, ...dataToSend } = data

        if (dataToSend.password !== confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: {
                _errors: ['As palavras-passe não coincidem'],
                },
            }))

            setLoading(false)
            return
        }

        
        const validacao = registerSchema.safeParse(dataToSend)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            await api('/signup', {
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
            const message = apiError?.error || apiError?.message || ''

            if (message.includes('User name already exists')) {
                setServerError('User name já existe')
            } else if (message) {
                setServerError(message)
            } else {
                setServerError('Ocorreu um erro inesperado ao registar')
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}