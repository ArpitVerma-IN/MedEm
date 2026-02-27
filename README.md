<div align="center">

# 🚑 MedEm: Emergency Responder Prototype
**A High-Performance Real-Time Location Tracking Application**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

*An interactive, low-latency live map to track and direct emergency responders directly to patients in need.*

</div>

---

## 📖 Overview

**MedEm** is an advanced minimum viable prototype for evaluating live-tracking infrastructure in large-scale medical applications. 

By pairing blazing-fast **HTML5 Geolocation** directly with **WebSockets**, it enables multiple remote users (Doctors and Patients) to stream their exact cross-global coordinates securely onto a dynamic leaflet map in real-time. Recently, MedEm achieved **Phase 1 UI/UX** modernization—boasting entirely independent, mobile-first responsive dashboards tailored explicitly for Patients and Responders using Tailwind CSS and Framer Motion.

---

## ✨ Key Features & Architecture

### 📱 Independent Mobile-First Dashboards
- **Patient Portal:** A calming, deeply-colored indigo ecosystem focused on ease of use. Features a massive central "Medical Care" SOS button, an elastic Live Map that dynamically expands/minimizes, and an intuitive bottom navigation bar.
- **Responder (Doctor) Portal:** A high-contrast emerald interface built for rapid triage. It automatically pulls active SOS signals into a floating targeting console, allowing Doctors to instantly lock onto a patient's exact location.

### 🚑 Emergency Broadcast System (500m Geofence)
- **Role Detection:** Upon login, users distinctly select to join as either a **Patient** or a **Doctor**.
- **Dynamic Alerts:** If a Patient securely declares they `"need medical care!"` and actively enters a **500-meter radius** of a logged-in Doctor, the Doctor's dashboard triggers an emergency state—deploying red banners and aggressively pulsating map markers to draw direct attention to the patient's coordinates.
- **Targeted Rescue Mode:** Doctors can triage patients. By accepting to assist a specific patient from their targeting UI, the system engages *only* that patient. It displays a live decreasing Approach Distance (`e.g., Tracking: 240 m`) for the Doctor, while broadcasting a private `A Doctor is on the way!` slide-up banner to the Patient.
- **Tripartite Elastic Map:** To conserve screen real-estate on mobile phones, the Live Map transitions beautifully through three fluid states: *Collapsed* (battery-saving), *Mini-Modal* (boxed contextual overview), and *Fullscreen* (tactical navigation).

### ⚡ Technology Stack
- **Frontend Framework:** React 19 + TypeScript (Powered by Vite)
- **Aesthetic System:** Tailwind CSS v4 + Framer Motion + Lucide-React SVGs
- **Live Connection Layer:** Socket.IO / WebSockets (Client & Server)
- **Cartography Engine:** React-Leaflet + Leaflet.js
- **Backend Infrastructure:** Express server running dynamically on Node.js

---

## 🚀 How to Deploy (Step-by-Step)

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

If you simply wish to clone and test this locally between an iPhone and your Laptop on a home router:

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

## 🔮 Further Updates & Roadmap

To evolve this prototype into a full-fledged, production-ready healthcare application, the following updates have been divided into architectural phases. This layered approach ensures that new features integrate seamlessly with previous updates without requiring major codebase rewrites.

### Phase 1: Native Mobile Experience & Design
**Focus:** Enhancing the core User Interface (UI) and User Experience (UX), particularly for mobile devices.
- **Separate Portals:** Create distinctly generalized, separate app screens tailored specifically for the intuitive needs of **Patients** and **Doctors**.
- **Interactive UI:** Implement a modern, dynamic, and highly interactive application design philosophy prioritizing ease of use during high-stress scenarios.
- **Tech Stack:** 
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#) [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](#)

### Phase 2: Authentication & Secure Infrastructure
**Focus:** Implementing a robust, secure data foundation and user login system.
- **Secure Login:** Integration of secure login for doctors and patients using either native credentials (ID/Password) or secure OAuth providers (Google, etc.).
- **Dual-Database Architecture:** Segregation of data. Utilize a dedicated authentication provider for login credentials, and a separate, secure, free NoSQL/SQL database for storing private user app data (ensuring strict data safety mimicking Render/Netlify's ease of deployment).
- **Security-First:** Embed secure design philosophies (e.g., JWT rotation, strict CORS, rate limiting) directly into the API architecture.
- **Tech Stack:** 
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](#) [![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](#) [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

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

### 📋 Roadmap Summary

| Phase | Title | Brief Summary |
|-------|-------|---------------|
| **1** | **Native UI/UX** | Split Doctor/Patient portals with a modernized, mobile-first interactive design. |
| **2** | **Secure Data Layer** | Implement OAuth logins, secure isolated databases, and hardened API architecture. |
| **3** | **AI Integration** | Automate credential verification and generate critical emergency AI patient summaries. |
| **4** | **Privacy Controls** | Develop self-service account deletion systems with integrated backend abuse protection. |
