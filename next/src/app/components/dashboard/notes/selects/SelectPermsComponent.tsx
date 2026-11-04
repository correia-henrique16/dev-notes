import { Note } from "@/src/schemas/types/note"
import { Permission } from "@/src/schemas/note.schema"
import { Dispatch, SetStateAction } from "react"

interface SelectPerms {
    isOwner: boolean,
    initialData?: Note | null,
    showPublicPerm: boolean,
    setShowPublicPerm: Dispatch<SetStateAction<boolean>>
    userId?: string
}

export default function SelectPermsComponent({isOwner, initialData, showPublicPerm, setShowPublicPerm, userId}: SelectPerms) {

    const userCollab = initialData?.collabs?.find((collab) => collab.collaburator === userId)
    const isCollab = Boolean(userCollab)

    if (isOwner) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="privacidade-select"
            className="text-xs font-bold text-mid2 uppercase tracking-wider"
          >
            Visibilidade
          </label>
          <select
            name="isPublic"
            id="privacidade-select"
            defaultValue={String(Boolean(initialData?.isPublic))}
            onChange={(e) => setShowPublicPerm(e.target.value === "true")}
            className="w-full px-3 py-2 rounded-xl bg-black/25 border border-border-light text-lighter text-xs font-medium focus:outline-none focus:border-lighter/60 cursor-pointer"
          >
            <option value="false" className="bg-darker">Privada</option>
            <option value="true" className="bg-darker">Pública</option>
          </select>
        </div>

        {showPublicPerm && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="public-perm-select"
              className="text-xs font-bold text-mid2 uppercase tracking-wider"
            >
              Permissão Pública
            </label>
            <select
              name="publicPermission"
              id="public-perm-select"
              defaultValue={initialData?.publicPermission || Permission.READONLY}
              className="w-full px-3 py-2 rounded-xl bg-black/25 border border-border-light text-lighter text-xs font-medium focus:outline-none focus:border-lighter/60 cursor-pointer"
            >
              <option value={Permission.READONLY} className="bg-darker">Leitor</option>
              <option value={Permission.EDITOR} className="bg-darker">Editor</option>
            </select>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {initialData?.isPublic && (
        <span className="px-2.5 py-1 rounded-lg border border-border-light bg-black/20 text-lighter">
          Pública ({initialData.publicPermission})
        </span>
      )}
      {isCollab && (
        <span className="px-2.5 py-1 rounded-lg border border-border-light bg-black/20 text-lighter">
          Colaborador ({userCollab?.permission})
        </span>
      )}
    </div>
  )
}