'use client'

import { useEditNotes } from "@/src/app/hooks/dashboard/notes/useEditNotes"
import { Tag } from "@/src/schemas/types/tag"
import { Dispatch, SetStateAction } from "react"
import { Note } from "@/src/schemas/types/note"
import ViewNoteComponent from "./ViewNoteComponent"

interface OpenNoteProps {
    tags: Tag[],
    openNote: Note | null
    setOpenNote: Dispatch<SetStateAction<Note | null>>,
    setNotes: Dispatch<SetStateAction<Note[]>>
}

export default function OpenNote({openNote, setOpenNote, tags, setNotes} : OpenNoteProps) {
    
        const editHook = useEditNotes({note: openNote, setOpenNote, setNotes})
    
        return(
            <ViewNoteComponent 
                onClose={() => setOpenNote(null)} submitLabel="Guardar" tags={tags}
                form={editHook} initialData={openNote}
            />
        )
}