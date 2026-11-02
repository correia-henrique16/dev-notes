/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, Dispatch, SetStateAction } from "react";
import { changePassSchema } from "@/src/schemas/user.schema";
import { api } from "@/src/lib/api";
import { UserTokenPayload } from "../../utils/getUser";
import { PasswordFormErrors } from "@/src/schemas/errors/formErrors";

interface ChangePassProps {
    setShowChangePass: Dispatch<SetStateAction<boolean>>
}

export function useChangePass({setShowChangePass}: ChangePassProps) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState<PasswordFormErrors>({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        //Captura todos os dados do formulário automaticamente
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        const { oldPassword, newPassword } = data

        if (oldPassword == newPassword) {
            setErrors((prev) => ({
                ...prev,
                newPassword: {
                _errors: ['A nova password tem que ser diferente da atual'],
                },
            }))
            
            setLoading(false)
            return
        }

        const { confirmPassword, ...dataToSend } = data

        if (dataToSend.newPassword !== confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: {
                _errors: ['As palavras-passe não coincidem'],
                },
            }))

            setLoading(false)
            return
        }

        
        const validacao = changePassSchema.safeParse(dataToSend)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            await api('/pass', {
                method: 'PATCH',
                body: JSON.stringify(validacao.data)
            })

            setServerError('')
            setShowChangePass(false)

        } catch (err: unknown) {

            console.log('chegouu')
            // 1. Servidor desligado / sem rede (TypeError do fetch)
            if (err instanceof TypeError) {
                setServerError('Não foi possível ligar ao servidor.')
                return
            }

            // 2. Erros enviados pelo Fastify (ex: { error: 'Email já registado' })
            const apiError = err as { error?: string; message?: string }
            const message = apiError?.error || apiError?.message || ''

            if (message) {
                setServerError(message)
            } else {
                setServerError('Ocorreu um erro inesperado ao alterar password')
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