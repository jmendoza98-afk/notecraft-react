import { useNotes } from './hooks/useNotes'
import { useTheme } from './hooks/useTheme'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import styles from './App.module.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const {
    filteredNotes,
    activeNote,
    activeId,
    filterTag,
    searchQuery,
    setActiveId,
    setFilterTag,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes()

  return (
    <div className={styles.app}>
      <Sidebar
        filteredNotes={filteredNotes}
        activeId={activeId}
        filterTag={filterTag}
        searchQuery={searchQuery}
        setActiveId={setActiveId}
        setFilterTag={setFilterTag}
        setSearchQuery={setSearchQuery}
        createNote={createNote}
        theme={theme}
        onToggleTheme={toggle}
      />
      <Editor
        note={activeNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
    </div>
  )
}
