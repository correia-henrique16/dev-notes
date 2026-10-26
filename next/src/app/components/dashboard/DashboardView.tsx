'use client'

import { Note } from "@/src/schemas/types/note"
import { Tag } from "@/src/schemas/types/tag"
import { UserTokenPayload } from "../../utils/getUser"
import { useTags } from "../../hooks/dashboard/useTags"
import { useNotes } from "../../hooks/dashboard/notes/useNotes"
import { useNotesPublic } from "../../hooks/dashboard/notes/useNotesPublic"
import { useNotesCollab } from "../../hooks/dashboard/notes/useNotesCollab"
import TagsComponent from "./tags/Tags"
import NoteComponent from "./notes/Note"
import JanelasComponent from "./Janelas"
import OpenNoteComponent from "./notes/OpenNote"
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
  const notesPublicHooks = useNotesPublic()
  const notesCollabHooks = useNotesCollab()

  const { tags, setShowNewTag, showNewTag } = tagsHooks
  const { notes, showNewNote, setShowNewNote, showNotes, setOpenNote, openNote } = notesHooks
  const { notesPublic, loadingPublic, showPublicNotes } = notesPublicHooks
  const { notesCollab, loadingCollab, showCollabNotes } = notesCollabHooks

  let selectedNotes: Note[] = notes

  if (showNotes) selectedNotes = notes
  if (showPublicNotes) selectedNotes = notesPublic
  if (showCollabNotes) selectedNotes = notesCollab


  return (
    <div className="w-full h-full flex flex-col">

      <JanelasComponent notesPublicHooks={notesPublicHooks} notesHooks={notesHooks} notesCollabHooks={notesCollabHooks}/>

      {/* Contentor Principal */}
      <section className="w-full border-t border-zinc-700/80 pt-5 flex flex-col gap-6">
        
        {/* Barra de Ações Alinhada à Direita */}
        <div className="flex items-center justify-end px-3">
          <TagsComponent tags={tags} setShowNewTag={setShowNewTag}/>
        </div>

        {loadingPublic || loadingCollab ? 
          <p>Loadinggg</p>
        :
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3">
            {selectedNotes.map((note) => (
              <button
                key={note.id} onClick={() => setOpenNote(note)}
              >
                <NoteComponent note={note}/>
              </button>
            ))}
          </div>
        }

        {openNote && <OpenNoteComponent notesHook={notesHooks} tags={tags}/>}
        

        <button onClick={() => setShowNewNote(true)}>
          +
        </button>

      </section>

      {showNewTag && <NewTag setShowNewTag={setShowNewTag} tagsHook={tagsHooks} />}
      {showNewNote && <NewNote setShowNewNote={setShowNewNote} notesHook={notesHooks} tags={tags} />}
      
    </div>
  )
}