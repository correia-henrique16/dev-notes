import { UserTokenPayload } from "../../../utils/getUser"
import { useState } from "react"
import { api } from "@/src/lib/api"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"

interface ProfileComponent {
    user: UserTokenPayload | null
    setShowProfileModal: Dispatch<SetStateAction<boolean>>
}

export default function ProfileComponent({user, setShowProfileModal}: ProfileComponent) {
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await api('/logout', {
                method: 'POST'
            })
            router.push('/')
            router.refresh()
            
        } catch(err) {
            console.error('Erro ao terminar sessão: ', err)
        }
    }   

    return(
        <section className="flex flex-col">
            {isClicked && 
                <>
                <button onClick={() => setShowProfileModal(true)}>Editar Perfil</button>
                <button onClick={() => handleLogout()}>Logout</button>
                </>
            }

            <button onClick={() => setIsClicked(!isClicked)}>
                {user?.userName}
            </button>
        </section>
        
    )
}