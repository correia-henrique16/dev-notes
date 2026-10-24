import { Note } from "@/src/schemas/types/note"

interface NoteProps {
    note: Note
}

export default function NoteComponent({note}: NoteProps) {
    return(
        <>
        <div className="border-b border-zinc-850 px-3.5 py-2.5 bg-zinc-800/20 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-200 group-hover:text-white truncate text-xs">
                {note.title}
            </h3>
        </div>

        <div className="p-3.5 text-xs text-zinc-400 group-hover:text-zinc-300 flex-1 leading-relaxed">
            <p className="line-clamp-4">
                {note.content}
            </p>
        </div>
        </>
    )
}