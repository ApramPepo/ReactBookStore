import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoutes } from './components/ProtectedRoute'
import { LoginPage } from './auth/LoginPage'
import { RegisterPage } from './auth/RegisterPage'
import { BookListPage } from './books/BookListPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/books"
            element={
              <ProtectedRoutes>
                <BookListPage />
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}