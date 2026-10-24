/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { createTagSchema } from "@/src/schemas/tag.schema";
import { api } from "@/src/lib/api";
import { Tag } from "@/src/schemas/types/tag";

interface FormErrors {
  name?: { _errors?: string[] }
  color?: { _errors?: string[] }
}

export function useTags(initialTags: Tag[]) {

    const [formData, setFormData] = useState({
        name: '',
        color: ''
    })

    const [tags, setTags] = useState<Tag[]>(initialTags)
    const [showNewTag, setShowNewTag] = useState<boolean>(false)

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

        
        const validacao = createTagSchema.safeParse(data)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            const response = await api('/tags', {
                method: 'POST',
                body: JSON.stringify(validacao.data)
            }) as {id: number}

            const tagId = response.id
            const newTag = {
                id: tagId,
                ...validacao.data
            }
            
            setTags([...tags, newTag])
            setShowNewTag(false)
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
                setServerError('Ocorreu um erro inesperado ao logar')
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        tags, setTags, showNewTag, setShowNewTag,
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}