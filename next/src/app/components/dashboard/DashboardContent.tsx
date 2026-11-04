import { getUser } from "../../utils/getUser"
import { getNotesUser, getTags } from "../../utils/getBD"
import { DashboardView } from "./DashboardView"

export async function DashboardContent() {
    const user = await getUser()
    const tags = await getTags()
    const notes = await getNotesUser()

    return (
      <div className="w-full flex flex-col flex-1 items-center">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-lighter tracking-tight mb-5 text-center">
          As tuas Dev Notes <span className="text-mid2 font-light">-</span> {user?.name}
        </h1>

        <DashboardView 
          user={user} 
          initialTags={tags} 
          initialNotes={notes} 
        />
      </div>
    )
}