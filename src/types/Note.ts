export type Tag = 'work' | 'personal' | 'ideas' | 'design'

export interface Note {
  id: number
  title: string
  body: string
  tags: Tag[]
  date: Date
}

export const SEED_NOTES: Note[] = [
  {
    id: 1,
    title: 'Q2 Product Roadmap',
    body: 'Key initiatives for the next quarter:\n\n- Launch the redesigned onboarding flow\n- Integrate analytics dashboard v2\n- Accessibility audit for core flows\n- Performance improvements to the API layer\n\nAlignment meeting scheduled for Friday.',
    tags: ['work'],
    date: new Date(Date.now() - 3_600_000 * 2),
  },
  {
    id: 2,
    title: 'Design System Notes',
    body: 'Token naming conventions:\n\n## Spacing\nUse 4px base unit. Scale: 4, 8, 12, 16, 24, 32, 48.\n\n## Color\nSemantic tokens only in components. Raw values stay in primitives.\n\nConsider adopting Radix for accessible primitives.',
    tags: ['design', 'work'],
    date: new Date(Date.now() - 3_600_000 * 26),
  },
  {
    id: 3,
    title: 'Book recommendations',
    body: 'Currently reading:\n• The Pragmatic Programmer\n• Designing Data-Intensive Applications\n\nUp next:\n• A Philosophy of Software Design\n• Staff Engineer by Will Larson',
    tags: ['personal'],
    date: new Date(Date.now() - 3_600_000 * 72),
  },
  {
    id: 4,
    title: 'Side project — NLP tool idea',
    body: 'What if you could extract structured data from meeting transcripts automatically?\n\n- Named entity recognition for action items\n- Sentiment tagging per speaker\n- Auto-summary with confidence scores\n\nPossible stack: Python + spaCy + FastAPI + React frontend',
    tags: ['ideas'],
    date: new Date(Date.now() - 86_400_000 * 5),
  },
]
