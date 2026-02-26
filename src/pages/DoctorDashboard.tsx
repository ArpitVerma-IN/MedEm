import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation, Locate, AlertTriangle } from 'lucide-react';
import { useLiveTracker } from '../hooks/useLiveTracker';
import { LiveTrackingMap } from '../components/LiveTrackingMap';


const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const DoctorDashboard = () => {
    const routerState = useLocation().state as { name?: string } | null;
    const navigate = useNavigate();

    const [name] = useState(routerState?.name || '');
    const [myColor] = useState(getRandomColor());
    const [error, setError] = useState<string | null>(null);

    const [isJoined, setIsJoined] = useState(false);
    const [isAcceptingHelp, setIsAcceptingHelp] = useState(false);
    const [acceptingPatientId, setAcceptingPatientId] = useState<string | null>(null);

    const {
        myLocation,
        users,
        nearbyPatients,
        incomingDoctors,
        triggerJoin,
        setMyLocation
    } = useLiveTracker({
        name,
        userType: 'Doctor',
        myColor,
        isJoined,
        needsCare: false,
        isAcceptingHelp,
        acceptingPatientId,
        onError: setError,
        onJoinSuccess: () => setIsJoined(true)
    });

    useEffect(() => {
        if (!name) {
            navigate('/');
        } else if (!isJoined) {
            triggerJoin();
        }
    }, [name, isJoined, triggerJoin, navigate]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    const centerMapToMe = () => {
        if (myLocation) {
            setMyLocation({ ...myLocation });
        }
    };

    if (!isJoined && !error) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Connecting to emergency network...</div>;
    }

    if (error) {
        return (
            <div className="modal-overlay">
                <div className="glass-panel modal-content">
                    <h2 className="modal-title" style={{ color: 'var(--danger)' }}>Connection Error</h2>
                    <p>{error}</p>
                    <button className="primary-btn" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="ui-section">
                <div className="glass-panel header-content">
                    <div className="logo-icon">
                        <Navigation size={20} color="white" />
                    </div>
                    <div className="title-container">
                        <h1 className="app-title">Doctor Portal</h1>
                        <span className="app-subtitle">Active Responder Queue</span>
                    </div>
                </div>

                <div className="glass-panel users-panel">
                    {nearbyPatients.length > 0 && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle color="var(--danger)" size={20} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                                    {nearbyPatients.length} emergency patient(s) nearby
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                <select
                                    className="text-input"
                                    style={{ padding: '8px', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', cursor: 'pointer' }}
                                    value={acceptingPatientId || ''}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (selected) {
                                            setAcceptingPatientId(selected);
                                            setIsAcceptingHelp(true);
                                        } else {
                                            setAcceptingPatientId(null);
                                            setIsAcceptingHelp(false);
                                        }
                                    }}
                                >
                                    <option value="">Select patient to trace & respond...</option>
                                    {nearbyPatients.map(p => (
                                        <option key={p.user.id} value={p.user.id}>
                                            {p.user.name} ({formatDist(p.distance)} away)
                                        </option>
                                    ))}
                                </select>
                                {acceptingPatientId && nearbyPatients.find(p => p.user.id === acceptingPatientId) && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'block', textAlign: 'center', marginTop: '4px' }}>
                                        Tracking Approach Distance: {formatDist(nearbyPatients.find(p => p.user.id === acceptingPatientId)!.distance)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Active Tracker List ({users.size + 1})
                    </h3>
                    <div className="users-list">
                        <div className="user-item">
                            <div className="user-avatar" style={{ backgroundColor: myColor }}>{name.charAt(0).toUpperCase()}</div>
                            <div className="user-info">
                                <span className="user-name">Dr. {name} (You)</span>
                                <span className="user-status"><span className="status-dot"></span> Available Responder</span>
                            </div>
                            <button
                                onClick={centerMapToMe}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                            ><Locate size={18} /></button>
                        </div>
                        {Array.from(users.values()).map(user => (
                            <div className="user-item" key={user.id}>
                                <div className="user-avatar" style={{ backgroundColor: user.color }}>{user.name.charAt(0).toUpperCase()}</div>
                                <div className="user-info">
                                    <span className="user-name">{user.userType === 'Doctor' ? `Dr. ${user.name}` : user.name} ({user.userType})</span>
                                    <span className="user-status"><span className="status-dot" style={user.needsCare ? { background: 'var(--danger)' } : {}}></span> {user.needsCare ? "CRITICAL CARE" : "Online"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LiveTrackingMap
                myLocation={myLocation}
                name={name}
                userType="Doctor"
                myColor={myColor}
                needsCare={false}
                users={users}
                incomingDoctors={incomingDoctors}
                nearbyPatients={nearbyPatients}
                acceptingPatientId={acceptingPatientId}
            />
        </div>
    );
};
