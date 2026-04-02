This updated README is polished, professional, and ready for your GitHub repository. I've removed references to platform-specific tools and replaced them with standard industry practices like **Supabase** or **Firebase** for backend services, ensuring the project feels robust and scalable.

---

# Her Shield — Health & Security Platform for Women

**Her Shield** is a privacy-first web application designed to empower women with emergency safety tools, health tracking, and security features. Built with a focus on speed, discretion, and reliability.

## 🚀 Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
* **State Management:** TanStack React Query, React Context
* **Routing:** React Router v6
* **Data Visualization:** Recharts
* **Animation:** Framer Motion
* **Backend (Ready for):** Supabase (Auth & Database) or Node.js/Express

## ✨ Features

### 1. Emergency SOS System (`/sos`)
* **Panic Button:** Instantly captures real-time GPS coordinates via the **Geolocation API** and prepares them for emergency contacts.
* **Siren:** Triggers a high-decibel alarm tone using the **Web Audio API** to deter threats.
* **Contact Management:** Securely store and manage emergency contacts in `localStorage` (migrating to database in production).

### 2. Health Dashboard (`/health`)
* **Cycle Tracker:** A calendar-based interface to log menstrual cycles and flow intensity.
* **Wellness Logs:** Record symptoms, daily moods, and personal notes.
* **Trend Analysis:** Visualizes health data using **Recharts** to identify patterns over time.

### 3. Security Toolkit (`/security`)
* **Safe Route Finder:** A UI shell prepared for **Google Maps API** integration to find well-lit, high-traffic pedestrian paths.
* **Hidden Camera Detector:** A magnetometer-based interface utilizing mobile hardware sensors to detect unusual magnetic frequencies.

### 4. Discreet Mode (Privacy First)
* **Instant Masking:** Use the hotkey **`Ctrl + Shift + D`** to instantly swap the app's UI for a generic news or weather site.
* **Dynamic Context:** Powered by `DiscreetModeContext`, this feature rebrands navigation labels, icons, and headers in milliseconds.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── AppLayout.tsx      # Core shell with responsive navigation
│   └── ui/                # Accessible shadcn/ui components
├── contexts/
│   └── DiscreetModeContext.tsx  # State management for privacy masking
├── pages/
│   ├── Index.tsx          # Main dashboard
│   ├── SOSPage.tsx        # Emergency tools
│   ├── HealthPage.tsx     # Health & wellness tracking
│   ├── SecurityPage.tsx   # Safety & hardware sensor tools
│   └── NotFound.tsx
├── App.tsx                # Application routing & provider tree
└── index.css              # Global styles & Tailwind configuration
```

---

## 📊 Database Schema (PostgreSQL)

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

---

## 🛠️ API Logic — SOS Trigger

The backend logic for the SOS trigger is designed to be deployed as a **Serverless Function** (e.g., AWS Lambda, Vercel Functions, or Supabase Edge Functions):

```typescript
// POST /api/sos
// Expected Body: { userId, latitude, longitude }

// 1. Fetch emergency_contacts for the specific userId
// 2. Integrate with Twilio API to send SMS:
//    "EMERGENCY — {user.full_name} needs help. 
//    Location: https://www.google.com/maps?q={lat},{lng}"
// 3. Log the incident in the 'sos_events' table for audit/safety
// 4. Return success status and notification count
```

---

## 🚦 Getting Started

1.  **Clone and Install:**
    ```bash
    git clone https://github.com/yourusername/her-shield.git
    cd her-shield
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## 🔮 Future Enhancements

* **Cloud Integration:** Full backend integration with **Supabase** for Auth and Real-time data.
* **Live Maps:** Google Maps API integration for live "Safe-Walking" directions.
* **Push Notifications:** Web-push alerts for emergency contacts.
* **E2E Encryption:** Implementing end-to-end encryption for all sensitive health data.

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
