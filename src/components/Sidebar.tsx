import { Tag } from '../types/Note'
import { NoteList } from './NoteList'
import { useNotes } from '../hooks/useNotes'
import styles from './Sidebar.module.css'

const ALL_TAGS: (Tag | 'all')[] = ['all', 'work', 'personal', 'ideas', 'design']

type Props = Pick<
  ReturnType<typeof useNotes>,
  'filteredNotes' | 'activeId' | 'filterTag' | 'searchQuery' |
  'setActiveId' | 'setFilterTag' | 'setSearchQuery' | 'createNote'
>

export function Sidebar({
  filteredNotes,
  activeId,
  filterTag,
  searchQuery,
  setActiveId,
  setFilterTag,
  setSearchQuery,
  createNote,
}: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          note<span>craft</span>
        </div>
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
          {ALL_TAGS.map(tag => (
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

      <NoteList
        notes={filteredNotes}
        activeId={activeId}
        onSelect={setActiveId}
      />
    </aside>
  )
}
