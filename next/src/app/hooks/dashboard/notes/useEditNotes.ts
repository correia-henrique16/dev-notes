/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { createNoteSchema } from "@/src/schemas/note.schema";
import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";
import { Dispatch, SetStateAction } from "react";
import { NoteFormErrors } from "@/src/schemas/errors/formErrors";

interface EditNoteProps {
    note: Note | null,
    setOpenNote: Dispatch<SetStateAction<Note | null>>,
    onSaveSuccess: (note: Note) => void
}

export function useEditNotes({note, setOpenNote, onSaveSuccess}: EditNoteProps) {

    const initialTagIds = note?.notesTags.map(noteTag => noteTag.tagId)

    const [formData, setFormData] = useState({
        title: note?.title,
        content: note?.content,
        tagIds: initialTagIds,
        isPublic: note?.isPublic,
        publicPermission: note?.publicPermission,
        collabs: note?.collabs,
    }) 

    
    const [showPublicPerm, setShowPublicPerm] = useState<boolean>(Boolean(note?.isPublic))

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

        const rawCollabs = formData.get('collabs')
        const collabs = rawCollabs ? JSON.parse(rawCollabs as string) : []

        const data ={
            ... Object.fromEntries(formData.entries()),
            isPublic,
            tagIds: rawTags.length > 0 ? rawTags : undefined,
            collabs
        } 
        
        const validacao = createNoteSchema.safeParse(data)

        if (!validacao.success) {
            setErrors(validacao.error.format());
            setLoading(false)
            return
        }

        try {
            const response = await api(`/notes/${note?.id}`, {
                method: 'PUT',
                body: JSON.stringify(validacao.data)
            }) as {note: Note; noteId: number}

            const updatedNote = {
                ...response.note,
                id: response.noteId
            }

            onSaveSuccess(updatedNote)
            
            setShowPublicPerm(false)
            setOpenNote(null)
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
        showPublicPerm, setShowPublicPerm,
        formData,
        errors,
        loading,
        serverError,
        handleSubmit
    }
}