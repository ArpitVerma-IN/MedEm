import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation, Locate } from 'lucide-react';
import { useLiveTracker } from '../hooks/useLiveTracker';
import { LiveTrackingMap } from '../components/LiveTrackingMap';


const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const PatientDashboard = () => {
    const routerState = useLocation().state as { name?: string } | null;
    const navigate = useNavigate();

    const [name] = useState(routerState?.name || '');
    const [myColor] = useState(getRandomColor());
    const [error, setError] = useState<string | null>(null);

    const [isJoined, setIsJoined] = useState(false);
    const [needsCare, setNeedsCare] = useState(false);

    const {
        myLocation,
        users,
        nearbyPatients,
        incomingDoctors,
        triggerJoin,
        setMyLocation
    } = useLiveTracker({
        name,
        userType: 'Patient',
        myColor,
        isJoined,
        needsCare,
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
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Connecting to network...</div>;
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
                        <h1 className="app-title">Patient Portal</h1>
                        <span className="app-subtitle">MedEm Responder</span>
                    </div>
                </div>

                <div className="glass-panel users-panel">
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--danger)', fontWeight: 600 }}>
                            <input
                                type="checkbox"
                                checked={needsCare}
                                onChange={(e) => setNeedsCare(e.target.checked)}
                                style={{ accentColor: 'var(--danger)', width: '18px', height: '18px' }}
                            />
                            I need medical care!
                        </label>
                    </div>

                    {incomingDoctors.length > 0 && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--success)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Navigation color="var(--success)" size={20} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                                    A Doctor is on the way!
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {incomingDoctors.map(d => (
                                    <span key={d.user.id} style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600, marginLeft: '28px' }}>
                                        Dr. {d.user.name} is {formatDist(d.distance)} away
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Active Users ({users.size + 1})
                    </h3>
                    <div className="users-list">
                        <div className="user-item">
                            <div className="user-avatar" style={{ backgroundColor: myColor }}>{name.charAt(0).toUpperCase()}</div>
                            <div className="user-info">
                                <span className="user-name">{name} (Patient - You)</span>
                                <span className="user-status"><span className="status-dot"></span> Sharing live location</span>
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
                                    <span className="user-name">{user.name} ({user.userType})</span>
                                    <span className="user-status"><span className="status-dot"></span> {user.needsCare ? "Needs care" : "Online"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LiveTrackingMap
                myLocation={myLocation}
                name={name}
                userType="Patient"
                myColor={myColor}
                needsCare={needsCare}
                users={users}
                incomingDoctors={incomingDoctors}
                nearbyPatients={nearbyPatients}
                acceptingPatientId={null}
            />
        </div>
    );
};
