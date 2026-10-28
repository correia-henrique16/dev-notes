import { Note } from "@/src/schemas/types/note"
import { Permission } from "@/src/schemas/note.schema"
import { Dispatch, SetStateAction } from "react"

interface SelectPerms {
    isOwner: boolean,
    initialData?: Note | null,
    showPublicPerm: boolean,
    setShowPublicPerm: Dispatch<SetStateAction<boolean>>
    userId?: string
}

export default function SelectPermsComponent({isOwner, initialData, showPublicPerm, setShowPublicPerm, userId}: SelectPerms) {

    const userCollab = initialData?.collabs?.find((collab) => collab.collaburator === userId)
    const isCollab = Boolean(userCollab)

    if (isOwner) {
        return(
            <>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="privacidade-select">Privacidade</label>

                <select name="isPublic" id="privacidade-select" defaultValue={String(Boolean(initialData?.isPublic))}
                    onChange={(e) => setShowPublicPerm(e.target.value === 'true')}>
                    <option value="false">Private</option>
                    <option value="true">Public</option>
                </select>
            </div>
            
            {showPublicPerm && 
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="public-perm-select">showw</label>

                    <select name="publicPermission" id="public-perm-select" defaultValue={initialData?.publicPermission}>
                        <option value={Permission.READONLY}>Leitor</option>
                        <option value={Permission.EDITOR}>Editor</option>
                    </select>
                </div>
            }

            </>
        )
    } else {
        return(
            <div className="flex items-center gap-2 mb-2">
                {initialData?.isPublic && <span>Nota Pública, {initialData.publicPermission}</span>}
                {isCollab && <span>Collab, {userCollab?.permission}</span>}
            </div>
        )
    }
}