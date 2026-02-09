# Moonkissed Project Plan

## Executive Summary
Moonkissed is a high-end, personalized astrology platform designed to provide users with deep celestial insights through an immersive and aesthetically superior digital experience. The application leverages modern web technologies and artificial intelligence to deliver birth chart calculations and interpretative readings.

## UI/UX Design Direction

### Visual Aesthetic
The design system for Moonkissed focuses on an "Elegant Mysticism" aesthetic, prioritizing depth, motion, and premium visual hierarchy.

*   **Primary Palette:** Deep Space Navy (#0B1437)
*   **Secondary Palette:** Soft Lavender (#B8A4E8)
*   **Accent Palette:** Moonlight Gold (#F4D58D)
*   **Highlight Palette:** Celestial Pink (#E8B4D9)
*   **Text Palette:** Cream White (#FAF9F6)

### Typography
*   **Headlines:** Cormorant Garamond (Elegant Serif)
*   **Body Copy:** Inter or Poppins (Clean Sans-Serif)
*   **Accents/Quotes:** Italiana or Cinzel (Mystical Serif)

### Key Visual Components
*   Subtle background constellation patterns
*   Animated floating star particles
*   Soft gradient overlays for depth
*   Glassmorphism-based UI cards with frosted glass effects
*   Interactive glowing borders on component hover states
*   Zodiac constellation illustrations and moon phase indicators

### Layout Philosophy
*   **Spaciousness:** Utilization of significant whitespace to create a breathable, premium feel.
*   **Modular Design:** Content organized into distinct, high-fidelity cards.
*   **Motion Design:** Implementation of smooth transitions, fades, and subtle floating animations.
*   **Responsive Framework:** A mobile-first approach ensuring high-quality experience across all devices.

## Development Roadmap

### Phase 1: Foundation
**Infrastructure and Setup:**
*   Initialize Next.js 14 project utilizing the App Router and TypeScript.
*   Configure Tailwind CSS with a custom design system theme.
*   Implement Prisma ORM with a PostgreSQL database.
*   Integrate Framer Motion for high-performance UI animations.
*   Define project architecture and directory structure.

**Core Page Implementation:**
1.  **Landing Page:**
    *   Hero section featuring an animated celestial background.
    *   Primary headline and slogan integration.
    *   Call-to-Action: "Discover Your Chart".
    *   Feature highlight modules (Grid layout).
2.  **Birth Chart Entry System:**
    *   Multi-step onboarding flow.
    *   Input collection: Name, Birth Date, Birth Time (with AM/PM), and Birth Location.
    *   Integration of geocoding for precise location coordinates.

**Database Schema (Prisma):**
```prisma
model BirthChart {
  id          String   @id @default(cuid())
  name        String
  birthDate   DateTime
  birthTime   String
  birthPlace  String
  latitude    Float
  longitude   Float
  
  sunSign     String
  moonSign    String
  risingSign  String
  
  createdAt   DateTime @default(now())
}
```

### Phase 2: Core Functionality
**Technical Implementation:**
3.  **Astrological Calculation Engine:**
    *   Development of API routes for zodiac calculation.
    *   Integration of astronomical libraries (e.g., astronomy-engine).
    *   Precise calculation of Sun, Moon, and Rising signs based on tropical astrology standards.
4.  **Birth Chart Visualization:**
    *   Implementation of an animated SVG-based circular zodiac wheel.
    *   Display of the "Big Three" signs in dedicated premium modules.
    *   Background particle interaction layer.
5.  **AI Interpretative Engine:**
    *   Groq API integration (Llama 3.3 70B or GPT-OSS 120B) for personalized readings.
    *   Proprietary prompt engineering targeting mystical yet empowering tones.

### Phase 3: User Experience Enhancement
6.  **User Dashboard:**
    *   Management interface for saved birth charts.
    *   Grid view showing chart summaries and rapid-access links.
7.  **Dynamic Horoscope Content:**
    *   Daily sign-specific readings.
    *   Database-level caching strategy for daily content to optimize API usage.
8.  **Synastry/Compatibility Engine:**
    *   Interface for comparing two saved charts.
    *   AI-driven compatibility analysis with visual scoring.

### Phase 4: Final Polish and Distribution
9.  **Celestial Event Tracking:**
    *   Real-time moon phase visualization and interpretative data.
10. **Export and Sharing:**
    *   Dynamic image generation for chart sharing (Instagram/Social formats).
    *   High-fidelity PNG/JPG export capabilities.
11. **Authentication (Optional/Security):**
    *   NextAuth.js implementation for account-based chart persistence.

## Technical Specifications

### Tech Stack
*   **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
*   **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL.
*   **AI/ML:** Groq API (Llama 3.3 70B, GPT-OSS 120B, or Llama 3.1 8B).
*   **Infrastructure:** Vercel (Hosting/Database), Geocoding API (Mapbox or OpenCage).

## Future Considerations
*   Expansion into Vedic astrology options.
*   Detailed planetary transition alerts (Push Notifications).
*   Integration of a curated wellness marketplace.