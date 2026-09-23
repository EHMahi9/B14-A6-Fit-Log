# 💪 FitLog — Workout Library & Daily Training Planner

> **Train with intent. Log every set.**  
> FitLog is a dark, high-performance, no-nonsense gym companion: pick a lift from the curated library, lock it into today's plan, track live session metrics, and build consistency.

---

## 🚀 Live Demo & Repository
- **Live URL**: [https://fit-log-mahi.vercel.app](https://fit-log-mahi.vercel.app)
- **GitHub Repository**: [https://github.com/EHMahi9/B14-A6-Fit-Log](https://github.com/EHMahi9/B14-A6-Fit-Log)

---

## 📖 Project Overview
**FitLog** is built for athletes, lifters, and fitness enthusiasts who value clean data and fast workflows. Inspired by minimalist gym notebooks and modern dark-mode aesthetic design (Penpot/Figma), FitLog gives you immediate access to major multi-joint compound lifts, bodyweight standards, and isolation exercises.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | React framework powering SSR/SSG, dynamic routing (`/workout/[id]`, `/my-plan`), layouts, and image optimization. |
| **React 19** | Modern declarative UI component architecture with `useSyncExternalStore` for SSR-safe persistent storage. |
| **Tailwind CSS v4** | Utility-first responsive styling, custom theme tokens (`#0c0d10`, `#15171d`, `#c2f800`), and dark aesthetic. |
| **TypeScript** | Type-safe interfaces for workout entities, plans, and state management. |
| **Lucide React** | Clean, consistent athletic and navigation iconography. |
| **LocalStorage API** | Browser storage synchronization ensuring user plans and saved lists survive reloads. |

---

## 🌟 Key Features (5+ Highlights)

### 1. 🏋️ Curated Movement Library (3x4 Responsive Grid)
- Directly fetches 12 fundamental muscle-building movements from the remote Cloudflare Workers API (`https://api.abcz.workers.dev/api/fitlog`).
- Displays comprehensive cards with workout photo, muscle group category tags (`CHEST`, `ARMS`, `LEGS`), equipment needed, duration, calories burned, and community ratings.
- Includes a live search bar and muscle group filter buttons to quickly find lifts.
- Responsive layout: collapses seamlessly from a 3-column desktop grid to 2-column tablet and 1-column mobile layouts.
- Skeleton loader placeholders provide visual feedback during asynchronous API requests.

### 2. 📊 Live Dynamic Navbar Badges & Metrics
- The sticky top navigation features real-time badge counters:
  - **Plan Badge**: Electric neon lime pill (`#c2f800`) reflecting the exact count of exercises in Today's Plan.
  - **Saved Badge**: Outlined bordered pill tracking saved exercises.
- Both badges link directly to `/my-plan`.
- In `/my-plan`, three live metric cards (`Exercises`, `Minutes`, `Calories`) calculate workout totals on the fly as lifts are added, removed, or completed.

### 3. 🛡️ Cap of 5 Lifts Rule (Smart Plan Guard)
- Strictly enforces the assignment's daily limit: *"Cap of five lifts for today. Finish them, then load more."*
- Disables the "Add to today's plan" button when the plan hits 5 lifts, preventing overtraining and keeping workouts focused.
- Visual warnings and toasts inform the user when the cap has been reached.

### 4. 📑 Two-Column Detail View & Step-by-Step Instructions
- Dedicated dynamic route (`/workout/[id]`) for every lift.
- **Left Column**: High-resolution exercise visual.
- **Right Column**:
  - Muscle group tags, lift title, and detailed anatomical description.
  - **Key Specs Table**: Structured overview of Equipment, Difficulty, Sets, Reps, Duration, Calories, and Rating.
  - **Numbered Instructions**: Step-by-step guidance for safe execution and form cues.
  - Direct action buttons: **Add to today's plan** and **Save for later**.

### 5. ⚡ Tabbed Plan Management with Real-Time Actions
- Seamless tab switching between **Today's Plan** and **Saved** workouts.
- **C1 Challenge — Multi-Criteria Sort**: "Sort By" dropdown re-orders current lifts by **Duration**, **Calories**, or **Rating** with a single click.
- **C3 Challenge — Mark as Done**: Interactive toggle with check icon strikes through completed exercises and triggers motivational toasts.
- **C3 Challenge — Remove (X)**: Easily discard workouts from the plan or saved list with live metric recalculation.
- **Empty State**: Displays custom gym illustration, "NOTHING HERE YET" messaging, and an immediate CTA button linking back to the library.

### 6. 💾 Persistent Offline-Ready Storage & Zero-Latency Toasts
- State is synchronized automatically to browser `localStorage` using React 19's `useSyncExternalStore` pattern to avoid hydration mismatch and cascading renders.
- Animated, non-intrusive toast notifications provide immediate feedback on every user interaction.

### 7. 🚫 Custom 404 Route & Deep Linking Safety
- Custom-built `not-found.tsx` styled to match the dark FitLog aesthetic.
- Reloading any page (`/`, `/workout/1`, `/my-plan`) works reliably after deployment without 404 or router crashes.

---

## 📡 API Endpoints

- **All Workouts**:
  ```
  GET https://api.abcz.workers.dev/api/fitlog
  ```
- **Single Workout Detail**:
  ```
  GET https://api.abcz.workers.dev/api/fitlog/:id
  ```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18.18+ or v20+ recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EHMahi9/B14-A6-Fit-Log.git
   cd B14-A6-Fit-Log
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build & Linting

```bash
# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🚢 Deployment

This project is optimized for zero-config deployment on **Vercel**, **Netlify**, or **Cloudflare Pages**:
1. Connect your GitHub repository to Vercel/Netlify.
2. The framework preset is automatically detected as **Next.js**.
3. Build command: `next build`
4. Output directory: `.next`

---

## 📄 License & Credits
© 2026 FitLog — Workout Library. Train hard, log honest.
