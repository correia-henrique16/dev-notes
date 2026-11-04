'use client'

import { useState } from 'react'
import { Note } from '@/src/schemas/types/note'
import { Permission } from '@/src/schemas/note.schema'

export interface CollabItem {
  userName: string
  permission: Permission
}

interface SelectCollabsProps {
  isOwner: boolean
  initialData?: Note | null
}

export default function SelectCollabsComponent({ isOwner, initialData }: SelectCollabsProps) {
    // Inicializa a lista a partir do initialData sem 'any'
    const [collabs, setCollabs] = useState<CollabItem[]>(() => {
        if (!initialData?.collabs) return []

        return initialData.collabs.map((c) => {
            // Se a query incluir a relação user: c.user.userName
            // Se tiver diretamente a propriedade userName ou apenas id
            const name = 'user' in c && typeof c.user === 'object' && c.user !== null && 'userName' in c.user
                ? String((c.user as { userName: string }).userName)
                : 'userName' in c && typeof c.userName === 'string'
                ? c.userName
                : ''

            return {
                userName: name,
                permission: c.permission as Permission
            }
        })
    })

    const [currentName, setCurrentName] = useState('')
    const [currentPerm, setCurrentPerm] = useState<Permission>(Permission.READONLY)

    // Se não for o dono, apenas mostra os badges informativos
    if (!isOwner) {
        if (!initialData?.collabs || initialData.collabs.length === 0) return null

        return (
            <div className="flex flex-col gap-1.5 w-full text-xs">
                <span className="text-xs font-bold text-mid2 uppercase tracking-wider">Colaboradores:</span>
                <div className="flex flex-wrap gap-1.5">
                {collabs.map((c, i) => (
                    <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-black/20 text-lighter border border-border-light"
                    >
                        {c.userName || 'Utilizador'} ({c.permission})
                    </span>
                ))}
                </div>
        </div>
        )
    }

    const handleAdd = () => {
        const trimmed = currentName.trim()
        if (!trimmed) return

        setCollabs(prev => [...prev, { userName: trimmed, permission: currentPerm }])
        setCurrentName('')
        setCurrentPerm(Permission.READONLY)
    }

    const handleRemove = (indexToRemove: number) => {
        setCollabs(prev => prev.filter((_, idx) => idx !== indexToRemove))
    }

    return (
        <div className="flex flex-col gap-2 w-full">
        <label className="text-xs font-bold text-mid2 uppercase tracking-wider">
            Colaboradores
        </label>

        <input
            type="hidden"
            name="collabs"
            value={JSON.stringify(collabs)}
        />

        <div className="flex gap-2">
            <input
            type="text"
            placeholder="Username..."
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
                }
            }}
            className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/25 border border-border-light text-lighter text-xs focus:outline-none focus:border-lighter/60"
            />

            <select
            value={currentPerm}
            onChange={(e) => setCurrentPerm(e.target.value as Permission)}
            className="bg-black/25 border border-border-light rounded-xl px-2 text-xs text-lighter focus:outline-none"
            >
            <option value={Permission.READONLY} className="bg-darker">Leitor</option>
            <option value={Permission.EDITOR} className="bg-darker">Editor</option>
            </select>

            <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-lighter text-darker rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
            +
            </button>
        </div>

        {collabs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 max-h-28 overflow-y-auto">
            {collabs.map((c, index) => (
                <span
                key={`${c.userName}-${index}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 border border-border-light text-xs text-lighter"
                >
                <span>{c.userName}</span>
                <span className="text-mid2 text-[10px]">({c.permission})</span>
                <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-lighter/40 hover:text-red-400 font-bold ml-0.5 cursor-pointer"
                >
                    ×
                </button>
                </span>
            ))}
            </div>
        )}
        </div>
    )
}