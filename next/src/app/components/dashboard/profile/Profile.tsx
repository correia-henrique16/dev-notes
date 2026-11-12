import { UserTokenPayload } from "../../../utils/getUser"
import { useState } from "react"
import { api } from "@/src/lib/api"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import userImg from "@/public/imgs/user-icon.png"
import Image from "next/image"

interface ProfileComponent {
    user: UserTokenPayload | null
    setShowProfileModal: Dispatch<SetStateAction<boolean>>
}

export default function ProfileComponent({setShowProfileModal}: ProfileComponent) {
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
        <section className="relative w-fit flex flex-col">
            {isClicked && (
                <div className="absolute bottom-full mb-3 left-0 w-44 rounded-xl border border-border-light bg-darker/95 backdrop-blur-md p-1.5 shadow-2xl flex flex-col gap-1 z-30">
                    <button 
                        type="button"
                        onClick={() => {
                        setShowProfileModal(true)
                        setIsClicked(false)
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-lighter rounded-lg hover:bg-white/10 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                    >
                        <span>Editar Perfil</span>
                    </button>

                    <div className="h-px bg-border-light/50 my-0.5" />

                    <button 
                        type="button"
                        onClick={() => handleLogout()}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 rounded-lg hover:bg-red-500/10 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            )}

            <button onClick={() => setIsClicked(!isClicked)} className="icon-action-btn p-1">
                <Image src={userImg} alt="User" className="w-fit h-fit"/>
            </button>
        </section>
        
    )
}