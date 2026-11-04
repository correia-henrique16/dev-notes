import { Note } from "@/src/schemas/types/note"

interface NoteProps {
  note: Note
}

export default function NoteComponent({ note }: NoteProps) {
    const primaryTagColor = note.notesTags?.[0]?.tag?.color

    return (
        <div 
            className="note-card border group"
            style={{
                backgroundColor: '#2d2c2e', // Ligeiramente mais escuro que o #363537 da janela
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
                <h3 className="relative z-10 font-bold text-lighter text-base tracking-tight truncate group-hover:text-white">
                    {note.title || 'Sem título'}
                </h3>
            </div>


            <p className="relative z-10 text-xs md:text-sm text-lighter/75 group-hover:text-lighter/90 line-clamp-3 leading-relaxed flex-1 mt-2">
                {note.content || 'Sem conteúdo...'}
            </p>


            {note.notesTags && note.notesTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-panel-border-subtle">
                {note.notesTags.map((nt) => {
                    const tagColor = nt.tag?.color || '#9D8E88'
                    return (
                        <span
                            key={nt.tagId}
                            className="tag-badge text-lighter font-medium text-xs px-2.5 py-1"
                            style={{
                                backgroundColor: `${tagColor}26`, // 15% opacidade
                                borderColor: `${tagColor}80`,     // borda bem nítida (50% opacidade)
                                borderWidth: '1px',
                                borderStyle: 'solid',
                            }}
                            >
                                <span 
                                    className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px] transition-all" 
                                    style={{ 
                                    backgroundColor: tagColor,
                                    color: tagColor // faz o glow do shadow projetar a cor real da tag
                                    }} 
                                />
                            <span className="truncate">{nt.tag?.name}</span>
                        </span>
                    )
                })}
                </div>
            )}
        </div>
    )
}