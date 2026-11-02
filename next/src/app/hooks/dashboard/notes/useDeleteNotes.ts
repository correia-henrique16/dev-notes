import { useState } from "react";
import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";
import { Dispatch, SetStateAction } from "react";

interface DeleteNoteProps {
    setOpenNote?: Dispatch<SetStateAction<Note | null>>,
    onSaveSuccess?: (noteId: number) => void
}

export function useDeleleNote({setOpenNote, onSaveSuccess}: DeleteNoteProps) {

    const [serverErrorDel, setServerError] = useState('')
    const [loadingDel, setLoading] = useState(false)

    const handleSubmitDel = async (e: React.SyntheticEvent, noteId: number) => {
        e.preventDefault()
        setLoading(true)

        try {
            await api(`/notes/${noteId}`, {
                method: 'DELETE'
            })

            setServerError('')
            setOpenNote?.(null)
            onSaveSuccess?.(noteId)
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
                setServerError('Ocorreu um erro inesperado ao apagar a nota')
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        loadingDel,
        serverErrorDel,
        handleSubmitDel
    }
}