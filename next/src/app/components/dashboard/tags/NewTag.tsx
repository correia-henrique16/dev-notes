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
    
        return (
            <div className="modal-backdrop" onClick={() => setShowNewTag(false)}>
                <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-border-light pb-3">
                        <h2 className="text-base font-bold text-lighter">Criar Tag</h2>
                        <button 
                            type="button" 
                            onClick={() => setShowNewTag(false)}
                            className="text-lighter/60 hover:text-lighter text-sm cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="name-input" className="text-xs font-bold text-mid2 uppercase tracking-wider">
                                Tag name
                            </label>
                            
                            <input 
                            type="text" 
                            name="name" 
                            id="name-input"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label htmlFor="color-input" className="text-xs font-bold text-mid2 uppercase tracking-wider">
                            Cor
                            </label>
                            <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                name="color" 
                                id="color-input"
                                defaultValue="#e9dddd"
                                className="w-10 h-10 rounded-xl border border-border-light bg-black/25 cursor-pointer p-1"
                            />
                            </div>
                        </div>

                        <div> 
                            {listaErros.length > 0 && (
                            <p className="text-red-400 text-xs font-medium">
                                {listaErros[0]} {/* Mostra apenas o primeiro erro da lista */}
                            </p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-2.5 mt-2 rounded-xl bg-lighter text-darker font-bold text-sm hover:opacity-90 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'A carregar...' : 'Criar'}
                        </button>
                    </form>
                </div>
            </div>
        )
}