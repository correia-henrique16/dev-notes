import jwt, {JwtPayload} from 'jsonwebtoken'

const JWT_SECRET = process.env.SECRET || ''

if (!JWT_SECRET) {
  throw new Error('A variável de ambiente SECRET não está definida!')
}

export function verifyJWT(token: string) {
    try{
        return jwt.verify(token, JWT_SECRET)
    } catch(err) {
        console.log(err)
        return null
    }
    
}

export function signJWT(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET)
}