import { Note } from '../types/Note'
import { formatRelativeDate } from '../utils/format'
import styles from './NoteList.module.css'

interface Props {
  notes: Note[]
  activeId: number | null
  onSelect: (id: number) => void
}

export function NoteList({ notes, activeId, onSelect }: Props) {
  return (
    <div className={styles.list}>
      {notes.map(note => (
        <div
          key={note.id}
          className={`${styles.item} ${note.id === activeId ? styles.active : ''}`}
          onClick={() => onSelect(note.id)}
        >
          <div className={styles.title}>{note.title || 'Untitled'}</div>
          <div className={styles.preview}>{note.body.replace(/\n/g, ' ').slice(0, 55)}</div>
          <div className={styles.date}>{formatRelativeDate(note.date)}</div>
        </div>
      ))}
    </div>
  )
}
