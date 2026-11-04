import { Tag } from "@/src/schemas/types/tag"
import { Note } from "@/src/schemas/types/note"
import { Dispatch, SetStateAction } from "react"
import { NoteFormErrors } from "@/src/schemas/errors/formErrors"
import { useDeleleNote } from "@/src/app/hooks/dashboard/notes/useDeleteNotes"
import SelectTagComponent from "./selects/SelectTagComponent"
import SelectPermsComponent from "./selects/SelectPermsComponent"
import SelectCollabsComponent from "./selects/SelectCollabsComponent"
import { UserTokenPayload } from "@/src/app/utils/getUser"
import EditorComponent from "./EditorComponent"
import { Permission } from "@/src/schemas/note.schema"

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


    const userCollab = initialData?.collabs?.find((c) => c.collaburator === user?.id)
    const isCollabEditor = userCollab?.permission === Permission.EDITOR
    const isPublicEditor = Boolean(initialData?.isPublic && initialData?.publicPermission === Permission.EDITOR)


    const canEdit = !isEdit || isOwner || isCollabEditor || isPublicEditor

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
    
    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
            onClick={() => onClose()}
        >
            <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-darker border border-border-light rounded-2xl shadow-2xl flex flex-col text-lighter overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                <h2 className="text-base font-bold text-lighter">
                {isEdit ? "Editar Nota" : "Criar Nota"}
                </h2>
                <button
                type="button"
                onClick={() => onClose()}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lighter/60 hover:text-lighter hover:bg-white/10 transition-colors cursor-pointer text-sm"
                >
                ✕
                </button>
            </div>

            {/* Formulário com 2 colunas e rodapé integrado */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto">
                    {/* Coluna Esquerda: Espaço de escrita */}
                    <div className="flex flex-col flex-1 p-5 md:p-6 gap-4 min-h-80">
                        <input
                        type="text"
                        name="title"
                        placeholder="Título da nota..."
                        defaultValue={initialData?.title}
                        readOnly={!canEdit}
                        className="w-full bg-transparent text-xl md:text-2xl font-bold text-lighter placeholder:text-lighter/30 border-b border-border-light pb-2 focus:outline-none focus:border-lighter/60 transition-colors"
                        />

                        <EditorComponent initialContent={initialData?.content} canEdit={canEdit}/>
                    </div>

                    {/* Coluna Direita: Painel lateral de configurações */}
                    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border-light p-5 md:p-6 flex flex-col gap-5 bg-black/15 overflow-y-auto">
                        <SelectTagComponent initialData={initialData}
                        initialTagIds={initialTagIds}
                        isOwner={isOwner}
                        tags={tags}
                        />

                        <div className="border-t border-border-light/40" />

                        <SelectPermsComponent
                        isOwner={isOwner}
                        setShowPublicPerm={setShowPublicPerm}
                        showPublicPerm={showPublicPerm}
                        initialData={initialData}
                        userId={user?.id}
                        />

                        <div className="border-t border-border-light/40" />

                        <SelectCollabsComponent isOwner={isOwner} initialData={initialData} />
                    </div>
                </div>

                {/* Rodapé Fixo */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border-light bg-black/25">
                    <div className="flex-1">
                        {listaErros.length > 0 && (
                        <p className="text-red-400 text-xs font-medium truncate">
                            {listaErros[0]}
                        </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {(isEdit && isOwner) && (
                            <button
                                type="button"
                                disabled={loadingDel}
                                onClick={(e) => initialData?.id && handleSubmitDel?.(e, initialData.id)}
                                className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {loadingDel ? "A apagar..." : "Apagar"}
                            </button>
                        )}

                        {canEdit && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 rounded-xl bg-lighter text-darker text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                >
                                {loading ? "A processar..." : submitLabel}
                            </button>
                        )}
                        
                    </div>
                </div>
            </form>
            </div>
        </div>
    )
            
}