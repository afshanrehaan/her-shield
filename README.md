# Her Shield — Health & Security Platform for Women

A privacy-first web application providing emergency safety tools, health tracking, and security features for women.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **State:** TanStack React Query, React Context
- **Routing:** React Router v6
- **Charts:** Recharts
- **Animation:** Framer Motion

## Features

### 1. Emergency SOS System (`/sos`)
- **Panic Button** — one-tap activation sends real-time GPS coordinates (Geolocation API) to saved emergency contacts
- **Siren** — generates an alarm tone via the Web Audio API
- **Emergency Contacts** — add, store, and manage contacts (localStorage)

### 2. Health Dashboard (`/health`)
- **Menstrual Cycle Tracker** — calendar-based logging with intensity levels
- **Wellness Logs** — record symptoms, mood, and notes
- **Data Visualization** — Recharts line/bar charts for health trends over time

### 3. Security Toolkit (`/security`)
- **Safe Route Finder** — UI for discovering well-lit / high-traffic paths (Google Maps API ready)
- **Hidden Camera Detector** — magnetometer-based interface with simulated sensor readings

### 4. Discreet Mode
- Press **`Ctrl + Shift + D`** to instantly disguise the app as a generic news/weather site
- Navigation labels, icons, and header branding all swap to neutral alternatives
- Implemented via React Context (`DiscreetModeContext`)

## Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx        # Shell with top nav + mobile bottom nav
│   └── ui/                  # shadcn/ui primitives
├── contexts/
│   └── DiscreetModeContext.tsx
├── pages/
│   ├── Index.tsx            # Landing / dashboard
│   ├── SOSPage.tsx          # Emergency SOS
│   ├── HealthPage.tsx       # Health tracker
│   ├── SecurityPage.tsx     # Security tools
│   └── NotFound.tsx
├── App.tsx                  # Routes & providers
└── index.css                # Design tokens & Tailwind
```

## Database Schema (PostgreSQL — ready for backend integration)

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE emergency_contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  relation    TEXT,
  is_primary  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE health_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  log_date    DATE NOT NULL,
  cycle_day   INT,
  intensity   INT CHECK (intensity BETWEEN 1 AND 5),
  symptoms    TEXT[],
  mood        TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

## API Logic — SOS Trigger (Edge Function outline)

```typescript
// POST /api/sos
// Body: { userId, latitude, longitude }
// 1. Look up emergency_contacts for userId
// 2. For each contact, send SMS via Twilio (or email via SendGrid)
//    with message: "EMERGENCY — {user.full_name} needs help. Location: https://maps.google.com/?q={lat},{lng}"
// 3. Log the SOS event in an sos_events table
// 4. Return { success: true, contactsNotified: count }
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:8080
```

## Future Enhancements

- Enable Lovable Cloud for persistent database, auth & edge functions
- Google Maps integration for live Safe Route directions
- Push notifications for SOS alerts
- End-to-end encryption for health data
- Community safety alerts with incident mapping

## License

MIT
