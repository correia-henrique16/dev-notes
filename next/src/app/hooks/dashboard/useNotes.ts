/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNoteSchema } from "@/src/schemas/note.schema";
import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";

interface FormErrors {
  title?: { _errors?: string[] }
  content?: { _errors?: string[] }
  tagIds?: { _errors?: string[] }
  isPublic?: { _errors?: string[] }
  publicPermission?: { _errors?: string[] }
  collabs?: { _errors?: string[] }
}

export function useNotes(initialNotes: Note[]) {
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tagIds: '',
        isPublic: '',
        publicPermission: '',
        collabs: '',
    })

    const [notes, setNotes] = useState<Note[]>(initialNotes)
    const [showNewNote, setShowNewNote] = useState<boolean>(false)

    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)


        //Captura todos os dados do formulário automaticamente
        const formData = new FormData(e.currentTarget)
        const data ={
            ... Object.fromEntries(formData.entries()),
            tagIds: formData.getAll('tagIds').map(Number)
        } 
        
        const validacao = createNoteSchema.safeParse(data)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            const response = await api('/notes', {
                method: 'POST',
                body: JSON.stringify(validacao.data)
            }) as {note: Note}

            const newNote = response.note
            
            setNotes([...notes, newNote])
            setShowNewNote(false)
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
                setServerError('Ocorreu um erro inesperado ao criar a nota')
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        notes, setNotes, showNewNote, setShowNewNote,
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}