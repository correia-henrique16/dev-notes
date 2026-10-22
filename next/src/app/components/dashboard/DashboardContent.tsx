import { getUser } from "../../utils/getUser"
import { getNotes, getTags } from "../../utils/getBD"
import { DashboardView } from "./DashboardView"

export async function DashboardContent() {
    const user = await getUser()
    const tags = await getTags()
    const notes = await getNotes()

    return (
        <>
        <h1 className="text-3xl font-bold text-lighter mb-6">
            As tuas Dev Notes - {user?.name}
        </h1>

        {console.log(notes)}
        {tags.map((tag) => (

            <div key={tag.id}>
                <p>user {tag.name}</p>
                <p>color {tag.color}</p>
                <p>id {tag.id}</p>
            </div>

        ))}

        <DashboardView user={user} initialTags={tags} initialNotes={notes} />
        </>
    )
}