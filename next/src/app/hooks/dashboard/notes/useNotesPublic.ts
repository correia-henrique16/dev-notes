import { useState, useEffect } from "react";
import { getNotesPublic } from "../../../utils/getBD";
import { Note } from "@/src/schemas/types/note";

export function useNotesPublic() {

    const [notesPublic, setNotesPublic] = useState<Note[]>([])
    const [showPublicNotes, setShowPublicNotes] = useState<boolean>(false)

    const [dataFetched, setDataFetched] = useState<boolean>(false)

    const [loadingPublic, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(showPublicNotes && !dataFetched) {
            const fetch = async () => {
                setLoading(true)

                const data = await getNotesPublic()
                setNotesPublic(data)
                
                setLoading(false)
                setDataFetched(true)
            }

            fetch()
        }
    }, [showPublicNotes, dataFetched])

    const addPublicNote = (newNote: Note) => {
        if (newNote.isPublic) {
            setNotesPublic(prev => [newNote, ...prev])
        }
    }

    const removePublicNote = (noteId: number) => {
        setNotesPublic(prev => prev.filter(n => n.id !== noteId))
    }

    const updatePublicNote = (updatedNote: Note) => {
        setNotesPublic(prev => {
            const exists = prev.some(n => n.id === updatedNote.id)

            // Se continua ou passou a ser pública
            if (updatedNote.isPublic) {
                return exists
                    ? prev.map(n => n.id === updatedNote.id ? updatedNote : n)
                    : [updatedNote, ...prev]
            }

            // Se deixou de ser pública, remove da lista
            return prev.filter(n => n.id !== updatedNote.id)
        })
    }


    return {
        notesPublic, setNotesPublic, 
        updatePublicNote, addPublicNote, removePublicNote,
        showPublicNotes, setShowPublicNotes,
        loadingPublic
    }
}