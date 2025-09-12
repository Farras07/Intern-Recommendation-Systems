import { role } from './UserTypes'

export type SessionUserData = {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: keyof typeof role 
}
