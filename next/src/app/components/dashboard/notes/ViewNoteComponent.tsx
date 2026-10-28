import { Tag } from "@/src/schemas/types/tag"
import { Note } from "@/src/schemas/types/note"
import { Dispatch, SetStateAction } from "react"
import { NoteFormErrors } from "@/src/schemas/errors/formErrors"
import { useDeleleNote } from "@/src/app/hooks/dashboard/notes/useDeleteNotes"
import SelectTagComponent from "./selects/SelectTagComponent"
import SelectPermsComponent from "./selects/SelectPermsComponent"
import SelectCollabsComponent from "./selects/SelectCollabsComponent"
import { UserTokenPayload } from "@/src/app/utils/getUser"

interface ViewNoteComponentProps {
    initialData?: Note | null
    tags: Tag[]
    onClose: () => void
    submitLabel: string
    form: {
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
        loading: boolean
        errors?: NoteFormErrors | null
        serverError?: string | null
        showPublicPerm: boolean
        setShowPublicPerm: Dispatch<SetStateAction<boolean>>
    }
    isEdit: boolean,
    handleDelete?: (noteId: number) => void,
    isOwner: boolean,
    user: UserTokenPayload | null
}

export default function ViewNoteComponent({onClose, initialData, submitLabel, tags, form, isEdit, handleDelete, isOwner, user} : ViewNoteComponentProps ) {

    const { serverErrorDel, handleSubmitDel, loadingDel } = useDeleleNote({setOpenNote: onClose, onSaveSuccess: handleDelete})
    const { handleSubmit, loading, errors, serverError, setShowPublicPerm, showPublicPerm } = form //ou recebe o useNote, ou o useEditNote

    const initialTagIds = initialData?.notesTags?.map(noteTag => noteTag.tagId) ?? []

    const listaErros = [
        ...(errors?.title?._errors || []),
        ...(errors?.content?._errors || []),
        ...(errors?.tagIds?._errors || []),
        ...(errors?.isPublic?._errors || []),
        ...(errors?.publicPermission?._errors || []),
        ...(errors?.collabs?._errors || []),
        ...(serverError ? [serverError] : []),
        ...(serverErrorDel ? [serverErrorDel] : [])
    ]
    
    return(
        <div>
            <button onClick={() => onClose()}>
                Fechar
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
                <div className="flex flex-col gap-1 w-full">
                    <input type="text" name='title' placeholder="Title..." defaultValue={initialData?.title}
                        className="authInput"
                    />
                </div>
    
                <div className="flex flex-col gap-1 w-full">
                    <input type="text" name='content' placeholder="Content..." defaultValue={initialData?.content}
                        className="authInput"
                    />
                </div>




                <SelectTagComponent initialData={initialData} initialTagIds={initialTagIds} isOwner={isOwner} tags={tags} />


                <SelectPermsComponent isOwner={isOwner} setShowPublicPerm={setShowPublicPerm} showPublicPerm={showPublicPerm} initialData={initialData} userId={user?.id} />

                <SelectCollabsComponent isOwner={isOwner} initialData={initialData} />


    
                <div> 
                    {listaErros.length > 0 && (
                    <p className="text-red-500 text-sm font-medium">
                        {listaErros[0]} {/* Mostra apenas o primeiro erro da lista */}
                    </p>
                    )}
                </div>
    
                <button type="submit" disabled={loading}
                    className="authBtn">
                    {loading ? 'A carregar...' : submitLabel}
                </button>
                
                {isEdit && 
                    <button type="button" disabled={loadingDel} onClick={(e) => initialData?.id && handleSubmitDel?.(e, initialData.id)}>
                        {loadingDel ? 'A apagar...' : 'Apagar'}
                    </button>
                }

            </form>

        </div>
    )
            
}