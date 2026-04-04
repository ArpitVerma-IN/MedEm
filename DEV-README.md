# 🛠️ MedEm: Developer Documentation & Architecture Guide

Welcome to the developer documentation for MedEm. This guide contains intricate details about our frameworks, real-time node workings, technical specifications, staging vs local deployment procedures, and future architectural phases for open-source contributors.

---

## 🏗️ Core Architecture & Technical Specifications

MedEm is an advanced minimum viable prototype designed to evaluate live-tracking infrastructure at scale. By pairing strict **HTML5 Geolocation** pipelines directly with persistent **WebSockets**, it enables real-time sub-second coordinate streaming between decoupled client devices.

### 1. Emergency Broadcast System & Geofencing
- **Stateful Role Context:** The application distinctively mounts either a Patient or Doctor React tree based on the initial authenticated state.
- **Dynamic SOS Radius:** Responders configure geospatial operating bounds (`500m Urban`, `1km Semi-Urban`, or `2km Rural`). Patient SOS payloads are strictly evaluated against these geofences on the backend utilizing Haversine distance formulas before broadcasting to specific Socket.io rooms, ensuring O(n) targeted socket emission rather than O(n^2) global network flooding.
- **Automated Lifecycle Disengagement:** When a responding doctor's GPS coordinates intersect within a `40-meter` physical geofence of the tracking patient, system intelligence automatically disengages the SOS state on both clients, destructs active Socket stream listeners, and commits a secure 10-star rating receipt to the persistent history layer.
- **Density Heartbeats:** When an SOS is inactive, the tracking module calculates regional coverage density via anonymous heartbeat pings. It renders a real-time awareness banner (e.g., `In the rescue zone of 3 doctors`) directly onto the Patient DOM without ever exposing precise Responder Lat/Lng matrices to the public.

### 2. Live Navigation Assist (OSRM & Nominatim)
- **Live Polyline Routing:** Responders activating navigation trigger the `Project OSRM API` to calculate and map a highly visible SVG trajectory tracing the fastest road network route to the targeted coordinates.
- **Smart Clinic Locator:** If a Patient SOS finds no active responders, the engine dynamically queries OpenStreetMap via the advanced `Overpass API` for verified medical entities (`amenity=hospital | clinic`) within a 20km radius. Results are piped through the OSRM Driving Distance API, sorted by real driving distance, and injected into the Patient UI.
- **Optimized Leaflet Map Switching:** The CartoDB vector map transitions mathematically through *Collapsed*, *Mini-Modal*, and *Fullscreen* heights. A Memory Conservation Cache actively pauses and destructs heavy Leaflet DOM elements 30 seconds after navigation is toggled off to resolve memory leakage on low-end mobile devices.

### 3. AES-256-CBC End-to-End Encryption (E2EE)
- **Private Medical Sockets:** All real-time messaging is secured utilizing a polymorphic drop-in of the native NodeJS `crypto` module, safely executing over Vite polyfills within the browser sandbox. Chat strings are cryptographically converted into unreadable AES-256-CBC ciphertext inside the client's memory *before* transmission. The WebSocket Node server operates strictly as a blind relay schema, entirely incapable of reading the payloads.
- **Hardened Origin Configurations:** The live Socket server is locked down utilizing origin `cors` protection mechanisms masking out unrecognized headers. Real-time data routing prevents bad actors from sweeping broad latitude/longitude data.

### 4. Progressive Dashboard & Offline Capabilities
- **Modular Code-Splitting & Granular Fault Tolerance:** Features massive JavaScript bundle minimizations using `React.lazy` and localized `<Suspense>` boundaries wrapped meticulously inside rigid `<ErrorBoundary>` structures. Heavy interactive maps and history logs are decoupled from the main thread. If a chunk dynamically fails to load due to mobile connectivity drops, the rest of the application interface survives elegantly without crashing the root DOM tree.
- **Aggressive Memoization:** Highly reactive Cartographic DOM nodes (e.g., `LiveTrackingMap`) are rigorously wrapped in `React.memo()`, preventing hundreds of unneeded coordinate diffs whenever outer navigation layout components update.
- **Workbox Service Workers:** Custom `vite-plugin-pwa` configurations generate Google Workbox deployment agents that aggressively cache the application shell and React bundles inside the browser's hidden storage. This ensures the app UI instantly boots completely offline.

---

## 🚀 How to Deploy (Step-by-Step)

> [!WARNING]
> **Production deployment requires foundational cloud architecture knowledge.**

Because this web architecture strictly relies on both a persistent WebSockets backend and an SSL-secured frontend UI (which is mandatory for browser Geolocation APIs), this application must be split-deployed across two free cloud providers: **Render** and **Netlify**.

### Step 1: Push Code to GitHub
Ensure this entire repository is successfully uploaded into a remote GitHub repository.

