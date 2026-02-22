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
  isAcceptingHelp?: boolean;
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
  const [isAcceptingHelp, setIsAcceptingHelp] = useState(false);
  const [alertPatients, setAlertPatients] = useState<User[]>([]);
  const [incomingDoctors, setIncomingDoctors] = useState<User[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [myColor] = useState(getRandomColor());
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  // Keep an active reference of State for Reconnects
  const stateRef = useRef({ isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp });
  useEffect(() => {
    stateRef.current = { isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp };
  }, [isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp]);

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

    newSocket.on('user_updated', (user: User) => {
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

    // Handle transparent mobile reconnects
    newSocket.on('connect', () => {
      const state = stateRef.current;
      if (state.isJoined && state.myLocation && state.name) {
        newSocket.emit('join', {
          name: state.name.trim(),
          location: state.myLocation,
          color: state.myColor,
          userType: state.userType,
          needsCare: state.needsCare,
          isAcceptingHelp: state.isAcceptingHelp
        });
      }
    });

    return () => {
      newSocket.disconnect();
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []); // Empty dependency array ensures we only bind these once

  // Check for nearby patients needing care and incoming doctors
  useEffect(() => {
    if (!isJoined || !myLocation) return;
    const myLatLng = L.latLng(myLocation.lat, myLocation.lng);

    if (userType === 'Doctor') {
      const nearby: User[] = [];
      Array.from(users.values()).forEach(user => {
        if (user.userType === 'Patient' && user.needsCare && user.location) {
          const userLatLng = L.latLng(user.location.lat, user.location.lng);
          const distance = myLatLng.distanceTo(userLatLng);
          if (distance <= 500) nearby.push(user);
        }
      });
      setAlertPatients(nearby);
      setIncomingDoctors([]); // clear the other type
    } else if (userType === 'Patient' && needsCare) {
      const doctors: User[] = [];
      Array.from(users.values()).forEach(user => {
        if (user.userType === 'Doctor' && user.isAcceptingHelp && user.location) {
          const userLatLng = L.latLng(user.location.lat, user.location.lng);
          const distance = myLatLng.distanceTo(userLatLng);
          if (distance <= 500) doctors.push(user);
        }
      });
      setIncomingDoctors(doctors);
      setAlertPatients([]); // clear the other type
    }
  }, [users, myLocation, isJoined, userType, needsCare]);

  // Sync any dynamic status checks to all other users immediately
  useEffect(() => {
    if (socket && isJoined) {
      socket.emit('update_status', { isAcceptingHelp, needsCare });
    }
  }, [isAcceptingHelp, needsCare, socket, isJoined]);

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
          socket.emit('join', { name: name.trim(), location, color: myColor, userType, needsCare, isAcceptingHelp });

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
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
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
      <div className="ui-section">
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
          {alertPatients.length > 0 && userType === 'Doctor' && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle color="var(--danger)" size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                  {alertPatients.length} patient(s) need medical care nearby!
                </span>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'white', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={isAcceptingHelp}
                  onChange={(e) => setIsAcceptingHelp(e.target.checked)}
                  style={{ accentColor: 'var(--success)', width: '16px', height: '16px' }}
                />
                I am accepting to help
              </label>
            </div>
          )}

          {incomingDoctors.length > 0 && userType === 'Patient' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation color="var(--success)" size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                {incomingDoctors.length} Doctor(s) are on the way!
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

      <div className="map-section">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          zoomControl={false}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
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

            if (userType === 'Patient' && user.userType === 'Doctor') {
              const isIncoming = incomingDoctors.some(d => d.id === user.id);
              if (!isIncoming) return null; // hide doctor's location
            }

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
                  {user.needsCare ? "Needs Medical Care!" : (user.isAcceptingHelp ? "On the way to help" : "User's location")}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
