import bcrypt from 'bcryptjs'

export async function compare(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash)
    } catch(err) {
        console.log(err)
        return false
    }
}

export async function hash(password: string) {
    try {
        return await bcrypt.hash(password, 10)
    } catch(err) {
        console.log(err)
        throw new Error('Erro ao gerar hash da password')
    }
}