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

**MedEm** is an advanced minimum viable preview/prototype for evaluating live-tracking infrastructure in large-scale medical applications. 

By pairing blazing-fast **HTML5 Geolocation** directly with **WebSockets**, it enables multiple remote users (Doctors and Patients) to stream their exact cross-global coordinates securely onto a dynamic leaflet map in real-time, effectively simulating a rapid-response emergency broadcast network.

---

## ✨ Key Features & Architecture

### 🚑 Emergency Broadcast System (500m Geofence)
- **Role Detection:** Upon login, users distinctly select to join as either a **Patient** or a **Doctor**.
- **Dynamic Alerts:** If a Patient securely declares they `"need medical care!"` and actively enters a **500-meter radius** of a logged-in Doctor, the Doctor's dashboard triggers an emergency state—deploying red banners and aggressively pulsating map markers to draw direct attention to the patient's coordinates.
- **Targeted Rescue Mode:** Doctors can triage patients. By accepting to assist a specific patient from their dropdown UI, the system targets *only* that patient. It displays a live decreasing Approach Distance (`e.g., Active Rescue: 240 m`) for the Doctor, while broadcasting a calming `A Doctor is on the way!` banner privately only to the Patient.

### ⚡ Technology Stack
- **Frontend Framework:** React 19 + TypeScript (Powered by Vite)
- **Live Connection Layer:** Socket.IO / WebSockets (Client & Server)
- **Cartography Engine:** React-Leaflet + Leaflet.js
- **Aesthetic System:** Lucide-React SVG + Flexbox/Glassmorphism CSS overlays.
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
