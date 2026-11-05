// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function api(endpoint: string, init?: RequestInit) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // Se estiver no browser, usa o proxy do rewrite (/backend/...)
  // Se estiver no servidor do Next.js, vai direto ao Render usando o URL completo
  const url = typeof window === 'undefined' 
    ? `${API_URL}${path}` 
    : `/backend${path}`

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
      // Envia também o cookie nos headers para o Fastify reconhecer nativamente
      headers.set('Cookie', `token=${token}`)
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