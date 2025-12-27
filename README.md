# Side Quest

A modern, gamified task management system built with React, TypeScript, and Tailwind CSS. Organize your tasks as epic quests with a beautiful kanban-style interface.

## Features

### Core Functionality
- **Quest & Task Management**: Create quests (projects) and add tasks as mini cards within each quest
- **Progress Tracking**: Visual progress bars and completion percentages for each quest
- **Dark Theme**: Modern, eye-friendly dark interface with smooth animations
- **Data Persistence**: All your quests and tasks are automatically saved to local storage
- **Stats Dashboard**: Track your overall progress and view detailed quest breakdowns

### Current Features
- ✅ Create, edit, and delete quests
- ✅ Add, edit, and delete tasks within quests
- ✅ Mark tasks as complete with smooth checkbox animations
- ✅ Star/favorite tasks and quests
- ✅ Auto-complete quests when all tasks are finished
- ✅ Real-time progress tracking with bars and percentages
- ✅ Statistics page with overall metrics

### Future Enhancements
- Quest completion toggle with completed quests tab
- Starred/highlighted items view for focused work
- Quest Lines for categorizing quests by theme (academics, sports, etc.)
- Advanced stats tracking by category

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: React Context API
- **Storage**: Browser LocalStorage

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sidequest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Top navigation bar
│   ├── QuestCard.tsx    # Quest card with tasks
│   └── TaskCard.tsx     # Individual task mini card
├── contexts/           # React Context providers
│   └── QuestContext.tsx # Global state management
├── pages/              # Page components
│   ├── QuestBoard.tsx   # Main kanban board view
│   └── StatsPage.tsx    # Statistics dashboard
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Root component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind config
```

## Usage

### Creating a Quest
1. Click the "+ New Quest" button on the main page
2. Enter your quest title and press Enter or click "Create Quest"

### Adding Tasks
1. Click "+ Add Task" within any quest card
2. Enter the task description and press Enter or click "Add"

### Managing Tasks
- **Complete**: Click the checkbox to mark a task as complete
- **Edit**: Click on the task description to edit it inline
- **Star**: Click the star icon to mark tasks as important
- **Delete**: Click the X icon to remove a task

### Viewing Stats
- Click "Stats" in the navigation bar to view your progress dashboard
- See overall completion rates and individual quest progress

## Data Storage

All quest and task data is stored in your browser's LocalStorage. Your data will persist between sessions but is specific to your browser and device.

## Contributing

Feel free to submit issues and pull requests!

## License

MIT

---

Built with ⚔️ by [Your Name]
