import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

function getInitial(): Theme {
  try {
    const saved = localStorage.getItem('notecraft_theme') as Theme
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('notecraft_theme', theme)
  }, [theme])

  function toggle() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle }
}