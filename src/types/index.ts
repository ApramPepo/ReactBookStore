export interface User {
    id: string
    username: string
    email: string
    role: 'CUSTOMER' | 'ADMIN'
}

export interface Book {
    id: string
    name: string
    author: string
    pages: number
    description: string
}

export interface AuthResponse {
    token: string
}

export interface UserResponse {
    id: string
    username: string
    email: string
    role: string
}

export interface BookResponse {
    id: string
    name: string
    author: string
    pages: number
    description: string
}

export interface ProblemDetail {
    status: number
    detail: string
}