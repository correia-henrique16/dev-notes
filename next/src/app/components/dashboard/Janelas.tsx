import { useNotesPublic } from "../../hooks/dashboard/notes/useNotesPublic"
import { useNotesCollab } from "../../hooks/dashboard/notes/useNotesCollab"
import { useNotes } from "../../hooks/dashboard/notes/useNotes"

interface JanelasProps {
    notesPublicHooks: ReturnType<typeof useNotesPublic>
    notesHooks: ReturnType<typeof useNotes>
    notesCollabHooks: ReturnType<typeof useNotesCollab>
}

export default function JanelasComponent({ notesPublicHooks, notesHooks, notesCollabHooks }: JanelasProps) {
    const { setShowPublicNotes, showPublicNotes } = notesPublicHooks
    const { setShowCollabNotes, showCollabNotes } = notesCollabHooks
    const { setShowNotes, showNotes } = notesHooks

    return (
        <div className="flex items-end pl-3 gap-1">

            <button
            type="button"
            onClick={() => { setShowPublicNotes(false); setShowNotes(true); setShowCollabNotes(false); }}
            className={`tab-base ${showNotes ? 'tab-active' : 'tab-inactive'}`}
            >
                <span className="inline-block skew-x-12">Minhas</span>
            </button>


            <button
            type="button"
            onClick={() => { setShowPublicNotes(false); setShowNotes(false); setShowCollabNotes(true); }}
            className={`tab-base ${showCollabNotes ? 'tab-active' : 'tab-inactive'}`}
            >
                <span className="inline-block skew-x-12">Collabs</span>
            </button>


            <button
            type="button"
            onClick={() => { setShowPublicNotes(true); setShowNotes(false); setShowCollabNotes(false); }}
            className={`tab-base ${showPublicNotes ? 'tab-active' : 'tab-inactive'}`}
            >
                <span className="inline-block skew-x-12">Publics</span>
            </button>
        </div>
    )
}