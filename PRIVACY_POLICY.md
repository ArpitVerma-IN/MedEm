# MedEm Privacy & Compliance Policy

**Effective Date:** April 2026  
**Applicability:** Global MedEm Tracking Network

MedEm is designed specifically for high-stress medical emergencies where speed and reliability are paramount. However, we believe that an individual's right to privacy and secure data handling are non-negotiable, particularly when streaming explicit physical location coordinates and sensitive health context.

Because MedEm utilizes the **Supabase Backend-as-a-Service (BaaS)** architecture paired with a customized Node.js relay, the application inherently adheres to strict modern data protection laws.

---

## 1. Compliance Standards Achieved (Phase 2 Architecture)

** MedEm is built strictly following the guidelines of the following international regulations:**

### GDPR (General Data Protection Regulation) & CCPA (California Consumer Privacy Act)
*   **Right to Erasure (Right to be Forgotten):** Users have the absolute right to purge their active records. Invoking the erasure tool dynamically deletes the user's explicit profile in the Supabase PostgreSQL instance via cascading deletion constraints.
*   **Right to Data Portability:** Users can securely request a JSON export compiled from the database history records via the authenticated user settings portal.
*   **Opt-In Tracking Explicitly:** Browser Geolocation APIs cannot be accessed natively without explicit, non-bypassable OS-level confirmation from the user at the exact moment of an emergency ping.

### HIPAA (Health Insurance Portability and Accountability Act)
*   **Protected Health Information (PHI) Isolation:** Through our stringent **Row Level Security (RLS)** PostgreSQL constraints, user metadata is strictly locked behind authenticated JWT (JSON Web Tokens). A Patient cannot mathematically query another Patient's history, preventing mass data leakage.
*   **Network Transmission (In-Transit Protection):** MedEm's core WebSocket communication protocol leverages a polymorphic AES-256-CBC cipher integration. Live coordinates are hashed and cryptographically secured natively within the device's RAM *before* reaching the Open Node Relay. The server acts exclusively as a blind relayer, fundamentally incapable of decoding the medical payload strings.
*   **Audit Logging Controls:** An active system interceptor flags system-level engagements, capturing the scope of login attempts to track account abuse matrices.

### ISO/IEC 27001 (Information Security Management)
*   Deployments leverage trusted and compliant third-party infrastructure. All relational state lives entirely on SOC2 and ISO-verified Supabase hardware boundaries, rather than highly vulnerable localized custom databases.

---

## 2. Ephemeral "Guest Mode" Retention

MedEm provides a strict, stateless "Guest Network" bypassing standard PostgreSQL JWT integration specifically for rapid demonstration purposes.
*   **Absolute Volatility:** All contextual history generated in Guest Mode exists locally via `localStorage` arrays scoped strictly inside the physical browser boundary instance. 
*   **Severance Mechanics:** The exact moment a user triggers "Sign Out" or the browser explicitly invalidates the service worker, the cache is instantly destroyed, leaving absolutely zero cloud traces of the rescue event mapping. 

## 3. Law Enforcement & Takedown Directives
MedEm currently utilizes a blind relay protocol and heavily leans on explicit client-side caching limits. We do not store decipherable chat keys within the central persistence database; thus, any external data seizure attempt upon the active server architecture will yield nullified AES cipher payloads. 

For all further compliance or ethical review inquiries, address the repository administrator directly by utilizing the provided contacts in the global `README.md`.
