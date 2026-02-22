import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import { Locate, Navigation, Map as MapIcon, AlertTriangle } from 'lucide-react';

// Create a custom hook to center the map on a location
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

// Types
interface Location {
  lat: number;
  lng: number;
}

interface User {
  id: string;
  name: string;
  location: Location;
  color: string;
  userType: 'Doctor' | 'Patient';
  needsCare: boolean;
}

// Generate random colors for users
const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// Custom marker icon creation
const createCustomIcon = (color: string, label: string, isFlickering: boolean = false) => {
  const customHtml = `
    <div class="custom-marker ${isFlickering ? 'flicker' : ''}">
      <div class="marker-pin" style="background-color: ${color};"></div>
      <div class="marker-icon">${label}</div>
    </div>
  `;

  return L.divIcon({
    html: customHtml,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'Doctor' | 'Patient'>('Patient');
  const [needsCare, setNeedsCare] = useState(false);
  const [alertPatients, setAlertPatients] = useState<User[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [myColor] = useState(getRandomColor());
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    // Connect to Socket.IO server (uses local network IP or deployed URL)
    const getBackendUrl = () => {
      if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
      if (window.location.hostname === 'localhost') return 'http://localhost:3001';
      return `http://${window.location.hostname}:3001`; // Allows local Wi-Fi testing
    };

    const newSocket = io(getBackendUrl());
    setSocket(newSocket);

    newSocket.on('users', (existingUsers: User[]) => {
      // Filter out self to prevent duplicate marker
      const filtered = existingUsers.filter(u => u.id !== newSocket.id);
      setUsers(new Map(filtered.map(u => [u.id, u])));
    });

    newSocket.on('user_joined', (user: User) => {
      if (user.id === newSocket.id) return;
      setUsers(prev => {
        const next = new Map(prev);
        next.set(user.id, user);
        return next;
      });
    });

    newSocket.on('user_location_updated', (user: User) => {
      if (user.id === newSocket.id) return;
      setUsers(prev => {
        const next = new Map(prev);
        next.set(user.id, user);
        return next;
      });
    });

    newSocket.on('user_left', (id: string) => {
      setUsers(prev => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Check for nearby patients needing care
  useEffect(() => {
    if (isJoined && userType === 'Doctor' && myLocation) {
      const nearby: User[] = [];
      const myLatLng = L.latLng(myLocation.lat, myLocation.lng);

      Array.from(users.values()).forEach(user => {
        if (user.userType === 'Patient' && user.needsCare && user.location) {
          const userLatLng = L.latLng(user.location.lat, user.location.lng);
          const distance = myLatLng.distanceTo(userLatLng);
          if (distance <= 500) {
            nearby.push(user);
          }
        }
      });
      setAlertPatients(nearby);
    } else {
      setAlertPatients([]);
    }
  }, [users, myLocation, isJoined, userType]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setMyLocation(location);
        setIsJoined(true);

        if (socket) {
          socket.emit('join', { name: name.trim(), location, color: myColor, userType, needsCare });

          // Start watching position
          watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
              const newLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              };
              setMyLocation(newLocation);
              socket.emit('update_location', { location: newLocation });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
          );
        }
      },
      (err) => {
        setError('Please allow location access to use the app.');
        console.error(err);
      }
    );
  };

  const centerMapToMe = () => {
    if (myLocation) {
      // Small trick to force MapController to trigger if myLocation is the same
      setMyLocation({ ...myLocation });
    }
  };

  if (!isJoined) {
    return (
      <div className="modal-overlay">
        <div className="glass-panel modal-content">
          <div className="modal-icon-container">
            <div className="modal-icon">
              <MapIcon size={32} />
            </div>
          </div>
          <div className="title-container">
            <h1 className="modal-title">Live Tracker</h1>
            <p className="modal-desc">Enter your name to share your location and see others.</p>
          </div>

          <form onSubmit={handleJoin} className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={15}
            />

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={userType === 'Patient'}
                  onChange={() => setUserType('Patient')}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                Patient
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={userType === 'Doctor'}
                  onChange={() => {
                    setUserType('Doctor');
                    setNeedsCare(false);
                  }}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                Doctor
              </label>
            </div>

            {userType === 'Patient' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', justifyContent: 'center', color: 'var(--danger)', fontWeight: 500, marginTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={needsCare}
                  onChange={(e) => setNeedsCare(e.target.checked)}
                  style={{ accentColor: 'var(--danger)', width: '18px', height: '18px' }}
                />
                I need medical care!
              </label>
            )}

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}
            <button type="submit" className="primary-btn" disabled={!name.trim()}>
              Join Tracker
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Find a default center if location is somehow missing
  const defaultCenter: [number, number] = myLocation ? [myLocation.lat, myLocation.lng] : [51.505, -0.09];

  return (
    <div className="app-container">
      <div className="floating-header">
        <div className="glass-panel header-content">
          <div className="logo-icon">
            <Navigation size={20} color="white" />
          </div>
          <div className="title-container">
            <h1 className="app-title">Live Tracker</h1>
            <span className="app-subtitle">Real-time Location</span>
          </div>
        </div>

        <div className="glass-panel users-panel">
          {alertPatients.length > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle color="var(--danger)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                {alertPatients.length} patient(s) need medical care nearby!
              </span>
            </div>
          )}
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Users ({users.size + 1})
          </h3>
          <div className="users-list">
            <div className="user-item">
              <div className="user-avatar" style={{ backgroundColor: myColor }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{name} ({userType} - You)</span>
                <span className="user-status">
                  <span className="status-dot"></span> Sharing live location
                </span>
              </div>
              <button
                onClick={centerMapToMe}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                title="Locate Me"
              >
                <Locate size={18} />
              </button>
            </div>

            {Array.from(users.values()).map(user => (
              <div className="user-item" key={user.id}>
                <div className="user-avatar" style={{ backgroundColor: user.color }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name} ({user.userType})</span>
                  <span className="user-status">
                    <span className="status-dot"></span> {user.needsCare ? "Needs care" : "Online"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={15}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {myLocation && <MapController center={[myLocation.lat, myLocation.lng]} />}

        {/* My Marker */}
        {myLocation && (
          <Marker
            position={[myLocation.lat, myLocation.lng]}
            icon={createCustomIcon(myColor, name.charAt(0).toUpperCase())}
          >
            <Popup>
              <strong>{name} ({userType} - You)</strong><br />
              {needsCare ? "Needs Medical Care!" : "Current location"}
            </Popup>
          </Marker>
        )}

        {/* Other Users' Markers */}
        {Array.from(users.values()).map(user => {
          if (!user.location || !user.location.lat || !user.location.lng) return null;

          let isFlickering = false;
          if (userType === 'Doctor') {
            isFlickering = alertPatients.some(p => p.id === user.id);
          }

          return (
            <Marker
              key={user.id}
              position={[user.location.lat, user.location.lng]}
              icon={createCustomIcon(user.color, user.name.charAt(0).toUpperCase(), isFlickering)}
            >
              <Popup>
                <strong>{user.name} ({user.userType})</strong><br />
                {user.needsCare ? "Needs Medical Care!" : "User's location"}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