### Step 2: Deploy the Real-Time Backend (`Render.com`)
1. Create a free account at [Render](https://render.com).
2. Go to your Dashboard → Click **New +** → Select **Web Service**.
3. Link your GitHub Repo.
4. Apply the following settings:
    - **Language:** Node
    - **Build Command:** `npm install`
    - **Start Command:** `npm run server`
5. Click **Deploy Web Service** at the bottom.
6. **⚠️ SAVE THE URL:** Once it goes live, safely copy the resulting `.onrender.com` URL (Example: `https://medem-io82.onrender.com`).

### Step 3: Deploy the React Frontend (`Netlify.com`)
1. Create a free account at [Netlify](https://app.netlify.com/).
2. Click **Add new site** → **Import an existing project**.
3. Select your GitHub Repo.
4. **⚠️ CRITICAL - Add Environment Variable:**
   - Before clicking the final deploy, click `Show advanced` or navigate to environment variables inside the Site config!
   - Under your environments, create a New Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** *Paste the exact Render URL you copied in Step 2.*
5. Leave everything else default (Netlify handles `npm run build` natively via the included `netlify.toml`).
6. Click **Deploy Site**.

Once Netlify supplies your live HTTPS URL, send it to any mobile device in the world to begin tracking!

---

## 💻 Local Developer Mode (Wi-Fi Testing)

If you simply wish to clone and test this locally between an iPhone and your Laptop on a home router without deploying to the cloud:

1. **Terminal 1 (Backend WebSocket Server):**
   ```bash
   npm install
   npm run server
   ```
2. **Terminal 2 (React Frontend Server):**
   ```bash
   npm run dev -- --host
   ```
*(Note: Using the `--host` flag forcibly exposes Vite to your local area network (LAN).*

3. Find your PC's IP address (e.g., `192.168.1.5`).
4. On your mobile phone, open Safari/Chrome to `http://192.168.1.5:5173`. 

---

## 🔮 Further Updates & Architectural Roadmap

To evolve this prototype into a full-fledged, production-ready healthcare application, the following updates have been divided into architectural phases. This layered approach ensures that new features integrate seamlessly with previous updates without requiring major codebase rewrites.

### Phase 1: Native Mobile Experience & Design
**Focus:** Enhancing the core User Interface (UI) and User Experience (UX), particularly for mobile devices.
- **Separate Portals:** Create distinctly generalized, separate app screens tailored specifically for the intuitive needs of **Patients** and **Doctors**.
- **Interactive UI:** Implement a modern, dynamic, and highly interactive application design philosophy prioritizing ease of use during high-stress scenarios.
- **Tech Stack:** 
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#) [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](#)

### Phase 2: Authentication & Secure Infrastructure [ACTIVE]
**Focus:** Implementing a robust, secure data foundation and user login system.
- **[Live] Secure Email Architecture:** Explicit Supabase-driven email authentication interfaces (`LoginPage`, `SignupPage`, `ResetPassword`) structurally routing and managing session lifecycles natively.
- **[Live] Dual-Database Architecture:** Segregation of data completely utilizing `supabaseClient` and relational `public.profiles` schemas mapping verified users logically away from the public Node WSS relay.
- **Security-First:** Embedded secure design philosophies seamlessly capturing explicit role states (`Patient` / `Doctor`) within isolated Context boundaries.
- **Next Up:** OAuth integration (Google Provider).
- **Tech Stack:** 
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](#) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)

### Phase 3: AI Verification & Medical Records Management
**Focus:** Elevating trust, safety, and operational efficiency using artificial intelligence.
- **Doctor Verification:** Systematically collect and verify legitimate doctor details, medical certificates, and other legal documentation.
- **AI Authentication:** Use advanced AI models to authenticate and validate uploaded patient/doctor documentation securely and seamlessly.
- **Smart Patient History:** Retrieve authentic past medical records and use modern APIs (like Google Gemini) to generate instantaneous, easy-to-read emergency summaries for incoming doctors.
- **Tech Stack:** 
  [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](#) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#) [![Tesseract OCR](https://img.shields.io/badge/Tesseract_OCR-000000?style=for-the-badge&logo=tesseract&logoColor=white)](#)

### Phase 4: Data Privacy & Account Lifecycle
**Focus:** Giving users total control over their data footprint in compliance with modern privacy standards.
- **Account Deletion:** Provide a seamless ability within the app interface for users to permanently delete their account, details, and location data from the server based on user requests.
- **Abuse Prevention Retention:** Soft-retain a minimal record (like an obscured hash of an email) post-deletion. This allows the system to inform the user if they attempt to reuse the exact same credentials to exploit new-user promotions in the future.
- **Tech Stack:** 
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#) 

> [!NOTE]
> **Active Integrations Tracking:** Dynamic uninitialized boilerplate architectures (`src/core/auth/AuthContext.tsx`, `src/core/api/supabaseClient.ts`, and core security boundaries) were fully activated in the latest release. Next iterations will target scaling `src/services/ai.ts` cleanly. 

---

## 📄 Return to Consumer Information
Are you just looking to use MedEm or learn about its basic user-facing features? Return to the main [README.md](./README.md).
