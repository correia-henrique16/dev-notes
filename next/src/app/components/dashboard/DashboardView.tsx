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
    <div className="w-full flex flex-col flex-1 min-h-0">

      <JanelasComponent 
        notesPublicHooks={notesPublicHooks} 
        notesHooks={notesHooks} 
        notesCollabHooks={notesCollabHooks}
      />

      {/* Janela central alinhada ao teu desenho */}
      <section className="relative w-full flex-1 bg-surface-light border-2 border-border-light rounded-b-2xl md:rounded-tr-2xl shadow-2xl flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-end px-4 py-3 border-b border-panel-border-subtle bg-black/15">
          <TagsComponent 
            tags={tags} 
            setShowNewTag={setShowNewTag} 
            setFiltroTags={setFiltroTags} 
            filtroTags={filtroTags}
          />
        </div>

        {/* Grelha com Scroll Vertical */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          {loadingPublic || loadingCollab ? (
            <p className="text-center text-lighter/50 animate-pulse text-xs py-8">A carregar...</p>
          ) : notesFiltered.length === 0 ? (
            <p className="text-center text-lighter/40 text-xs py-8">Sem notas a apresentar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {notesFiltered.map((note) => (
                <button
                  key={note.id} 
                  type="button"
                  onClick={() => setOpenNote(note)}
                  className="w-full text-left"
                >
                  <NoteComponent note={note} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé: Perfil à esquerda e "+" à direita */}
        <footer className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-surface-light via-surface-light/90 to-transparent flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <ProfileComponent user={user} setShowProfileModal={setShowProfileModal} />
          </div>

          <button 
            type="button"
            onClick={() => setShowNewNote(true)}
            className="pointer-events-auto icon-action-btn"
            title="Criar nova nota"
          >
            +
          </button>
        </footer>

      </section>


      {showNewTag && <NewTag setShowNewTag={setShowNewTag} tagsHook={tagsHooks} />}

      {showNewNote && (
        <ViewNoteComponent
          onClose={() => setShowNewNote(false)} 
          submitLabel="Criar" 
          form={notesHooks} 
          tags={tags} 
          isEdit={false} 
          isOwner={true} 
          user={user}
        />
      )}

      {openNote && (
        <OpenNoteComponent
          openNote={openNote} 
          setOpenNote={setOpenNote} 
          tags={tags} 
          setNotes={setNotes} 
          onSaveSuccess={handleNoteUpdated} 
          handleDelete={handleNoteDeleted}
          user={user}
        />
      )}

      {showProfileModal && (
        <ProfileModal user={user} setShowProfileModal={setShowProfileModal} />
      )}

    </div>
  )
}