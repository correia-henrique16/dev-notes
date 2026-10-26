/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { createNoteSchema } from "@/src/schemas/note.schema";
import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";
import { NoteFormErrors } from "@/src/schemas/errors/formErrors";

export function useNotes(initialNotes: Note[]) {

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tagIds: '',
        isPublic: '',
        publicPermission: '',
        collabs: '',
    })

    const [showNotes, setShowNotes] = useState<boolean>(false)
    const [notes, setNotes] = useState<Note[]>(initialNotes)
    const [showNewNote, setShowNewNote] = useState<boolean>(false)

    const [showPublicPerm, setShowPublicPerm] = useState<boolean>(false)

    const [openNote, setOpenNote] = useState<Note | null>(null)

    const [errors, setErrors] = useState<NoteFormErrors>({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)


        //Captura todos os dados do formulário automaticamente
        const formData = new FormData(e.currentTarget)

        const isPublic = formData.get('isPublic') === 'true' //o isPublic fica true se vier isso na string, senao fica false
        const rawTags = formData.getAll('tagIds').map(Number)

        const data ={
            ... Object.fromEntries(formData.entries()),
            isPublic,
            tagIds: rawTags.length > 0 ? rawTags : undefined //para o zod do backend ler q veio undefined e atribuir o defaultValue
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
            setShowPublicPerm(false)
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
        showPublicPerm, setShowPublicPerm,
        showNotes, setShowNotes,
        openNote, setOpenNote,
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}