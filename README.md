# SideQuest

A modern, gamified task management system built with React, TypeScript, and Tailwind CSS. Organize your tasks as epic quests with a beautiful dark-themed interface.

**Live Demo:** [https://teajuw.github.io/sidequest](https://teajuw.github.io/sidequest)

## Features

- **Quest & Task Management**: Create quests (projects) and add tasks within each quest
- **Progress Tracking**: Visual progress bars, XP system, and level progression
- **Quest Lines**: Organize quests by category with custom colors
- **Stats Dashboard**: Track your overall progress, daily streaks, and milestones
- **Cloud Sync**: Automatic backup to GitHub Gist
- **Dark Theme**: Modern, eye-friendly dark interface with smooth animations

## Cloud Sync with GitHub Gist

SideQuest can automatically sync your data to a private GitHub Gist, allowing you to access your quests from any device.

### Setting Up Sync

1. **Create a GitHub Personal Access Token:**
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "SideQuest Sync")
   - Select only the **`gist`** scope
   - Click "Generate token" and copy it (starts with `ghp_`)

2. **Connect in SideQuest:**
   - Go to Settings page
   - Paste your token in the "GitHub Personal Access Token" field
   - Click "Connect to GitHub"
   - Your data will automatically sync after any changes

### Restoring Your Data

If you need to restore your data on a new device or browser:

1. **Find your Gist ID:**
   - Go to [gist.github.com](https://gist.github.com) and sign in
   - Look for a gist containing `sidequest_data.json`
   - The Gist ID is the long string in the URL: `https://gist.github.com/username/GIST_ID_HERE`

2. **Restore in SideQuest:**
   - Go to Settings page
   - Enter your GitHub token
   - Paste your Gist ID in the "Existing Gist ID" field
   - Click "Connect to GitHub"
   - Click "Load from Cloud" to restore your data

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: React Context API
- **Storage**: Browser LocalStorage + GitHub Gist

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/teajuw/sidequest.git
cd sidequest

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173)

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── components/          # React components
├── contexts/            # React Context providers
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (gistSync, etc.)
├── App.tsx              # Root component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## License

MIT

---

Built by Trevor Ju
