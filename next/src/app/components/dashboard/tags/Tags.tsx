import { Dispatch, SetStateAction, useState } from "react"
import { Tag } from "@/src/schemas/types/tag"

interface TagProps {
    tags: Tag[],
    setShowNewTag: Dispatch<SetStateAction<boolean>>,
    setFiltroTags: Dispatch<SetStateAction<Tag[]>>,
    filtroTags: Tag[]
}

export default function TagsComponent({tags, setShowNewTag, setFiltroTags, filtroTags}: TagProps) {

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false)

  const handleAddFiltro = (tag: Tag) => {
    if (filtroTags.includes(tag)) return

    // setFiltroTags([...filtroTags, tagId])
    const novoFiltro = [...filtroTags, tag]
    setFiltroTags(novoFiltro)
  }

  const handleRemoveFiltro = (tagRemove: Tag) => {
    const novoFiltro = filtroTags.filter(tag => tag !== tagRemove)
    setFiltroTags(novoFiltro)
  }

  return(
    <>

    <div className="flex flex-row gap-2.5 w-full items-center justify-end px-6 py-1">
      {filtroTags.map(tag => {
        const tagColor = tag.color || '#EDE6E3'
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleRemoveFiltro(tag)}
            className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold text-lighter cursor-pointer flex items-center gap-2 transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm"
            style={{
              borderColor: `${tagColor}99`,
              borderWidth: '1.5px',
              borderStyle: 'solid',
            }}
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ 
                backgroundColor: tagColor,
                color: tagColor 
              }} 
            />
            <span>{tag.name}</span>
            <span className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-0.5">✕</span>
          </button>
        )
      })}
    </div>


    <div className="relative group">
      <button
      type="button"
      onClick={() => setIsOpenMobile(prev => !prev)}
      className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-lighter text-xs md:text-sm font-bold tracking-wide transition-all duration-150 cursor-pointer shadow-sm hover:border-white/30">
        Tags
      </button>


      {/* Menu Dropdown que desliza para a esquerda ao dar HOVER */}
      <div className={`absolute right-full top-0 pr-2 z-30 ${isOpenMobile ? 'flex' : 'hidden md:group-hover:flex'}`}>
        <div className="w-48 max-h-56 overflow-y-auto bg-darker/95 backdrop-blur-md border border-panel-border rounded-xl p-1.5 shadow-2xl flex flex-col gap-1">
          <button onClick={() => {setShowNewTag(true); setIsOpenMobile(false)}}
            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-lighter/80 hover:text-lighter hover:bg-white/5 rounded-lg transition-colors border-b border-panel-border-subtle pb-2 mb-1 cursor-pointer flex items-center justify-between"
          >
              Nova tag
          </button>
          
          {tags.length === 0 ? (
            <span className="text-xs text-zinc-500 px-3 py-2 text-center">Sem tags criadas</span>
          ) : (
            tags.map((tag) => (
              <button onClick={() => handleAddFiltro(tag)}
                key={tag.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-all cursor-pointer"
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: tag.color }} 
                />
                <span className="truncate">{tag.name}</span>
              </button>
            ))
          )}

        </div>

      </div>
    </div>
    </>
    
  )
}