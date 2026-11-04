import { Dispatch, SetStateAction } from "react"
import { useChangePass } from "@/src/app/hooks/auth/useChangePass"

interface ProfileComponent {
    setShowChangePass: Dispatch<SetStateAction<boolean>>
}
export default function ChangePassForm({setShowChangePass}: ProfileComponent) {

    const { errors, handleSubmit, loading, serverError } = useChangePass({setShowChangePass})

    const listaErros = [
        ...(errors?.oldPassword?._errors || []),
        ...(errors?.newPassword?._errors || []),
        ...(errors?.confirmPassword?._errors || []),
        ...(serverError ? [serverError] : [])
    ]

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full">
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="old-password-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Password Atual
                </label>
                <input type="password" name='oldPassword' id="old-password-input" autoComplete="new-password"
                 className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="new-password-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Nova Password
                </label>
                <input type="password" name='newPassword' id="new-password-input" autoComplete="new-password"
                 className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="confirm-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Confirm Password
                </label>
                <input type="password" name='confirmPassword' id="confirm-input" autoComplete="new-password"
                 className="w-full px-3.5 py-2 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                />
            </div>

            <div>
                {listaErros.length > 0 && (
                <p className="text-red-500 text-sm font-medium">
                    {listaErros[0]} {/* Mostra apenas o primeiro erro da lista */}
                </p>
                )}
            </div>

            <div className="flex items-center gap-2 pt-2">
                <button 
                    type="button"
                    onClick={() => setShowChangePass(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-border-light text-lighter/80 font-bold text-xs hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                    Voltar
                </button>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-lighter text-darker font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'A carregar...' : 'Confirmar'}
                </button>
            </div>

        </form>
    )
}