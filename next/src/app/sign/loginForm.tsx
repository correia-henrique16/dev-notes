'use client'

import { useLogin } from "@/src/hooks/auth/useLogin"

export default function LoginForm() {
    const {errors, loading, serverError, handleSubmit } = useLogin()

    const listaErros = [
        ...(errors?.userName?._errors || []),
        ...(errors?.password?._errors || []),
        ...(serverError ? [serverError] : [])
    ]

    return(
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
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

            <div> 
                {listaErros.length > 0 && (
                <p className="text-red-500 text-sm font-medium">
                    {listaErros[0]} {/* Mostra apenas o primeiro erro da lista */}
                </p>
                )}
            </div>

            <button type="submit" disabled={loading}
             className="authBtn">
                {loading ? 'A carregar...' : 'Entrar'}
            </button>


        </form>
    )
}