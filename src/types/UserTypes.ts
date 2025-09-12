export enum role {
    'Admin',
    'Judges'
}
export type userData = {
    id: string
    name: string 
    email: string
    image: string
    role: keyof typeof role
}

