import { getUser } from "../../utils/getUser"
import { getNotesUser, getTags } from "../../utils/getBD"
import { DashboardView } from "./DashboardView"
import Image from "next/image"

export async function DashboardContent() {
    const user = await getUser()
    const tags = await getTags()
    const notes = await getNotesUser()

    return (
      <div className="w-full flex flex-col flex-1 items-center">

        <div className="flex items-center justify-center gap-7 mb-5">

          <Image alt="DevNotes" src="/logo.png" width={64} height={64} priority className="w-10 h-10 md:w-15 md:h-15 shrink-0 select-none"/>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-lighter tracking-tight text-center">
            As tuas DevNotes <span className="text-mid2 font-light">-</span> {user?.name}
          </h1>

        </div>
        

        <DashboardView 
          user={user} 
          initialTags={tags} 
          initialNotes={notes} 
        />
      </div>
    )
}