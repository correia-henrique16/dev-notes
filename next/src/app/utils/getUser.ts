import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface UserTokenPayload {
  id: string
  userName: string,
  name: string
}

export async function getUser() {
    const cookieStorage = await cookies()
    const token = cookieStorage.get('token')?.value

    if (!token) return null

    try {
        // Descodifica o conteúdo do token sem bater na API
        const user = jwtDecode<UserTokenPayload>(token)
        return user
    } catch {
        return null
    }
}