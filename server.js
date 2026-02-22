import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

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
      acceptingPatientId: data.acceptingPatientId || null
    });

    // Send all existing users to the new user
    socket.emit('users', Array.from(users.values()));

    // Broadcast the new user to everyone else
    socket.broadcast.emit('user_joined', users.get(socket.id));
  });

  socket.on('update_location', (data) => {
    const user = users.get(socket.id);
    if (user) {
      user.location = data.location;
      users.set(socket.id, user);
      socket.broadcast.emit('user_updated', user);
    }
  });

  socket.on('update_status', (data) => {
    const user = users.get(socket.id);
    if (user) {
      if (data.isAcceptingHelp !== undefined) user.isAcceptingHelp = data.isAcceptingHelp;
      if (data.needsCare !== undefined) user.needsCare = data.needsCare;
      if (data.acceptingPatientId !== undefined) user.acceptingPatientId = data.acceptingPatientId;
      users.set(socket.id, user);
      socket.broadcast.emit('user_updated', user);
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
