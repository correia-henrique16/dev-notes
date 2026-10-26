import { Dispatch, SetStateAction } from "react"
import { useNotes } from "@/src/app/hooks/dashboard/notes/useNotes"
import { Tag } from "@/src/schemas/types/tag"
import { Permission } from "@/src/schemas/note.schema"

interface NewNoteProps {
    setShowNewNote: Dispatch<SetStateAction<boolean>>,
    notesHook: ReturnType<typeof useNotes>,
    tags: Tag[]

}

export default function NewNote({setShowNewNote, notesHook, tags} : NewNoteProps) {
    
        const {errors, loading, serverError, handleSubmit, setShowPublicPerm, showPublicPerm } = notesHook
    
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
            
                <button onClick={() => setShowNewNote(false)}>
                    Fechar
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
                    <div className="flex flex-col gap-1 w-full">
                        <input type="text" name='title' placeholder="Title..."
                            className="authInput"
                        />
                    </div>
        
                    <div className="flex flex-col gap-1 w-full">
                        <input type="text" name='content' placeholder="Content..."
                            className="authInput"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <span>Selecionar Tags</span>

                        {tags.map((tag) => (
                            <label key={tag.id}>
                                <input type="checkbox" name="tagIds" value={tag.id} />
                                {tag.name}
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="privacidade-select">Privacidade</label>

                        <select name="isPublic" id="privacidade-select" defaultValue="false"
                         onChange={(e) => setShowPublicPerm(e.target.value === 'true')}>
                            <option value="false">Private</option>
                            <option value="true">Public</option>
                        </select>
                    </div>
                    
                    {showPublicPerm && 
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="public-perm-select">showw</label>

                            <select name="publicPermission" id="public-perm-select" defaultValue={Permission.READONLY}>
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
                        {loading ? 'A carregar...' : 'Criar'}
                    </button>
        
        
                </form>

            </div>
            
        )
}