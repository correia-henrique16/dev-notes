import { Tag } from "@/src/schemas/types/tag"
import { Note } from "@/src/schemas/types/note"
import { Permission } from "@/src/schemas/note.schema"
import { Dispatch, SetStateAction } from "react"
import { NoteFormErrors } from "@/src/schemas/errors/formErrors"
import { useDeleleNote } from "@/src/app/hooks/dashboard/notes/useDeleteNotes"

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
    handleDelete?: (noteId: number) => void
}

export default function ViewNoteComponent({onClose, initialData, submitLabel, tags, form, isEdit, handleDelete} : ViewNoteComponentProps ) {

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

                <div className="flex flex-col gap-1 w-full">
                    <span>Selecionar Tags</span>

                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input type="checkbox" name="tagIds" value={tag.id}  defaultChecked={initialTagIds?.includes(tag.id)} />
                            {tag.name}
                        </label>
                    ))}
                </div>

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