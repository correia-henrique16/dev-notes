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
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="old-password-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Password Atual
                </label>
                <input type="password" name='oldPassword' id="old-password-input" autoComplete="new-password"
                 className="authInput"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="new-password-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Nova Password
                </label>
                <input type="password" name='newPassword' id="new-password-input" autoComplete="new-password"
                 className="authInput"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="confirm-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Confirm Password
                </label>
                <input type="password" name='confirmPassword' id="confirm-input" autoComplete="new-password"
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
                {loading ? 'A carregar...' : 'Confirmar'}
            </button>

        </form>
    )
}