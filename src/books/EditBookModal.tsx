import { useState } from 'react'
import { api } from '../api/client'
import type { BookResponse } from '../types'

interface Props {
  book: BookResponse
  onClose: () => void
  onSuccess: () => void
}

export function EditBookModal({ book, onClose, onSuccess }: Props) {
  const [name, setName] = useState(book.name)
  const [author, setAuthor] = useState(book.author)
  const [description, setDescription] = useState(book.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.put(`/books/${book.id}`, { name, author, description })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <label>Title <input value={name} onChange={e => setName(e.target.value)} required /></label>
          <label>Author <input value={author} onChange={e => setAuthor(e.target.value)} required /></label>
          <label>Description <textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}