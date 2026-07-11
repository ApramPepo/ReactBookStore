import { useState } from 'react'
import { api } from '../api/client'

interface Props {
  onSuccess: () => void
}

export function AddBookForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/books', { name, author, pages: parseInt(pages), description })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h2>Add Book</h2>
      <label>Title <input value={name} onChange={e => setName(e.target.value)} required /></label>
      <label>Author <input value={author} onChange={e => setAuthor(e.target.value)} required /></label>
      <label>Pages <input type="number" value={pages} onChange={e => setPages(e.target.value)} required min="1" /></label>
      <label>Description <textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Book'}</button>
    </form>
  )
}