import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';

export const LandingPage = () => {
    const [name, setName] = useState('');
    const [userType, setUserType] = useState<'Doctor' | 'Patient'>('Patient');
    const navigate = useNavigate();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // Navigate and safely pass state 
        // Usually in BaaS this is an auth token, but for now we pass state.
        navigate(`/${userType.toLowerCase()}`, {
            state: { name: name.trim() }
        });
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <div className="modal-icon-container">
                    <div className="modal-icon">
                        <Map size={32} />
                    </div>
                </div>
                <div className="title-container">
                    <h1 className="modal-title">MedEm</h1>
                    <p className="modal-desc">Select your portal to enter the emergency responder network.</p>
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
                        required
                    />

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={userType === 'Patient'}
                                onChange={() => setUserType('Patient')}
                                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                            />
                            I am a Patient
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                checked={userType === 'Doctor'}
                                onChange={() => setUserType('Doctor')}
                                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                            />
                            I am a Doctor
                        </label>
                    </div>

                    <button type="submit" className="primary-btn" style={{ marginTop: '24px' }} disabled={!name.trim()}>
                        Enter Portal
                    </button>
                </form>
            </div>
        </div>
    );
};
