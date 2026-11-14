import { Note } from "@/src/schemas/types/note"

interface NoteProps {
  note: Note
}

export default function NoteComponent({ note }: NoteProps) {
    const primaryTagColor = note.notesTags?.[0]?.tag?.color

    return (
        <div 
            className="note-card border group bg-card"
            style={{
                borderColor: primaryTagColor ? `${primaryTagColor}66` : 'rgba(237, 230, 227, 0.12)'
            }}
        >
            {/* Brilho primeira tag */}
            {primaryTagColor && (
                <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-35"
                    style={{
                        background: `radial-gradient(ellipse 90% 80% at 85% 15%, ${primaryTagColor} 0%, transparent 70%)`
                    }}
                />
            )}


            <div className="pb-2 mb-2">
                <h3 className="relative z-10 font-bold text-lighter text-base tracking-tight truncate group-hover:text-foreground">
                    {note.title || 'Sem título'}
                </h3>
            </div>


            <p className="relative z-10 text-xs md:text-sm text-lighter/85 group-hover:text-lighter/90 line-clamp-3 leading-relaxed flex-1 mt-2">
                {note.content ? note.content.replace(/<[^>]*>/g, ' ').trim() : 'Sem conteúdo...'}
            </p>


            {note.notesTags && note.notesTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-panel-border-subtle">
                {note.notesTags.map((nt) => {
                    const tagColor = nt.tag?.color || '#9D8E88'
                    return (
                        <span
                            key={nt.tagId}
                            className="tag-badge note-tag-pill text-lighter font-medium text-xs px-2.5 py-1 border"
                            style={{ "--tag-color": tagColor } as React.CSSProperties}
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0 border border-black/20"
                                style={{ backgroundColor: tagColor }}
                            />
                            {nt.tag?.name}
                        </span>
                    )
                })}
                </div>
            )}
        </div>
    )
}