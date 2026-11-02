'use client'

import { useState } from "react"
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
import ViewNoteComponent from "./notes/ViewNoteComponent"
import NewTag from "./tags/NewTag"
import ProfileComponent from "./profile/Profile"
import ProfileModal from "./profile/ProfileModal"

interface DashboardViewProps {
  user: UserTokenPayload | null
  initialNotes: Note[]
  initialTags: Tag[]
}

export function DashboardView({user, initialNotes, initialTags }: DashboardViewProps) {
  const [filtroTags, setFiltroTags] = useState<Tag[]>([])
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false)

  const tagsHooks = useTags(initialTags)
  const notesPublicHooks = useNotesPublic()
  const notesCollabHooks = useNotesCollab()
  const notesHooks = useNotes({
    initialNotes,
    onNoteCreated: (newNote) => {
      notesPublicHooks.addPublicNote(newNote)
    }
  })

  const { tags, setShowNewTag, showNewTag } = tagsHooks
  const { notes, showNewNote, setShowNewNote, showNotes, setOpenNote, openNote, setNotes } = notesHooks
  const { notesPublic, loadingPublic, showPublicNotes } = notesPublicHooks
  const { notesCollab, loadingCollab, showCollabNotes } = notesCollabHooks

  const handleNoteDeleted = (noteId: number) => {
    notesHooks.removeNote(noteId)
    notesPublicHooks.removePublicNote(noteId)
    notesCollabHooks.removeCollabNote(noteId)
  }

  const handleNoteUpdated = (updatedNote: Note) => {
    notesHooks.updateNote(updatedNote)
    notesPublicHooks.updatePublicNote(updatedNote)
    notesCollabHooks.updateCollabNote(updatedNote)
  }

  let selectedNotes: Note[] = notes

  if (showNotes) selectedNotes = notes
  if (showPublicNotes) selectedNotes = notesPublic
  if (showCollabNotes) selectedNotes = notesCollab


  const notesFiltered = filtroTags.length == 0
    ? selectedNotes
    : selectedNotes.filter(note => note.notesTags.some(nt => filtroTags.some(ft => ft.id == nt.tagId)))


  return (
    <div className="w-full h-full flex flex-col">

      <JanelasComponent notesPublicHooks={notesPublicHooks} notesHooks={notesHooks} notesCollabHooks={notesCollabHooks}/>

      {/* Contentor Principal */}
      <section className="w-full border-t border-zinc-700/80 pt-5 flex flex-col gap-6">
        
        {/* Barra de Ações Alinhada à Direita */}
        <div className="flex items-center justify-end px-3">
          <TagsComponent tags={tags} setShowNewTag={setShowNewTag} setFiltroTags={setFiltroTags} filtroTags={filtroTags}/>
        </div>

        {loadingPublic || loadingCollab ? 
          <p>Loadinggg</p>
        :
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3">
            {notesFiltered.map((note) => (
              <button
                key={note.id} onClick={() => setOpenNote(note)}
              >
                <NoteComponent note={note}/>
              </button>
            ))}
          </div>
        }
        

        <button onClick={() => setShowNewNote(true)}>
          +
        </button>

      </section>

      {showNewTag && <NewTag setShowNewTag={setShowNewTag} tagsHook={tagsHooks} />}

      {showNewNote && <ViewNoteComponent
        onClose={() => setShowNewNote(false)} submitLabel="Criar" form={notesHooks} tags={tags} isEdit={false} isOwner={true} user={user}
      />}

      {openNote && <OpenNoteComponent
        openNote={openNote} setOpenNote={setOpenNote} tags={tags} setNotes={setNotes} onSaveSuccess={handleNoteUpdated} handleDelete={handleNoteDeleted}
        user={user}
      />}

      <ProfileComponent user={user} setShowProfileModal={setShowProfileModal}/>
      
      {showProfileModal && <ProfileModal user={user} setShowProfileModal={setShowProfileModal} />}

    </div>
  )
}