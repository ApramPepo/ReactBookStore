import { useState } from 'react'
import { EditBookModal } from './EditBookModal'
import type { BookResponse } from '../types'

interface Props {
  book: BookResponse
  isAdmin: boolean
  onDelete: () => void
  onUpdate: () => void
}

export function BookCard({ book, isAdmin, onDelete, onUpdate }: Props) {
  const [showEdit, setShowEdit] = useState(false)

  return (
    <div className="book-card">
      <h3>{book.name}</h3>
      <p className="author">by {book.author}</p>
      <p className="pages">{book.pages} pages</p>
      {book.description && <p className="description">{book.description}</p>}
      {isAdmin && (
        <div className="card-actions">
          <button onClick={() => setShowEdit(true)}>Edit</button>
          <button className="danger" onClick={onDelete}>Delete</button>
        </div>
      )}
      {showEdit && (
        <EditBookModal
          book={book}
          onClose={() => setShowEdit(false)}
          onSuccess={() => { setShowEdit(false); onUpdate() }}
        />
      )}
    </div>
  )
}