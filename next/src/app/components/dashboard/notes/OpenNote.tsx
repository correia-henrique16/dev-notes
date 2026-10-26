'use client'

import { useEditNotes } from "@/src/app/hooks/dashboard/notes/useEditNotes"
import { Tag } from "@/src/schemas/types/tag"
import { Permission } from "@/src/schemas/note.schema"
import { useNotes } from "@/src/app/hooks/dashboard/notes/useNotes"

interface OpenNoteProps {
    notesHook: ReturnType<typeof useNotes>,
    tags: Tag[]

}

export default function OpenNote({notesHook, tags} : OpenNoteProps) {
    
        const { openNote, setOpenNote } = notesHook
        const { errors, formData, handleSubmit, loading, serverError, setShowPublicPerm, showPublicPerm } = useEditNotes({note: openNote, setOpenNote})
    
        const listaErros = [
            ...(errors?.title?._errors || []),
            ...(errors?.content?._errors || []),
            ...(errors?.tagIds?._errors || []),
            ...(errors?.isPublic?._errors || []),
            ...(errors?.publicPermission?._errors || []),
            ...(errors?.collabs?._errors || []),
            ...(serverError ? [serverError] : [])
        ]
    
        return(
            <div>
                <button onClick={() => setOpenNote(null)}>
                    Fechar
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
                    <div className="flex flex-col gap-1 w-full">
                        <input type="text" name='title' placeholder="Title..." defaultValue={formData.title}
                            className="authInput"
                        />
                    </div>
        
                    <div className="flex flex-col gap-1 w-full">
                        <input type="text" name='content' placeholder="Content..." defaultValue={formData.content}
                            className="authInput"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <span>Selecionar Tags</span>

                        {tags.map((tag) => (
                            <label key={tag.id}>
                                <input type="checkbox" name="tagIds" value={tag.id}  defaultChecked={formData.tagIds?.includes(tag.id)} />
                                {tag.name}
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="privacidade-select">Privacidade</label>

                        <select name="isPublic" id="privacidade-select" defaultValue={String(Boolean(formData.isPublic))}
                         onChange={(e) => setShowPublicPerm(e.target.value === 'true')}>
                            <option value="false">Private</option>
                            <option value="true">Public</option>
                        </select>
                    </div>
                    
                    {showPublicPerm && 
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="public-perm-select">showw</label>

                            <select name="publicPermission" id="public-perm-select" defaultValue={formData.publicPermission}>
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
                        {loading ? 'A carregar...' : 'Guardar'}
                    </button>
        
        
                </form>

            </div>
            
        )
}