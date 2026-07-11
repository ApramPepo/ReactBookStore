import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, AuthResponse, UserResponse } from '../types';
import { api } from '../api/client';

interface AuthContextValue {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<UserResponse>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeToken(token: string): User {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
        id: payload.sub,
        email: payload.email,
        username: payload.email,
        role: payload.role as 'CUSTOMER' | 'ADMIN',
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [ token, setToken ] = useState<string | null>(
        () => localStorage.getItem('token')
    );

    const [ user, setUser ] = useState<User | null>(() => {
        const stored = localStorage.getItem('token');
        return stored ? decodeToken(stored) : null;
    });

    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post<AuthResponse>('/auth/login', { email, password });
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(decodeToken(res.token));
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        return api.post<UserResponse>('/auth/register', { username, email, password })
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}