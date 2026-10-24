import { Dispatch, SetStateAction } from "react"
import { useNotes } from "@/src/app/hooks/dashboard/useNotes"
import { Tag } from "@/src/schemas/types/tag"

interface NewNoteProps {
    setShowNewNote: Dispatch<SetStateAction<boolean>>,
    notesHook: ReturnType<typeof useNotes>,
    tags: Tag[]

}

export default function NewNote({setShowNewNote, notesHook, tags} : NewNoteProps) {
    
        const {errors, loading, serverError, handleSubmit } = notesHook
    
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