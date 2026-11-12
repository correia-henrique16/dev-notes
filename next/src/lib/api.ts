// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function api(endpoint: string, init?: RequestInit) {

    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = typeof window == 'undefined'
        ? `${API_URL}${path}` // no servidor do Next.js, precisa do link completo e não tem bloqueios de cookies do browser
        : `/api${path}` //no browser, usa /api/... que bate na Vercel e o next.config reencaminha para o backend, mantendo o cookie no mesmo domínio

    const headers = new Headers(init?.headers)
    if (init?.body && !headers.has('Content-Type') && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }

    // Se estiver a correr no SERVIDOR (Next.js Server Component)
    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }

    const response = await fetch(url, {
        ...init,
        headers,
        credentials: "include"
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw data || new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return data
}