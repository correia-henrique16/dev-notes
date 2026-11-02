/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, SetStateAction, useState } from "react";
import { editProfileSchema } from "@/src/schemas/user.schema";
import { api } from "@/src/lib/api";
import { ProfileFormErrors } from "@/src/schemas/errors/formErrors";
import { UserTokenPayload } from "../../utils/getUser";
import { useRouter } from "next/navigation";

interface EditNoteProps {
    user: UserTokenPayload | null,
    setShowProfileModal: Dispatch<SetStateAction<boolean>>
}

export function useEditProfile({user, setShowProfileModal}: EditNoteProps) {

    const [formData, setFormData] = useState({
        name: user?.name ,
        userName: user?.userName
    }) 

    const router = useRouter()

    const [errors, setErrors] = useState<ProfileFormErrors>({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()
        setErrors({})
        setLoading(true)


        //Captura todos os dados do formulário automaticamente
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries()) 

        const validacao = editProfileSchema.safeParse(data)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }


        try {
            const response = await api(`/profile`, {
                method: 'PATCH',
                body: JSON.stringify(validacao.data)
            })
            
            setServerError('')
            router.refresh()
            setShowProfileModal(false)
            return true

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
                setServerError('Ocorreu um erro inesperado ao editar o perfil')
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