import { UserTokenPayload } from "../../utils/getUser"
import { useState } from "react"
import { api } from "@/src/lib/api"
import { useRouter } from "next/navigation"

interface ProfileComponent {
    user: UserTokenPayload | null
}
export default function ProfileComponent({user}: ProfileComponent) {
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
                <button>Ver Perfil</button>
                <button onClick={() => handleLogout()}>Logout</button>
                </>
            }

            <button onClick={() => setIsClicked(!isClicked)}>
                {user?.userName}
            </button>
        </section>
        
    )
}