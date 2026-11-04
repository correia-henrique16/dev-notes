import { UserTokenPayload } from "../../../utils/getUser"
import { Dispatch, SetStateAction, useState } from "react"
import { useEditProfile } from "@/src/app/hooks/auth/useEditProfile"
import ChangePassForm from "./ChangePassForm"

interface ProfileComponent {
    user: UserTokenPayload | null
    setShowProfileModal: Dispatch<SetStateAction<boolean>>
}
export default function ProfileModal({user, setShowProfileModal}: ProfileComponent) {

    const { errors, formData, handleSubmit, loading, serverError } = useEditProfile({user, setShowProfileModal})
    const [showChangePass, setShowChangePass] = useState<boolean>(false)

    const listaErros = [
        ...(errors?.name?._errors || []),
        ...(errors?.userName?._errors || []),
        ...(serverError ? [serverError] : [])
    ]

    return(
        <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
        >
            <div 
                className="relative w-full max-w-md bg-darker border border-border-light rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-lighter"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b border-border-light pb-3">
                    <h2 className="text-base font-bold text-lighter">
                        {showChangePass ? "Alterar Password" : "Editar Perfil"}
                    </h2>
                    <button 
                        type="button" 
                        onClick={() => setShowProfileModal(false)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lighter/60 hover:text-lighter hover:bg-white/10 transition-colors cursor-pointer text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Alternância de Ecrãs */}
                {!showChangePass ? (
                    <>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        {/* Inputs de name e userName aqui dentro */}
                        <div className="flex flex-col gap-1 w-full">

                            <label htmlFor="name-input"
                                className="text-xs font-bold text-castanho uppercase tracking-wider"
                            >
                                Nome
                            </label>

                            <input type="text" name='name' id="name-input" defaultValue={formData.name}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">

                            <label htmlFor="userName-input"
                                className="text-xs font-bold text-castanho uppercase tracking-wider"
                            >
                                UserName
                            </label>

                            <input type="text" name='userName' id="userName-input" defaultValue={formData.userName}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/25 border border-border-light text-lighter text-sm focus:outline-none focus:border-lighter/60"
                            />
                        </div>

                        {listaErros.length > 0 && (
                            <p className="text-red-400 text-xs font-medium">
                            {listaErros[0]}
                            </p>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-lighter text-darker font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'A carregar...' : 'Guardar Alterações'}
                        </button>
                    </form>

                    <div className="border-t border-border-light/40 pt-2 flex justify-center">
                    <button 
                        type="button"
                        onClick={() => setShowChangePass(true)}
                        className="text-xs text-lighter/60 hover:text-lighter transition-colors cursor-pointer"
                    >
                        Queres alterar a tua password?
                    </button>
                    </div>
                    </>
                ) : (
                <ChangePassForm setShowChangePass={setShowChangePass} />
                )}
            </div>
        </div>
    )
}