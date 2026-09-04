import { Tag } from '../types/Note'
import { NoteList } from './NoteList'
import { useNotes } from '../hooks/useNotes'
import styles from './Sidebar.module.css'

const TAGS: (Tag | 'all')[] = ['all', 'work', 'personal', 'ideas', 'design']

type Props = {
  filteredNotes: ReturnType<typeof useNotes>['filteredNotes']
  activeId: ReturnType<typeof useNotes>['activeId']
  filterTag: ReturnType<typeof useNotes>['filterTag']
  searchQuery: ReturnType<typeof useNotes>['searchQuery']
  setActiveId: ReturnType<typeof useNotes>['setActiveId']
  setFilterTag: ReturnType<typeof useNotes>['setFilterTag']
  setSearchQuery: ReturnType<typeof useNotes>['setSearchQuery']
  createNote: ReturnType<typeof useNotes>['createNote']
  theme: string
  onToggleTheme: () => void
}
export function Sidebar({ filteredNotes, activeId, filterTag, searchQuery, setActiveId, setFilterTag, setSearchQuery, createNote, theme, onToggleTheme }: Props) {
  return (
    <aside className={styles.sidebar}>

      <div className={styles.header}>
        <div className={styles.logo}>note<span>craft</span></div>
        <button className={styles.themeBtn} onClick={onToggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <button className={styles.newBtn} onClick={createNote}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="2" y1="8" x2="14" y2="8" />
        </svg>
        New note
      </button>

      <div className={styles.searchWrap}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.tagSection}>
        <span className={styles.tagLabel}>Filter</span>
        <div className={styles.tags}>
          {TAGS.map(tag => (
            <button
              key={tag}
              className={`${styles.tag} ${filterTag === tag ? styles.active : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <NoteList notes={filteredNotes} activeId={activeId} onSelect={setActiveId} />

    </aside>
  )
}
