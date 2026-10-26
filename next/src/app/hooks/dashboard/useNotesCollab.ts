import { useState, useEffect } from "react";
import { getNotesCollab } from "../../utils/getBD";
import { Note } from "@/src/schemas/types/note";

export function useNotesCollab() {

    const [notesCollab, setNotesCollab] = useState<Note[]>([])
    const [showCollabNotes, setShowCollabNotes] = useState<boolean>(false)

    const [dataFetched, setDataFetched] = useState<boolean>(false)

    const [loadingCollab, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if(showCollabNotes && !dataFetched) {
            const fetch = async () => {
                setLoading(true)

                const data = await getNotesCollab()
                setNotesCollab(data)
                
                setLoading(false)
                setDataFetched(true)
            }

            fetch()
        }
    }, [showCollabNotes, dataFetched])

    return {
        notesCollab,
        showCollabNotes, setShowCollabNotes,
        loadingCollab
    }
}