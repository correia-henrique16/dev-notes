import { Tag } from "@/src/schemas/types/tag"

interface TagProps {
    tags: Tag[]
}

export default function TagsComponent({tags}: TagProps) {
    return(
          <div className="relative group">
            <button className="px-4 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-200 text-xs font-semibold tracking-wide hover:border-zinc-500 hover:bg-zinc-800 transition-all shadow-sm">
              tags
            </button>

            {/* Menu Dropdown que desliza para a esquerda ao dar HOVER */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 pr-3 hidden group-hover:flex z-30">
              <div className="w-52 max-h-60 overflow-y-auto bg-zinc-900/95 backdrop-blur-md border border-zinc-750 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 divide-y divide-zinc-850">
                {tags.length === 0 ? (
                  <span className="text-xs text-zinc-500 px-3 py-2 text-center">Sem tags criadas</span>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-all cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: tag.color || '#71717a' }}
                      />
                      <span className="truncate">{tag.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
    )
}