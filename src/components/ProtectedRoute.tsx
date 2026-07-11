import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode
    requireAdmin?: boolean
}

export function ProtectedRoutes({ children, requireAdmin = false }: Props) {
    const { user } = useAuth();

    if(!user) return <Navigate to="/login" replace />
    if(requireAdmin && user.role !== 'ADMIN') return <Navigate to="/books" replace />

    return <>{children}</>
}