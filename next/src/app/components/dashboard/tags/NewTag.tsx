import { Dispatch, SetStateAction } from "react"
import { useTags } from "@/src/app/hooks/dashboard/useTags"

interface NewTagProps {
    setShowNewTag: Dispatch<SetStateAction<boolean>>,
    tagsHook: ReturnType<typeof useTags>

}

export default function NewTag({setShowNewTag, tagsHook} : NewTagProps) {
    
        const {errors, loading, serverError, handleSubmit } = tagsHook
    
        const listaErros = [
            ...(errors?.name?._errors || []),
            ...(errors?.color?._errors || []),
            ...(serverError ? [serverError] : [])
        ]
    
        return(
            <div>
            
                <button onClick={() => setShowNewTag(false)}>
                    Fechar
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="name-input"
                            className="text-xs font-bold text-castanho uppercase tracking-wider">
                            Tag name
                        </label>
                        <input type="text" name='name' id="name-input"
                            className="authInput"
                        />
                    </div>
        
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="color-input"
                            className="text-xs font-bold text-castanho uppercase tracking-wider">
                            Cor
                        </label>
                        <input type="text" name='color' id="color-input"
                            className="authInput"
                        />
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