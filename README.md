# Music Player UI

A modern, responsive music player UI built with React and TypeScript, featuring a Spotify-like interface with dark theme and smooth animations.


## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dynamic Music Player**: Play, pause, skip, and control volume
- **Track Progress**: Visual progress bar with time indicators
- **Song Library**: Browse and search through available tracks
- **Category Tabs**: For You, Top Tracks, Favorites, and Recently Played sections
- **Smooth Animations**: Enhances user experience with fluid transitions
- **Mobile-Optimized View**: Special mobile interface for better usability

## Technologies Used

- React with TypeScript
- Vite for fast development and building
- Bootstrap for responsive layout
- SCSS for advanced styling
- React Icons for UI elements

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/10xshivam/Assignment.git
   cd music-player-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Usage

- Click on songs in the list to play them
- Use the player controls to play/pause, skip, and adjust volume
- Navigate between different categories using the sidebar tabs
- Search for songs using the search bar
- On mobile, tap the menu button to access playlists and search

## Project Structure

```
music-player-ui/
├── public/           # Static assets
├── src/              # Source files
│   ├── assets/       # Images and static resources
│   ├── components/   # React components
│   ├── App.tsx       # Main application component
│   ├── App.scss      # Main styles
│   └── ...
├── vite.config.ts    # Vite configuration
└── ...
```

## Implementation Notes

- Uses SoundHelix tracks as free substitutes for popular songs
- Implements a proxy in vite.config.ts to resolve CORS issues with audio playback
- Designed with accessibility and user experience in mind

## License

[MIT](LICENSE)
