import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://medem.netlify.app", "https://medem-network.web.app"] 
      : "*", 
    methods: ["GET", "POST"]
  }
});

// Security: Auth middleware protecting the WebSocket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token === "medem-secure-client-2026") {
    next();
  } else {
    next(new Error("Unauthorized Connection Attempt"));
  }
});

const users = new Map();

// 1. Data Integrity & Payload Sanitization
const isValidLocation = (loc) => {
  if (!loc || typeof loc !== 'object') return false;
  
  // Cast strictly to float to safely handle browser string-mocks
  const lat = parseFloat(loc.lat);
  const lng = parseFloat(loc.lng);
  
  if (isNaN(lat) || lat < -90 || lat > 90) return false;
  if (isNaN(lng) || lng < -180 || lng > 180) return false;
  
  // Enforce the types natively down the pipeline
  loc.lat = lat;
  loc.lng = lng;
  return true;
};

const sanitizeString = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim().substring(0, maxLength);
};

// 2. DDoS Protection & Rate Limiting (Token Bucket)
const activeRateLimits = new Map();
const checkRateLimit = (socketId, eventType, maxEventsPerSecond) => {
  const now = Date.now();
  if (!activeRateLimits.has(socketId)) activeRateLimits.set(socketId, {});
  
  const userLimits = activeRateLimits.get(socketId);
  if (!userLimits[eventType]) userLimits[eventType] = [];
  
  // Clean up pings older than 1 second
  userLimits[eventType] = userLimits[eventType].filter(time => now - time < 1000);
  
  if (userLimits[eventType].length >= maxEventsPerSecond) return false; // Block request
  
  userLimits[eventType].push(now);
  return true;
};

