const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function api(endpoint: string, init?: RequestInit) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${API_URL}${path}`

    // Opções padrão para envio de JSON
    const headers = new Headers(init?.headers)
    if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
        ...init,
        headers,
        credentials: "include" // Essencial para envio e receção de cookies
    })

    // Converte a resposta em JSON
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw data || new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return data
}