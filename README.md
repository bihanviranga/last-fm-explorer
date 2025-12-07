# Last.fm Explorer

A React application for exploring artists, albums, and tracks using the Last.fm API.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Last.fm API key:
   ```
   VITE_LASTFM_API_KEY=your_api_key_here
   ```
   Get your API key from: https://www.last.fm/api/account/create

## Running

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features

- Search for artists
- Browse artist albums
- View album details and track lists
- Sort albums by name or year
- Dark mode support
- Responsive design

## Tech Stack

- React 19
- TypeScript
- Vite
- Chakra UI v3
- Zustand
- React Router
- Axios
