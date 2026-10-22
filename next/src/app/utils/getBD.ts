import { api } from "@/src/lib/api";
import { Note } from "@/src/schemas/types/note";
import { Tag } from "@/src/schemas/types/tag";

export async function getTags(): Promise<Tag[]> {
    try {
        const data = await api('/tags')

        return data?.tags || []
    } catch(err: unknown){

        console.error('Erro ao obter tags:', err);
        return [];
    }
}

export async function getNotes(): Promise<Note[]> {
    try {
        const data = await api('/notes')

        return data?.notes || []
    } catch(err: unknown){

        console.error('Erro ao obter notes:', err);
        return [];
    }
}