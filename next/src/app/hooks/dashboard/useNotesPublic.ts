import { useState, useEffect } from "react";
import { getNotesPublic } from "../../utils/getBD";
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

    return {
        notesPublic,
        showPublicNotes, setShowPublicNotes,
        loadingPublic
    }
}