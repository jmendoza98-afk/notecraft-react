import { useRef, useEffect, useState } from 'react'
import { Note, Tag } from '../types/Note'
import { formatFullDate, countWords } from '../utils/format'
import styles from './Editor.module.css'

// maps each tag to its pill style
const tagStyles: Record<Tag, string> = {
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
  const bodyRef  = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [saved, setSaved]       = useState(false)
  const [isBold, setIsBold]     = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrike, setIsStrike] = useState(false)

  // focus the title when a brand new note opens
  useEffect(() => {
    if (note && !note.title) titleRef.current?.focus()
  }, [note?.id])

  // sync the contenteditable div when switching notes
  useEffect(() => {
    if (!bodyRef.current || !note) return
    if (bodyRef.current.innerHTML !== note.body) {
      bodyRef.current.innerHTML = note.body || ''
    }
    // put cursor at the end
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(bodyRef.current)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [note?.id])

  function scheduleSave() {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(true), 800)
  }

  function handleBodyInput() {
    if (!note || !bodyRef.current) return
    onUpdate(note.id, { body: bodyRef.current.innerHTML })
    scheduleSave()
  }

  function handleTitleChange(title: string) {
    if (!note) return
    onUpdate(note.id, { title })
    scheduleSave()
  }

  function checkFormatState() {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
    setIsStrike(document.queryCommandState('strikeThrough'))
  }

  function handleFormat(cmd: string) {
    if (!bodyRef.current) return
    bodyRef.current.focus()

    // make sure there's a selection to work with
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(bodyRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }

    document.execCommand(cmd, false)
    checkFormatState()
    handleBodyInput()
  }

  if (!note) {
    return (
      <div className={styles.editorArea}>
        <Toolbar
          isBold={false}
          isItalic={false}
          isUnderline={false}
          isStrike={false}
          wordCount={0}
          onFormat={() => {}}
          onDelete={() => {}}
          hasNote={false}
          saved={false}
        />
        <div className={styles.emptyState}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#c8a96a" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.25 }}>
            <rect x="8" y="6" width="24" height="28" rx="3" />
            <line x1="14" y1="14" x2="26" y2="14" />
            <line x1="14" y1="20" x2="26" y2="20" />
          </svg>
          <p>Select a note</p>
          <small>or create a new one</small>
        </div>
      </div>
    )
  }

  const wordCount = countWords(note.body.replace(/<[^>]*>/g, ' '))

  return (
    <div className={styles.editorArea}>
      <Toolbar
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        isStrike={isStrike}
        wordCount={wordCount}
        onFormat={handleFormat}
        onDelete={() => onDelete(note.id)}
        hasNote={true}
        saved={saved}
      />

      <div className={styles.content} key={note.id}>
        <input
          ref={titleRef}
          className={styles.titleInput}
          placeholder="Untitled note"
          value={note.title}
          onChange={e => handleTitleChange(e.target.value)}
        />

        <div className={styles.metaRow}>
          <span className={styles.metaDate}>{formatFullDate(note.date)}</span>
          <div className={styles.pills}>
            {note.tags.map(tag => (
              <span key={tag} className={`${styles.pill} ${tagStyles[tag]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          ref={bodyRef}
          className={styles.bodyInput}
          contentEditable
          suppressContentEditableWarning
          onInput={handleBodyInput}
          onKeyUp={checkFormatState}
          onMouseUp={checkFormatState}
          data-placeholder="Start writing..."
        />
      </div>
    </div>
  )
}

interface ToolbarProps {
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
  wordCount: number
  hasNote: boolean
  saved: boolean
  onFormat: (cmd: string) => void
  onDelete: () => void
}

function Toolbar({ isBold, isItalic, isUnderline, isStrike, wordCount, hasNote, saved, onFormat, onDelete }: ToolbarProps) {
  const btn = (label: React.ReactNode, cmd: string, active: boolean, title: string) => (
    <button
      className={`${styles.toolbarBtn} ${active ? styles.toolbarBtnActive : ''}`}
      onMouseDown={e => { e.preventDefault(); onFormat(cmd) }}
      title={title}
    >
      {label}
    </button>
  )

  return (
    <div className={styles.toolbar}>
      {btn(<b>B</b>, 'bold', isBold, 'Bold')}
      {btn(<i>I</i>, 'italic', isItalic, 'Italic')}
      {btn(<u>U</u>, 'underline', isUnderline, 'Underline')}
      {btn(<s>S</s>, 'strikeThrough', isStrike, 'Strikethrough')}
      <div className={styles.toolbarSep} />
      <button
        className={styles.toolbarBtn}
        onMouseDown={e => { e.preventDefault(); onFormat('removeFormat') }}
        title="Clear formatting"
      >
        ✕
      </button>

      <div className={styles.toolbarRight}>
        {saved && (
          <span className={styles.saveIndicator}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#4a9a6a" strokeWidth="2" strokeLinecap="round">
              <polyline points="2,6 5,9 10,3" />
            </svg>
            saved
          </span>
        )}
        <span className={styles.wordcount}>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        {hasNote && (
          <button className={styles.deleteBtn} onClick={onDelete}>Delete</button>
        )}
      </div>
    </div>
  )
}