// Calculate distance between two points in meters (Haversine formula)
const getDistance = (loc1, loc2) => {
  if (!loc1 || !loc2) return Infinity;
  const R = 6371e3; // metres
  const φ1 = loc1.lat * Math.PI/180;
  const φ2 = loc2.lat * Math.PI/180;
  const Δφ = (loc2.lat - loc1.lat) * Math.PI/180;
  const Δλ = (loc2.lng - loc1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to calculate regional counts
const triggerNearbyDoctorsHeartbeat = () => {
  let doctors = Array.from(users.values()).filter(u => u.userType === 'Doctor' && u.location);
  
  for (const [id, user] of users.entries()) {
    if (user.userType === 'Patient' && user.location) {
      // Find how many doctors have this patient in their coverage radius (1x Zone)
      let doctorsInRadius = doctors.filter(doc => {
        let radius = doc.geofenceRadius || 2000;
        let dist = getDistance(doc.location, user.location);
        return dist <= radius;
      });
      io.to(id).emit('nearby_doctors_count', doctorsInRadius.length);
    }
  }
};

// Periodic interval to broadcast Doctor proximity to Patients anonymously without leaking location
setInterval(triggerNearbyDoctorsHeartbeat, 30000); // 30 seconds

// Security wrapper for emitting user location updates only to authorized bounds
const broadcastSecureLocationUpdate = (senderId, eventName = 'user_updated') => {
  const sender = users.get(senderId);
  if (!sender || !sender.location) return;

  if (sender.userType === 'Patient') {
    // Patients broadcast their ping securely only to Doctors inside a 2x Zone Perimeter
    for (const [otherId, other] of users.entries()) {
      if (other.userType === 'Doctor' && other.location) {
        const radius = other.geofenceRadius || 2000;
        const dist = getDistance(sender.location, other.location);
        
        // 2 * zone perimeter radius condition met:
        if (dist <= (radius * 2)) {
          io.to(otherId).emit(eventName, sender);
        }
      }
    }
  } else if (sender.userType === 'Doctor') {
    // Doctors broadcast their location only to the patient they are attempting to rescue
    if (sender.acceptingPatientId) {
       io.to(sender.acceptingPatientId).emit(eventName, sender);
    }
  }
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Broadcast to others when a new user joins
  socket.on('join', (data) => {
    if (!checkRateLimit(socket.id, 'join', 10)) return; // Max 10 join attempts per sec (React StrictMode mitigation)
    if (data.location && !isValidLocation(data.location)) return;

    const newUser = {
      id: socket.id,
      name: sanitizeString(data.name, 50),
      location: data.location,
      color: sanitizeString(data.color, 20),
      userType: data.userType === 'Doctor' ? 'Doctor' : 'Patient', // Strict Role Types
      needsCare: Boolean(data.needsCare),
      isAcceptingHelp: Boolean(data.isAcceptingHelp),
      acceptingPatientId: data.acceptingPatientId ? sanitizeString(data.acceptingPatientId, 50) : null,
      geofenceRadius: typeof data.geofenceRadius === 'number' && !isNaN(data.geofenceRadius) ? data.geofenceRadius : 2000
    };
    users.set(socket.id, newUser);

    // Initial Sync: Only sync authorized surrounding patients/doctors securely
    const safeUsers = [];
    for (const [otherId, other] of users.entries()) {
      if (otherId === socket.id) continue;
      
      if (newUser.userType === 'Doctor') {
         if (other.userType === 'Patient' && other.location && newUser.location) {
            const dist = getDistance(newUser.location, other.location);
            if (dist <= (newUser.geofenceRadius || 2000) * 2) {
                safeUsers.push(other);
            }
         }
      } else if (newUser.userType === 'Patient') {
         // Patients strictly only see the doctor currently rescuing them
         if (other.userType === 'Doctor' && other.acceptingPatientId === newUser.id) {
             safeUsers.push(other);
         }
      }
    }
    socket.emit('users', safeUsers);

    // Alert strictly relevant clients that this user joined securely!
    broadcastSecureLocationUpdate(socket.id, 'user_joined');
    
    // Instantly generate the passive doctor count ping
    triggerNearbyDoctorsHeartbeat();
  });

  socket.on('update_location', (data) => {
    if (!checkRateLimit(socket.id, 'update_location', 10)) return; // Max 10 GPS tracks per sec (to support rapid tracking watchPosition bursts)
    if (!data || !isValidLocation(data.location)) return;

    const user = users.get(socket.id);
    if (user) {
      user.location = data.location;
      users.set(socket.id, user);
      
      // SECURITY UPDATE: Only emit this explicitly verified location path instead of global!
      broadcastSecureLocationUpdate(socket.id, 'user_updated');
    }
  });

  socket.on('update_status', (data) => {
    if (!checkRateLimit(socket.id, 'update_status', 10)) return; // Max 10 status clicks per sec

    const user = users.get(socket.id);
    if (user) {
      if (data.isAcceptingHelp !== undefined) user.isAcceptingHelp = data.isAcceptingHelp;
      if (data.needsCare !== undefined) user.needsCare = data.needsCare;
      if (data.acceptingPatientId !== undefined) user.acceptingPatientId = data.acceptingPatientId;
      if (data.geofenceRadius !== undefined) user.geofenceRadius = data.geofenceRadius;
      
      users.set(socket.id, user);
      
      // Trigger status pushes down the exact identical secure geographic pipeline
      broadcastSecureLocationUpdate(socket.id, 'user_updated');
      
      // Rerun heartbeat to catch any new state drops
      triggerNearbyDoctorsHeartbeat();
    }
  });

  socket.on('send_message', (data) => {
    if (!checkRateLimit(socket.id, 'send_message', 5)) return; // Max 5 messages per sec
    
    if (data.targetId) {
      io.to(sanitizeString(data.targetId, 50)).emit('receive_message', {
        senderId: socket.id,
        payload: {
           ciphertext: sanitizeString(data.payload?.ciphertext, 5000),
           iv: sanitizeString(data.payload?.iv, 100)
        }, // Enforce structural encryption constraints

        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('submit_rating', (data) => {
    if (!checkRateLimit(socket.id, 'submit_rating', 1)) return; // Max 1 rating per sec

    if (data.targetId) {
      io.to(sanitizeString(data.targetId, 50)).emit('receive_rating', {
        senderId: socket.id,
        rating: typeof data.rating === 'number' && !isNaN(data.rating) ? data.rating : 5,
        eventId: sanitizeString(data.eventId, 100)
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    users.delete(socket.id);
    activeRateLimits.delete(socket.id); // Clear memory cache
    io.emit('user_left', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
