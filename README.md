# Kids Learning Arcade

A modular, frontend-only React arcade designed for children to practice focus, timing, and motor skills through mini games.

This project is built with a plug-and-play game architecture: new games are added through a registry, while the core engine remains unchanged.

## Live Concept
- Dashboard with available games
- Infinite play (no levels, no progression lock)
- Centralized score engine
- Dynamic game loading by route (`/game/:id`)

## Tech Stack
- React (functional components + hooks)
- Vite
- React Router
- Plain CSS / inline styles (no heavy UI libraries)

## Key Architecture Decisions
- `GameEngine` is the single source of truth for score.
- Every game receives only one scoring API: `onScoreUpdate(points)`.
- Games do not manage global score state.
- Game discovery is registry-driven via `gameList.js`.
- Adding a game does not require core engine changes.

## Project Structure
```text
src/
  core/
    GameEngine.jsx
    ScoreManager.js
  games/
    gameList.js
    ClickTheStar/
      index.jsx
    DragBall/
      index.jsx
  pages/
    Dashboard.jsx
    GamePage.jsx
  ui/
    Button.jsx
    Card.jsx
    Container.jsx
  App.jsx
  main.jsx
  index.css
```

## Current Games
1. Click The Star
- Star appears at random positions inside bounds
- Click to score +1
- Motion/feedback effects for interaction

2. Drag Ball
- Drag a basketball into a basket target
- Successful drop scores +5
- Ball respawns at a random valid position

## Routing
- `/` -> Dashboard
- `/game/:id` -> Game page (resolved from registry)

## Getting Started
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Preview build:
```bash
npm run preview
```

## How To Add a New Game (Plugin Style)
1. Create a new game component under `src/games/<GameName>/index.jsx`.
2. Accept `onScoreUpdate(points)` as a prop.
3. Trigger score changes only through `onScoreUpdate`.
4. Register the game in `src/games/gameList.js`:

```js
{
  id: "your-game-id",
  name: "Your Game",
  description: "Short description",
  component: YourGameComponent
}
```

That is all. No change is needed in `GameEngine`, routes, or dashboard logic.

## Why This Project Matters
- Demonstrates clean React architecture with separation of concerns
- Shows extensible plugin-like design in frontend applications
- Built for maintainability and fast feature iteration
- Portfolio-ready example of scalable component organization
