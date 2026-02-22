# Live Location Tracker 🌍

A beautiful, fully responsive **real-time location tracker** built as a minimum viable preview/prototype for evaluating live-tracking infrastructure in a larger tracking platform.

This application pairs **HTML5 Geolocation** directly with extremely low-latency **WebSockets** enabling multiple users on remote devices simultaneously see their exact whereabouts mirrored globally on a dynamic leaflet map in real-time.

---

## 🚀 Tech Stack

- **Frontend Framework:** React 19 + TypeScript powered by Vite
- **Real-Time Data Layer:** Socket.IO / WebSockets (Client & Server)
- **Map Rendering Engine:** React-Leaflet + Leaflet.js 
- **Icons & Styling:** Lucide-React + Raw Vanilla CSS utilizing Modern UI patterns (Glassmorphism & Flex layouts)
- **Backend Node Server:** Express + Node.js

---

## 🛠️ Deployment Flowchart (Render + Netlify)

Because this web application has split responsibilities (a Socket backend + a React frontend UI), deploying it professionally across devices requires running them seamlessly across two specialized infrastructure providers: Render (for always-on WebSocket connections) and Netlify (for blistering fast frontend CDN delivery).

### 1️⃣ Step 1: Deploy Backend to Render
1. Open [Render.com](https://render.com) and sign in.
2. Go to your Dashboard → Click **New +** → Select **Web Service**.
3. Link your GitHub Repo (`ArpitVerma-IN/MedEm`).
4. Apply the following settings:
    - **Language:** Node
    - **Build Command:** `npm install`
    - **Start Command:** `npm run server`
5. Click **Deploy Web Service** at the bottom.
6. *Wait for the deployment to finish.* Once green, copy the `.onrender.com` URL Render grants you (e.g. `https://medem-io82.onrender.com`).

### 2️⃣ Step 2: Set Up Netlify Variables & Deploy
1. Open [Netlify.com](https://app.netlify.com/) and sign in.
2. Click **Add new site** → **Import an existing project**.
3. Select your GitHub Repo (`ArpitVerma-IN/MedEm`).
4. **⚠️ CRITICAL:** Before clicking deploy, click on `Show advanced` or navigate to environment variables inside the Site config!
5. Add a New Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** *Paste the Render URL you copied in Step 1 (e.g. `https://medem-io82.onrender.com`)*
6. Leave everything else default (Netlify handles `npm run build` natively via the included `netlify.toml`).
7. Click **Deploy Site**.

### 3️⃣ Step 3: Global Device Usage
Once Netlify gives you the live Frontend URL (e.g., `https://lovely-medem-123.netlify.app`), this app can now be run **globally**:
* Send the Netlify link to a mobile device.
* The mobile browser will trigger the standard Geolocation prompt (SSL/HTTPS is mandatory for this prompt, which Netlify provides natively).
* The user types their name, clicks join, and securely pushes their coordinates securely out to Render!

---
## 💻 Local Wi-Fi Development

If you simply want to test this between two devices sitting on the same local network router:

1. **Start the backend:** Ensure Terminal 1 is running `npm run server`.
2. **Start the frontend:** Ensure Terminal 2 is running `npm run dev -- --host` (Vite requires the `--host` flag to broadcast off localhost locally).
3. Find your PC's IP address (e.g., `192.168.1.5`).
4. On your mobile device connected to the same Wi-Fi, go to: `http://192.168.1.5:5173`.
5. *Note: Geolocation testing over raw HTTP locally (non-localhost) occasionally requires manual browser override flags depending on iOS/Android.*
