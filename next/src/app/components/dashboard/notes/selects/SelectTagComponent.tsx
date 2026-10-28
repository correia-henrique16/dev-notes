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
        return(
            <div className="flex flex-col gap-1 w-full">
                <span>Selecionar Tags</span>

                {tags.map((tag) => (
                    <label key={tag.id}>
                        <input type="checkbox" name="tagIds" value={tag.id}  defaultChecked={initialTagIds?.includes(tag.id)} />
                        {tag.name}
                    </label>
                ))}
            </div>
        )
    } else {
        return(
            <div className="flex gap-2">
                <span>Tags</span>

                {initialData?.notesTags?.map(({ tag }) => (
                    <span key={tag?.id} className="badge">
                        {tag?.name}
                        {tag?.color}
                    </span>
                ))}
            </div>
        )
    }
}