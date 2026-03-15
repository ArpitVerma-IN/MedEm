<div align="center">

<img src="public/logo.svg" width="120" style="margin-bottom: 20px;" alt="MedEm Logo"/>

# 🚑 MedEm: Emergency Responder Prototype
**A High-Performance Real-Time Location Tracking Application**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-FFB21C?style=for-the-badge&logo=lucide&logoColor=black)](https://lucide.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Web Crypto API](https://img.shields.io/badge/Web_Crypto_API-000000?style=for-the-badge&logo=w3c&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

*An interactive, low-latency live map to track and direct emergency responders directly to patients in need.*

**[Overview](#-overview)** | **[Features](#-key-features--architecture)** | **[Installation Guide](#-progressive-web-app-pwa-installation-guide)** | **[For Developers](#%EF%B8%8F-for-developers--contributors)** | **[Contributing](#-contributing--contact)**

</div>

---

## 📖 Overview

**MedEm** is an advanced minimum viable prototype for evaluating live-tracking infrastructure in large-scale medical applications. 

By pairing blazing-fast **HTML5 Geolocation** directly with **WebSockets**, it enables multiple remote users (Doctors and Patients) to stream their exact cross-global coordinates securely onto a dynamic leaflet map in real-time. 

Recently, MedEm achieved **Phase 1 UI/UX** modernization—boasting entirely independent, mobile-first responsive dashboards tailored explicitly for Patients and Responders using Tailwind CSS v4 and Framer Motion. This major update introduced persistent guest authentication, interactive sub-settings views, dynamic system dark/light theming, modular code-splitting for optimal performance across device capabilities, intelligent lazy loading for heavy component routes, and foundational tracking map enhancements fixing canvas responsiveness.

---

## ✨ Key Features & Architecture

### 📱 Independent Mobile-First Dashboards
- **Patient Portal:** A calming, deeply-colored indigo ecosystem focused on ease of use. Features a massive central "Medical Care" SOS button, an elastic Live Map that dynamically expands/minimizes, and an intuitive bottom navigation bar.
- **Responder (Doctor) Portal:** A high-contrast emerald interface built for rapid triage. It automatically pulls active SOS signals into a floating targeting console, allowing Doctors to instantly lock onto a patient's exact location.

### 🚑 Emergency Broadcast System (Interactive Geofencing)
- **Role Detection:** Upon login, users distinctly select to join as either a **Patient** or a **Doctor**.
- **Personalized SOS Radius:** Responders can explicitly set their operating bounds (`500m Urban`, `1km Semi-Urban`, or `2km Rural`) via the Responder Settings UI. Patient `"need medical care!"` SOS broadcasts are strictly isolated to map instances where the responding Doctor is exactly within their chosen dynamic geofence, preserving real-world transit realism.
- **Targeted Rescue Mode:** Doctors can triage patients. By accepting to assist a specific patient from their targeting UI, the system engages *only* that patient. It displays a live decreasing Approach Distance (`e.g., Tracking: 240 m`) for the Doctor, while broadcasting a private `A Doctor is on the way!` slide-up banner to the Patient.
- **Automated Rescue Logging & SOS Disengagement:** When a responding doctor physically enters within a 40-meter radius of the actively tracking patient, system intelligence automatically disengages the SOS state on both devices, cleans up heavy map markers, and securely drops a persistent detailed receipt of the encounter into the newly engineered 10-star secure rating History log.
- **Dynamic Emergency Density Network:** When a Patient's SOS is inactive, the tracking module securely listens to an anonymous backend heartbeat pinging calculating regional density. It renders an awareness banner (e.g. `You are currently in the rescue zone of 3 doctors...`) directly onto the Patient dashboard assuring coverage safely without ever exposing precise Responder coordinates.

### 🗺️ Real-Time Navigation Assist (OSRM & Nominatim)
- **Live Routing:** When Responders activate the navigation module, the app maps a highly visible Google-Maps style blue trajectory tracing the fastest road route directly to their targeted patient utilizing the robust Project OSRM API.
- **Smart Clinic Locator:** If a Patient initiates an SOS but no doctors are nearby, the app dynamically queries OpenStreetMap via the advanced Overpass API for verified medical clinics within a 20-kilometer radius. Found elements are then rapidly parsed through the OSRM Driving Distance API, sorting and feeding the top 3 nearest medical centers by true driving road-distance back to the Patient below the load screen.
- **Dynamic Compass Pin:** Replaces standard static avatars with dynamic heading-rotation arrow icons, correctly orientating identically to the Responder's real-world physical bearing.
- **Map Context Switching:** 
  - *Mini-Map Mode* projects a clean Heads-Up Display showing just the `Time to Arrive (ETA)` pill and instantly Reverse-Geocodes the target's nearest regional Landmark beneath the canvas. 
  - *Fullscreen Mode* deploys a collapsible, detailed turn-by-turn navigation pane alerting responders to precise distance-to-intersection metrics and upcoming road maneuvers.
- **Memory Conservation Cache:** Actively pauses and destructs heavy location-routing DOM elements 30 seconds after navigation is toggled off, cleanly resolving memory pollution on lower-end devices while preserving states through accidental double-taps.
### 🔒 AES-256-CBC End-to-End Encryption (E2EE) & Network Shielding
- **Private Medical Communications:** MedEm secures all real-time messaging between victims and responders utilizing a deeply-integrated polymorphic drop-in of the native **NodeJS `crypto` module** safely executing over Vite polyfills across the WebSocket layer. Messages are cryptographically converted into unreadable AES-256-CBC ciphertext securely within the device memory before they even hit the server, ensuring rapid encryption avoiding restrictive browser `window.crypto` contexts. The backend operates identically as a blind relay.
- **Anti-Spoofing & WebSocket Hardening:** The live Socket server is locked down utilizing origin `cors` protection mechanisms masking out any unrecognized requests. Real-time data routing prevents bad actors from sweeping broad latitude/longitude data. Patients only natively broadcast emergency coordinates to verified local Doctors, and Doctors exclusively stream location only to the specific patient they are rescuing.

### 🌐 Tripartite Elastic Map Elements & Responsive Architecture
- **Mobile Real-Estate Constraints:** The live Map transitions seamlessly through three states (*Collapsed*, *Mini-Modal*, and *Fullscreen*). It features newly rebuilt layout logic mapping independent Dark Mode/Light Mode toggles directly to CartoDB vector endpoints, minimizing visual strain in nighttime environments.
- **Dynamic Canvases:** The dashboard headers operate on highly responsive flex-driven sticky canvases that seamlessly overlapping under main elements instead of rigid hardcoding, automatically stretching correctly for any future "announcements/alerts" without breaking UI scale or causing z-index component freezing.
- **Aggressive Code-Splitting optimization:** Features massive bundle size minimizations using `React.lazy` and strict `<Suspense>` boundaries. Visitors do not load massive chunk-heavy interactive maps, history logs, or AI verification routes until explicitly invoked, securing lightning-cast initial TTFB (Time To First Byte).

### ⚡ Technology Stack
- **Frontend Framework:** React 19 + TypeScript (Powered by Vite)
- **Aesthetic System:** Tailwind CSS v4 + Framer Motion + Lucide-React SVGs
- **Live Connection Layer:** Socket.IO / WebSockets (Client & Server)
- **Security:** Native Web Crypto API (AES-256-CBC) + Rate Limiting & Auth Tokens
- **Cartography Engine:** React-Leaflet + Leaflet.js
- **Backend Infrastructure:** Express server running dynamically on Node.js

---

## 📱 Progressive Web App (PWA) Installation Guide

MedEm is designed as a fully responsive, mobile-first web ecosystem. For the absolute best, fullscreen native-app experience without browser URL bars taking up screen space, users should install the app directly to their home screens using Google Chrome.

### Android Installation (via Google Chrome)
1. Open the live MedEm HTTPS URL in **Google Chrome** on your Android device.
2. Tap the **Three Dots (⋮)** menu icon in the top right corner.
3. Select **"Add to Home screen"** or **"Install app"**.
4. Confirm the installation. MedEm will now appear in your app drawer and launch fluidly in fullscreen mode.

### iOS Installation (via Safari or Chrome)
1. Open the live MedEm HTTPS URL in **Safari** (or Chrome) on your iPhone/iPad.
2. Tap the **Share** icon (the square with an arrow pointing up) at the bottom center of the screen.
3. Scroll down and tap **"Add to Home Screen"** (you may need to swipe up slightly to see it).
4. Tap **Add** in the top right corner. The MedEm icon will now sit alongside your native iOS apps.

> [!TIP]
> Launching MedEm via the Home Screen shortcut guarantees maximum screen real estate for the tracking map and guarantees smoother background geolocation API transitions on mobile devices.

---

## 🛠️ For Developers & Contributors

Are you an open-source contributor, developer, or systems architect looking to deploy MedEm locally, evaluate the networking constraints, or contribute to upcoming architectural Roadmaps (Auth, AI Inference, Database scaling)? 

👉 **[Read the comprehensive Developer Documentation (DEV-README.md)](./DEV-README.md)**

---

## 🤖 AI Assist API Keys (Phase 3)

MedEm's upcoming Phase 3 AI Inference Engine utilizes a 2-stage roll-out architecture. To use the **MVP / Demo Mode**, you can securely supply your own LLM API Key in the Patient Account Settings. Your key is stored securely in your local browser storage and is never sent to our servers.

To generate your own API key to use with the MedEm AI Assistant, click on the respective provider below:
*  **[Google Gemini (Recommended & Free Tier)](https://aistudio.google.com/app/apikey)**
*  **[Anthropic Claude](https://console.anthropic.com/)**
*  **[OpenAI](https://platform.openai.com/api-keys)**

---

## 🤝 Contributing & Contact

I actively welcome open-source developers to contribute to this project! If you find MedEm's core mission compelling, feel free to submit Pull Requests, or open Issues for new feature suggestions or bug fixes. Let's build a better, faster, and more robust emergency tracking platform together!

### 💖 Support the Project
If you find this open-source prototype valuable and would like to fund its continued scaling, infrastructure, and server development, please reach out directly to the developer using the contact links below.

Connect with me using the links below:

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ArpitVerma-IN)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/varpit/)
[![StackOverflow](https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)](https://stackoverflow.com/users/22130957/varpit)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:red.litmus214@passinbox.com)
