import { Note } from "@/src/schemas/types/note"
import { Tag } from "@/src/schemas/types/tag"

interface SelectProps {
    isOwner: boolean,
    tags: Tag[],
    initialTagIds: number[],
    initialData?: Note | null
}

export default function SelectTagComponent({isOwner, tags, initialTagIds, initialData}: SelectProps) {

    if (isOwner) {
    return (
        <div className="flex flex-col gap-2 w-full">
        <span className="text-xs font-bold text-mid2 uppercase tracking-wider">Tags</span>

        {tags.length === 0 ? (
            <p className="text-xs text-lighter/40">Sem tags disponíveis.</p>
        ) : (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {tags.map((tag) => {
                    const tagColor = tag.color || "#EDE6E3"
                        return (
                        <label
                            key={tag.id}
                            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-light bg-black/20 text-xs text-lighter cursor-pointer select-none transition-all has-checked:border-lighter has-checked:bg-white/10"
                        >
                            <input
                            type="checkbox"
                            name="tagIds"
                            value={tag.id}
                            defaultChecked={initialTagIds?.includes(tag.id)}
                            className="sr-only"
                            />
                            <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: tagColor }}
                            />

                            <span className="truncate max-w-30">{tag.name}</span>
                        </label>
                    )
                })}
            </div>
        )}
        </div>
    )
    }

    return (
    <div className="flex flex-col gap-2 w-full">
        <span className="text-xs font-bold text-mid2 uppercase tracking-wider">Tags</span>
        <div className="flex flex-wrap gap-1.5">
        {initialData?.notesTags?.map(({ tag }) => {
            const tagColor = tag?.color || "#EDE6E3"
            return (
            <span
                key={tag?.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-border-light bg-black/20 text-xs text-lighter"
            >
                <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tagColor }}
                />
                <span>{tag?.name}</span>
            </span>
            )
        })}
        </div>
    </div>
    )
}