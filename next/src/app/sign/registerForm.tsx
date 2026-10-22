'use client'

import { useRegister } from "@/src/hooks/auth/useRegister"

export default function RegisterForm() {
    const {errors, loading, serverError, handleSubmit } = useRegister()

    const listaErros = [
        ...(errors?.name?._errors || []),
        ...(errors?.userName?._errors || []),
        ...(errors?.password?._errors || []),
        ...(errors?.confirmPassword?._errors || []),
        ...(serverError ? [serverError] : [])
    ]

    return(
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="name-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Nome
                </label>
                <input type="text" name='name' id="name-input"
                 className="authInput"
                />
                
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="userName-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    UserName
                </label>
                <input type="text" name='userName' id="userName-input"
                 className="authInput"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Password
                </label>
                <input type="password" name='password' id="password-input"
                 className="authInput"
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="confirm-input"
                 className="text-xs font-bold text-castanho uppercase tracking-wider">
                    Confirm Password
                </label>
                <input type="password" name='confirmPassword' id="confirm-input"
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
                {loading ? 'A carregar...' : 'Registar'}
            </button>

        </form>
    )
}