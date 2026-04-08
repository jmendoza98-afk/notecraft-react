# Notecraft

A minimal notes app built with React, TypeScript, and Vite.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Project structure

```
src/
├── types/
│   └── Note.ts           # Note interface + seed data
├── hooks/
│   └── useNotes.ts       # All note state and logic
├── utils/
│   └── format.ts         # Date formatting, word count
├── components/
│   ├── Sidebar.tsx        # Left panel: logo, search, filters
│   ├── Sidebar.module.css
│   ├── NoteList.tsx       # Scrollable list of note previews
│   ├── NoteList.module.css
│   ├── Editor.tsx         # Title, body, toolbar
│   └── Editor.module.css
├── App.tsx                # Root — wires hooks to components
├── App.module.css
├── main.tsx               # React entry point
└── index.css              # Global reset + body styles
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
