import { UserTokenPayload } from "../../../utils/getUser"
import { Dispatch, SetStateAction } from "react"
import { useEditProfile } from "@/src/app/hooks/auth/useEditProfile"

interface ProfileComponent {
    user: UserTokenPayload | null
    setShowProfileModal: Dispatch<SetStateAction<boolean>>
    showProfileModal: boolean
}
export default function ProfileModal({user, setShowProfileModal, showProfileModal}: ProfileComponent) {

    const { errors, formData, handleSubmit, loading, serverError } = useEditProfile({user, setShowProfileModal})

    const listaErros = [
        ...(errors?.name?._errors || []),
        ...(errors?.userName?._errors || []),
        ...(serverError ? [serverError] : [])
    ]

    return(
        <section className="flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 w-1/3">
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="name-input"
                    className="text-xs font-bold text-castanho uppercase tracking-wider">
                        Nome
                    </label>
                    <input type="text" name='name' id="name-input" defaultValue={formData.name}
                    className="authInput"
                    />
                    
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="userName-input"
                    className="text-xs font-bold text-castanho uppercase tracking-wider">
                        UserName
                    </label>
                    <input type="text" name='userName' id="userName-input" defaultValue={formData.userName}
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
                    {loading ? 'A carregar...' : 'Editar'}
                </button>

            </form>
        </section>
    )
}