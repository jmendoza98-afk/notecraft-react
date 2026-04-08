import { useRef, useEffect } from 'react'
import { Note, Tag } from '../types/Note'
import { formatFullDate, countWords } from '../utils/format'
import styles from './Editor.module.css'

const TAG_PILL_CLASS: Record<Tag, string> = {
  work:     styles.pillWork,
  personal: styles.pillPersonal,
  ideas:    styles.pillIdeas,
  design:   styles.pillDesign,
}

interface Props {
  note: Note | null
  onUpdate: (id: number, changes: Partial<Pick<Note, 'title' | 'body'>>) => void
  onDelete: (id: number) => void
}

export function Editor({ note, onUpdate, onDelete }: Props) {
  const titleRef = useRef<HTMLInputElement>(null)

  // Focus title when a brand-new empty note is opened
  useEffect(() => {
    if (note && !note.title) {
      titleRef.current?.focus()
    }
  }, [note?.id])

  if (!note) {
    return (
      <div className={styles.editorArea}>
        <Toolbar wordCount={0} onFormat={() => {}} onInsert={() => {}} onDelete={() => {}} hasNote={false} />
        <div className={styles.emptyState}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#c8a96a" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.3 }}>
            <rect x="8" y="6" width="24" height="28" rx="3" />
            <line x1="14" y1="14" x2="26" y2="14" />
            <line x1="14" y1="20" x2="26" y2="20" />
            <line x1="14" y1="26" x2="20" y2="26" />
          </svg>
          <p>Select a note</p>
          <small>or create a new one</small>
        </div>
      </div>
    )
  }

  function handleFormat(cmd: 'bold' | 'italic') {
  if (!note) return
  const ta = document.getElementById('bodyInput') as HTMLTextAreaElement
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const sel   = ta.value.slice(start, end)
    if (!sel) return
    const wrap        = cmd === 'bold' ? '**' : '_'
    const replacement = wrap + sel + wrap
    const newBody     = ta.value.slice(0, start) + replacement + ta.value.slice(end)
    onUpdate(note.id, { body: newBody })
    requestAnimationFrame(() => {
      ta.setSelectionRange(start + wrap.length, end + wrap.length)
      ta.focus()
    })
  }

  function handleInsert(prefix: string) {
  if (!note) return
  const ta = document.getElementById('bodyInput') as HTMLTextAreaElement
    const pos       = ta.selectionStart
    const before    = ta.value.slice(0, pos)
    const after     = ta.value.slice(pos)
    const lineStart = before.lastIndexOf('\n') + 1
    const newBody   = before.slice(0, lineStart) + prefix + before.slice(lineStart) + after
    onUpdate(note.id, { body: newBody })
    requestAnimationFrame(() => {
      ta.setSelectionRange(pos + prefix.length, pos + prefix.length)
      ta.focus()
    })
  }

  return (
    <div className={styles.editorArea}>
      <Toolbar
        wordCount={countWords(note.body)}
        onFormat={handleFormat}
        onInsert={handleInsert}
        onDelete={() => onDelete(note.id)}
        hasNote={true}
      />

      <div className={styles.content}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          placeholder="Untitled note"
          value={note.title}
          onChange={e => onUpdate(note.id, { title: e.target.value })}
        />

        <div className={styles.metaRow}>
          <span className={styles.metaDate}>{formatFullDate(note.date)}</span>
          <div className={styles.pills}>
            {note.tags.map(tag => (
              <span key={tag} className={`${styles.pill} ${TAG_PILL_CLASS[tag]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <textarea
          id="bodyInput"
          className={styles.bodyInput}
          placeholder="Start writing..."
          value={note.body}
          onChange={e => onUpdate(note.id, { body: e.target.value })}
        />
      </div>
    </div>
  )
}

// ── Toolbar sub-component ────────────────────────────────
interface ToolbarProps {
  wordCount: number
  hasNote: boolean
  onFormat: (cmd: 'bold' | 'italic') => void
  onInsert: (prefix: string) => void
  onDelete: () => void
}

function Toolbar({ wordCount, hasNote, onFormat, onInsert, onDelete }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button className={styles.toolbarBtn} onClick={() => onFormat('bold')}><b>B</b></button>
      <button className={styles.toolbarBtn} onClick={() => onFormat('italic')}><i>I</i></button>
      <div className={styles.toolbarSep} />
      <button className={styles.toolbarBtn} onClick={() => onInsert('# ')}>H1</button>
      <button className={styles.toolbarBtn} onClick={() => onInsert('## ')}>H2</button>
      <button className={styles.toolbarBtn} onClick={() => onInsert('- ')}>—</button>
      <button className={styles.toolbarBtn} onClick={() => onInsert('> ')}>❝</button>
      <div className={styles.toolbarRight}>
        <span className={styles.wordcount}>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        {hasNote && (
          <button className={styles.deleteBtn} onClick={onDelete}>Delete</button>
        )}
      </div>
    </div>
  )
}
