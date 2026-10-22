'use client'

import { Note } from "@/src/schemas/types/note"
import { Tag } from "@/src/schemas/types/tag"
import { UserTokenPayload } from "../../utils/getUser"

interface DashboardViewProps {
    user: UserTokenPayload | null
    initialNotes: Note[]
    initialTags: Tag[]
}

export function DashboardView({user, initialNotes, initialTags}: DashboardViewProps) {

    return (
        <>
            
        </>
    )
}