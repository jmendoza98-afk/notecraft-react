import { useState, useEffect, useCallback } from 'react'
import { Note, Tag, SEED_NOTES } from '../types/Note'
 
const STORAGE_KEY = 'notecraft_notes'
 
let nextId: number
 
function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_NOTES
 
    const parsed = JSON.parse(raw) as Array<Omit<Note, 'date'> & { date: string }>
    return parsed.map(n => ({ ...n, date: new Date(n.date) }))
  } catch {
    return SEED_NOTES
  }
}
 
function initNextId(notes: Note[]): number {
  return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1
}
 
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const loaded = loadNotes()
    nextId = initNextId(loaded)
    return loaded
  })
 
  const [activeId, setActiveId]     = useState<number | null>(notes[0]?.id ?? null)
  const [filterTag, setFilterTag]   = useState<Tag | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
 
  // Persist to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])
 
  const activeNote = notes.find(n => n.id === activeId) ?? null
 
  const filteredNotes = notes.filter(note => {
    const matchesTag =
      filterTag === 'all' || note.tags.includes(filterTag)
    const matchesQuery =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesQuery
  })
 
  const createNote = useCallback(() => {
    const note: Note = {
      id: nextId++,
      title: '',
      body: '',
      tags: ['ideas'],
      date: new Date(),
    }
    setNotes(prev => [note, ...prev])
    setActiveId(note.id)
    setFilterTag('all')
    setSearchQuery('')
  }, [])
 
  const updateNote = useCallback((id: number, changes: Partial<Pick<Note, 'title' | 'body'>>) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, ...changes } : note))
    )
  }, [])
 
  const deleteNote = useCallback((id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    setActiveId(null)
  }, [])
 
  return {
    notes,
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
  }
}
