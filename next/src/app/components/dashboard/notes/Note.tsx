import { Note } from "@/src/schemas/types/note"

interface NoteProps {
    note: Note
}

export default function NoteComponent({note}: NoteProps) {
    return(
        <div className="group flex flex-col border border-zinc-800 hover:border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden min-h-36 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-pointer">
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
        </div>
    )
}