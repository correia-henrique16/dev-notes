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
        <div className="flex flex-col gap-1 w-full text-xs">
            <span className="text-zinc-400 font-medium">Colaboradores:</span>
            <div className="flex flex-wrap gap-1.5">
            {collabs.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
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
        <label className="text-sm font-medium">Colaboradores</label>

        {/* Input oculto que o FormData apanha no submit */}
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
            className="authInput flex-1"
            />

            <select
            value={currentPerm}
            onChange={(e) => setCurrentPerm(e.target.value as Permission)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 text-sm"
            >
            <option value={Permission.READONLY}>Leitor</option>
            <option value={Permission.EDITOR}>Editor</option>
            </select>

            <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
            Adicionar
            </button>
        </div>

        {collabs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
            {collabs.map((c, index) => (
                <span
                key={`${c.userName}-${index}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs"
                >
                <span>{c.userName}</span>
                <span className="text-zinc-400 text-[10px]">({c.permission})</span>
                <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-400 hover:text-red-300 font-bold ml-1"
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