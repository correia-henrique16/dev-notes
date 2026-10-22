'use client'

import { Note } from "@/src/schemas/types/note"
import { Tag } from "@/src/schemas/types/tag"
import { UserTokenPayload } from "../../utils/getUser"

interface DashboardViewProps {
  user: UserTokenPayload | null
  initialNotes: Note[]
  initialTags: Tag[]
}

export function DashboardView({ initialNotes, initialTags }: DashboardViewProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* 1. Abas Superiores Modernas com estilo arquivo */}
      <div className="flex items-end pl-3 gap-1">
        <button className="px-7 py-2.5 text-sm font-semibold border-t border-x border-zinc-700/80 rounded-t-lg -skew-x-12 bg-zinc-800/90 text-zinc-100 shadow-sm translate-y-px z-10 backdrop-blur-sm transition-all">
          <span className="inline-block skew-x-12">minhas</span>
        </button>

        <button className="px-7 py-2.5 text-sm font-medium border-t border-x border-zinc-800 rounded-t-lg -skew-x-12 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
          <span className="inline-block skew-x-12">collabs</span>
        </button>

        <button className="px-7 py-2.5 text-sm font-medium border-t border-x border-zinc-800 rounded-t-lg -skew-x-12 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all">
          <span className="inline-block skew-x-12">publics</span>
        </button>
      </div>

      {/* 2. Contentor Principal */}
      <div className="w-full border-t border-zinc-700/80 pt-5 flex flex-col gap-6">
        
        {/* Barra de Ações Alinhada à Direita */}
        <div className="flex items-center justify-end px-3">
          
          {/* Botão de Tags com Menu a abrir para a ESQUERDA */}
          <div className="relative group">
            <button className="px-4 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-200 text-xs font-semibold tracking-wide hover:border-zinc-500 hover:bg-zinc-800 transition-all shadow-sm">
              tags
            </button>

            {/* Menu Dropdown que desliza para a esquerda ao dar HOVER */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 pr-3 hidden group-hover:flex z-30">
              <div className="w-52 max-h-60 overflow-y-auto bg-zinc-900/95 backdrop-blur-md border border-zinc-750 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 divide-y divide-zinc-850">
                {initialTags.length === 0 ? (
                  <span className="text-xs text-zinc-500 px-3 py-2 text-center">Sem tags criadas</span>
                ) : (
                  initialTags.map((tag) => (
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
        </div>

        {/* 3. Grelha de Notas Moderna */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3">
          {initialNotes.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col border border-zinc-800 hover:border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden min-h-36 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-pointer"
            >
              {/* Cabeçalho do Card */}
              <div className="border-b border-zinc-850 px-3.5 py-2.5 bg-zinc-800/20 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-200 group-hover:text-white truncate text-xs">
                  {note.title}
                </h3>
              </div>

              {/* Corpo / Conteúdo Truncado */}
              <div className="p-3.5 text-xs text-zinc-400 group-hover:text-zinc-300 flex-1 leading-relaxed">
                <p className="line-clamp-4">
                  {note.content}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}