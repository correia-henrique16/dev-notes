'use client'

import { Note } from "@/src/schemas/types/note"
import { Tag } from "@/src/schemas/types/tag"
import { UserTokenPayload } from "../../utils/getUser"
import { useTags } from "../../hooks/dashboard/useTags"
import { useNotes } from "../../hooks/dashboard/useNotes"
import TagsComponent from "./tags/Tags"
import NoteComponent from "./notes/Note"
import JanelasComponent from "./Janelas"
import NewTag from "./tags/NewTag"
import NewNote from "./notes/NewNote"

interface DashboardViewProps {
  user: UserTokenPayload | null
  initialNotes: Note[]
  initialTags: Tag[]
}

export function DashboardView({ initialNotes, initialTags }: DashboardViewProps) {
  const tagsHooks = useTags(initialTags)
  const notesHooks = useNotes(initialNotes)

  const { tags, setShowNewTag, showNewTag } = tagsHooks
  const { notes, showNewNote, setShowNewNote } = notesHooks

  return (
    <div className="w-full h-full flex flex-col">

      <JanelasComponent />

      {/* 2. Contentor Principal */}
      <div className="w-full border-t border-zinc-700/80 pt-5 flex flex-col gap-6">
        
        {/* Barra de Ações Alinhada à Direita */}
        <div className="flex items-center justify-end px-3">
          <TagsComponent tags={tags} setShowNewTag={setShowNewTag}/>
        </div>

        {/* 3. Grelha de Notas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col border border-zinc-800 hover:border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-900/70 rounded-xl overflow-hidden min-h-36 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-pointer"
            >
              <NoteComponent note={note}/>
            </div>
          ))}
        </div>

        <button onClick={() => setShowNewNote(true)}>
          +
        </button>

      </div>

      {showNewTag && <NewTag setShowNewTag={setShowNewTag} tagsHook={tagsHooks} />}
      {showNewNote && <NewNote setShowNewNote={setShowNewNote} notesHook={notesHooks} tags={tags} />}
      
    </div>
  )
}