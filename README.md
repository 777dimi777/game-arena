# GameArena

GameArena is a full-stack web platform for organizing and managing competitive gaming tournaments. Users can create teams, join tournaments, follow matches, view results and track tournament leaderboards.

The project was created as a university web-development project using Angular, RxJS, NgRx, NestJS, TypeORM and PostgreSQL.

## Features

### User features

* User registration and login with JWT authentication
* Profile page with username, email and role information
* Browse available games, teams, tournaments and matches
* Create a gaming team
* Join an open tournament with a selected team
* View tournament details, registered teams and leaderboard
* View upcoming and completed matches
* Optional interface sound effects
* Search tournaments by name, game, description or status

### Admin features

* Create games
* Create tournaments
* Create matches
* Enter match results
* Automatic winner selection based on match scores
* Delete tournaments
* Manage tournament data through the admin panel

### Technical features

* Angular frontend
* RxJS observables and operators
* NgRx Store, Actions, Reducers, Selectors, Entity Adapter and Effects
* NestJS backend
* PostgreSQL database running in Docker
* TypeORM entities and relations
* JWT authentication with Passport
* Role-based access control for administrators
* Responsive user interface
* Gaming-inspired design, animations and optional sound effects

## Main entities

The application contains five main entities:

* **User** — registered platform user with USER or ADMIN role
* **Game** — game available for tournaments
* **Team** — gaming team created by users
* **Tournament** — competitive event connected to one game and multiple teams
* **Match** — match between two teams inside a tournament

## Entity relations

* One game can have multiple tournaments.
* One tournament belongs to one game.
* One tournament can contain multiple teams.
* One team can participate in multiple tournaments.
* One tournament can contain multiple matches.
* One match belongs to one tournament.
* Each match has Team A, Team B and optionally a winner.

## Technologies

### Frontend

* Angular
* TypeScript
* RxJS
* NgRx Store
* NgRx Effects
* NgRx Entity
* SCSS
* Angular Router
* Angular HttpClient

### Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* Passport.js
* JWT
* bcrypt
* class-validator
* class-transformer

### Infrastructure

* Docker
* Docker Compose
* PostgreSQL 16

## Project structure

```text
game-arena/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── game/
│   │   ├── team/
│   │   ├── tournament/
│   │   ├── match/
│   │   ├── user/
│   │   └── seed/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── store/
│   │   └── public/assets/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/777dimi777/game-arena.git
cd game-arena
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d
```

The PostgreSQL database will be available on:

```text
Host: localhost
Port: 5432
Database: game_arena
Username: postgres
Password: postgres
```

### 3. Start the backend

Open a terminal:

```bash
cd backend
npm install
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

### 4. Seed demo data

With the backend running, use another terminal:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/seed" -Method Post
```

This creates demo games, teams, tournaments and matches.

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs on:

```text
http://localhost:4200
```

## Test accounts

### Administrator

```text
Email: admin2@test.com
Password: admin123
```

The administrator can access:

```text
http://localhost:4200/admin
```

### Regular user

```text
Email: jwtuser@test.com
Password: 123456
```

The regular user can create a team and join tournaments.

## Main routes

| Route              | Description                        |
| ------------------ | ---------------------------------- |
| `/`                | Home page with platform statistics |
| `/tournaments`     | Tournament list and RxJS search    |
| `/tournaments/:id` | Tournament details and leaderboard |
| `/matches`         | Match list and results             |
| `/teams`           | Team list                          |
| `/games`           | Game list                          |
| `/create-team`     | Team creation page                 |
| `/profile`         | User profile                       |
| `/admin`           | Administrator dashboard            |
| `/login`           | Login page                         |
| `/register`        | Registration page                  |

## NgRx implementation

NgRx is used for tournament state management.

Implemented parts:

* Tournament actions
* Tournament reducer
* Tournament entity adapter
* Tournament selectors
* Tournament effects
* Loading tournament list
* Loading tournament details
* Creating tournaments
* Deleting tournaments

The tournament store handles:

```text
loading
error
selected tournament
normalized tournament entities
```

## RxJS implementation

The project uses RxJS for:

* HTTP requests through Angular services
* Tournament search with `Subject`
* `debounceTime`
* `distinctUntilChanged`
* `combineLatest`
* `switchMap`
* `forkJoin`
* `shareReplay`
* Animated home statistics
* Loading multiple API resources in parallel

## Authentication and authorization

Authentication is implemented with JWT and Passport.js.

Protected frontend routes:

* `/profile`
* `/create-team`
* `/admin`

Administrator-only backend actions include:

* Creating games
* Updating games
* Deleting games
* Creating tournaments
* Updating tournaments
* Deleting tournaments
* Creating matches
* Entering match results
* Deleting matches

## Screenshots

Add screenshots of the following pages here before final submission:

* Home page
* Tournament list
* Tournament details and leaderboard
* Matches page
* Admin dashboard
* Profile page

## Author

Miloš Dimitrijević

GameArena — 2026
