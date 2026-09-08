# Movie Explorer

A React app for searching movies and shows, saving personal favourites, and signing in with an account — built as a front-end engineering internship assignment using AI as a development assistant.

**🔗 Live Demo:** [movie-explorer-self-pi.vercel.app/](https://movie-explorer-self-pi.vercel.app/)

## Tech Stack

- **React + TypeScript + Vite**
- **OMDb API** — movie search and details
- **React Router DOM** — routing between pages
- **Firebase**
  - **Authentication** — email/password sign-up and login
  - **Realtime Database** — per-user favourites, stored at `/users/{uid}/favourites`

## Features

- Search movies and shows by title
- View full details for a title (plot, cast, rating, etc.)
- Save/remove favourites (requires an account)
- Favourites are private to each signed-in user
- 404 page for unmatched routes

## Getting Started

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your own OMDb and Firebase keys, then:

```bash
npm run dev
```

## Screenshots

**Firebase Realtime Database** — favourites stored per user under `/users/{uid}/favourites`

![Realtime Database](screenshots/Screenshot%202026-09-08%20133955.png)

**Firebase Authentication** — registered users

![Authentication](screenshots/Screenshot%202026-09-08%20134010.png)

## Project Docs

See [PROMPTS.md](PROMPTS.md) for the full log of prompts used to build this app and how AI assisted throughout development.
