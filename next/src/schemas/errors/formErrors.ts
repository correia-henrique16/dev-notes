export interface NoteFormErrors {
    title?: { _errors?: string[] }
    content?: { _errors?: string[] }
    tagIds?: { _errors?: string[] }
    isPublic?: { _errors?: string[] }
    publicPermission?: { _errors?: string[] }
    collabs?: { _errors?: string[] }
}

export interface TagFormErrors {
  name?: { _errors?: string[] }
  color?: { _errors?: string[] }
}