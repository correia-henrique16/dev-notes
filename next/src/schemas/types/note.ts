import { Tag } from "./tag"

export type PublicPermission = 'READONLY' | 'EDITOR'

export interface NoteTagRelation {
  tagId: number
  noteId: number
  tag?: Tag
}

export interface Collab {
    collabId: number
    noteId: number
    collaburator: string
    permission: PublicPermission
    note: Note
}

export interface Note {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
    ownerId: string
    isPublic: boolean
    publicPermission: PublicPermission
    notesTags: NoteTagRelation[]
    collabs: Collab[]
}