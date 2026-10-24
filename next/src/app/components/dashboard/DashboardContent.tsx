import { getUser } from "../../utils/getUser"
import { getNotes, getTags } from "../../utils/getBD"
import { DashboardView } from "./DashboardView"

export async function DashboardContent() {
    const user = await getUser()
    const tags = await getTags()
    const notes = await getNotes()

    return (
    <div className="w-full h-full bg-mid flex flex-col items-center">
      <h1 className="text-3xl font-bold text-lighter mb-8 text-center">
        As tuas Dev Notes - {user?.name}
      </h1>

      <DashboardView 
        user={user} 
        initialTags={tags} 
        initialNotes={notes} 
      />
    </div>
  )
}