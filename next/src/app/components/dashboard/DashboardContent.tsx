import { getUser } from "../../utils/getUser"
import { getTags } from "../../utils/getBD"

export async function DashboardContent() {
    const user = await getUser()
    const tags = await getTags()

    return (
        <>
        <h1 className="text-3xl font-bold text-lighter mb-6">
            As tuas Dev Notes - {user?.name}
        </h1>

        {console.log(tags)}

        {/* <DashboardView user={user} /> */}
        </>
    )
}