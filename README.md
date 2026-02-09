# Moonkissed

Moonkissed is a high-end, personalized astrology platform designed to provide users with precise celestial insights through an immersive digital experience. The application utilizes modern astronomical algorithms and artificial intelligence to deliver birth chart calculations and interpretative readings.

## Core Features

### Astrological Engine
- Precise calculation of Sun, Moon, and Rising signs based on tropical astrology standards.
- Exact astronomy calculations: planetary positions, zodiac signs, degrees, and retrograde status.
- Planetary aspect calculations (Conjunction, Sextile, Square, Trine, Opposition) with orbs.
- Detailed planetary positions including Mercury, Venus, Mars, and House Cusps.
- Interactive SVG-based birth chart wheel visualization.

### AI-Powered Insights
- Personalized birth chart interpretations using advanced language models via Groq SDK.
- Exact astronomy feature with precise planetary degree calculations.
- Synastry forecast with calculated astrological aspects between two charts.
- Daily sign-specific horoscopes with a sophisticated MongoDB caching strategy.
- Synastry and compatibility analysis between multiple saved charts.

### Celestial Monitoring
- Real-time moon phase tracking with automated interpretation of current lunar cycles.
- Calculation of upcoming major phases (New Moon and Full Moon).

### User Ecosystem
- Secure account-based persistence using NextAuth.js.
- Private "Cosmic Gallery" dashboard for managing personalized blueprints.
- Protected routes and authenticated onboarding workflow.

## Technical Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Framer Motion, Tailwind CSS, Lucide React.
- **Backend**: Next.js API Routes, MongoDB (Mongoose ODM).
- **AI Integration**: Groq SDK (Llama 3.3).
- **Astronomy**: astronomy-engine for high-precision celestial calculations.
- **Authentication**: NextAuth.js with Credentials provider and MongoDB adapter.

## Configuration

The application requires environment variables defined in `.env.local`. Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Refer to `.env.example` for details on required keys (MongoDB, Groq API, and NextAuth).

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Infrastructure (Docker)
The project includes a Docker configuration for local database management:
```bash
docker-compose up -d
```
This starts:
- MongoDB at `localhost:27017`
- Mongo Express (UI) at `localhost:8081`

### Production Build
```bash
npm run build
npm start
```

## Code Standards
- **Linter**: Biome for high-performance linting and formatting.
- **Type Checking**: Strict TypeScript configurations.
- **Design System**: Custom CSS variables for a consistent "Elegant Mysticism" aesthetic.
