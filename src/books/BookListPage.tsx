import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../api/client'
import { BookCard } from './BookCard'
import { AddBookForm } from './AddBookForm'
import type { BookResponse } from '../types'

export function BookListPage() {
  const { user, logout } = useAuth()
  const [books, setBooks] = useState<BookResponse[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<BookResponse[]>(`/books?page=${page}&pageSize=10`)
      setBooks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books.')
    } finally {
      setLoading(false)
    }
  }, [page])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBooks() }, [fetchBooks]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return
    try {
      await api.delete(`/books/${id}`)
      fetchBooks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Bookstore</h1>
        <div className="header-actions">
          <span>{user?.email} ({user?.role})</span>
          {isAdmin && (
            <button onClick={() => setShowAddForm(v => !v)}>
              {showAddForm ? 'Cancel' : 'Add Book'}
            </button>
          )}
          <button onClick={logout}>Sign Out</button>
        </div>
      </header>

      {showAddForm && isAdmin && (
        <AddBookForm onSuccess={() => { setShowAddForm(false); fetchBooks() }} />
      )}

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(book.id)}
              onUpdate={fetchBooks}
            />
          ))}
          {books.length === 0 && <p>No books found.</p>}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={books.length < 10}>
          Next
        </button>
      </div>
    </div>
  )
}