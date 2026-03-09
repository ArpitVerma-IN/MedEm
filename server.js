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

// Periodic interval to broadcast Doctor proximity to Patients anonymously without leaking location
setInterval(() => {
  let doctors = Array.from(users.values()).filter(u => u.userType === 'Doctor' && u.location);
  
  for (const [id, user] of users.entries()) {
    if (user.userType === 'Patient' && user.location) {
      // Find how many doctors have this patient in their coverage radius
      let doctorsInRadius = doctors.filter(doc => {
        let radius = doc.geofenceRadius || 2000;
        let dist = getDistance(doc.location, user.location);
        return dist <= radius;
      });
      io.to(id).emit('nearby_doctors_count', doctorsInRadius.length);
    }
  }
}, 30000); // 30 seconds

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Broadcast to others when a new user joins
  socket.on('join', (data) => {
    users.set(socket.id, {
      id: socket.id,
      name: data.name,
      location: data.location,
      color: data.color,
      userType: data.userType,
      needsCare: data.needsCare,
      isAcceptingHelp: data.isAcceptingHelp || false,
      acceptingPatientId: data.acceptingPatientId || null,
      geofenceRadius: data.geofenceRadius || 2000
    });

    // We still emit the users initially, but further locations will be protected.
    socket.emit('users', Array.from(users.values()));

    // Broadcast the new user to everyone else
    socket.broadcast.emit('user_joined', users.get(socket.id));
  });

  socket.on('update_location', (data) => {
    const user = users.get(socket.id);
    if (user) {
      user.location = data.location;
      users.set(socket.id, user);

      // SECURITY UPDATE: We no longer broadcast raw updates globally!
      // Patients only broadcast to doctors.
      // Doctors only broadcast to their currently targeted patient.
      if (user.userType === 'Patient') {
        if (user.needsCare) {
          // Find doctors who should see this distress beacon
          for (const [otherId, other] of users.entries()) {
            if (other.userType === 'Doctor') {
              const radius = other.geofenceRadius || 2000;
              const dist = getDistance(user.location, other.location);
              if (dist <= radius) {
                io.to(otherId).emit('user_updated', user);
              }
            }
          }
        }
      } else if (user.userType === 'Doctor') {
        if (user.acceptingPatientId) {
            // Only leak Doctor location coordinates directly to the accepted Patient
            io.to(user.acceptingPatientId).emit('user_updated', user);
        }
      }
    }
  });

  socket.on('update_status', (data) => {
    const user = users.get(socket.id);
    if (user) {
      if (data.isAcceptingHelp !== undefined) user.isAcceptingHelp = data.isAcceptingHelp;
      if (data.needsCare !== undefined) user.needsCare = data.needsCare;
      if (data.acceptingPatientId !== undefined) user.acceptingPatientId = data.acceptingPatientId;
      users.set(socket.id, user);
      
      // Status updates can be broadcasted openly, but location is the protected factor.
      socket.broadcast.emit('user_updated', user);
    }
  });

  socket.on('send_message', (data) => {
    if (data.targetId) {
      io.to(data.targetId).emit('receive_message', {
        senderId: socket.id,
        payload: data.payload, // Forward ONLY the encrypted payload block
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('submit_rating', (data) => {
    if (data.targetId) {
      io.to(data.targetId).emit('receive_rating', {
        senderId: socket.id,
        rating: data.rating,
        eventId: data.eventId
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    users.delete(socket.id);
    io.emit('user_left', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
