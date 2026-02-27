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

        navigate(`/${userType.toLowerCase()}`, {
            state: { name: name.trim() }
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-800/80 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-3xl p-8 flex flex-col gap-6 text-center">
                <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-med-DEFAULT/20 text-med-light rounded-full flex items-center justify-center shadow-inner">
                        <Map size={32} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">MedEm</h1>
                    <p className="text-slate-400 text-sm leading-relaxed">Select your portal to enter the emergency responder network.</p>
                </div>

                <form onSubmit={handleJoin} className="flex flex-col gap-4">
                    <input
                        type="text"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-600 bg-slate-900/50 text-white text-base placeholder-slate-500 focus:outline-none focus:border-med-DEFAULT focus:ring-2 focus:ring-med-DEFAULT/20 transition-all font-inter"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        maxLength={15}
                        required
                    />

                    <div className="flex gap-4 justify-center mt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium hover:text-white transition-colors">
                            <input
                                type="radio"
                                checked={userType === 'Patient'}
                                onChange={() => setUserType('Patient')}
                                className="w-4 h-4 accent-med-DEFAULT"
                            />
                            Patient
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium hover:text-white transition-colors">
                            <input
                                type="radio"
                                checked={userType === 'Doctor'}
                                onChange={() => setUserType('Doctor')}
                                className="w-4 h-4 accent-med-DEFAULT"
                            />
                            Doctor
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-gradient-to-br from-med-DEFAULT to-med-dark hover:from-med-light hover:to-med-DEFAULT text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-med-DEFAULT/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                        disabled={!name.trim()}
                    >
                        Enter Portal
                    </button>
                </form>

                {/* Netlify Open Source Badge */}
                <div className="mt-8 flex justify-center">
                    <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform opacity-90 hover:opacity-100">
                        <img src="https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg" alt="Deploys by Netlify" className="h-8 shadow-sm rounded drop-shadow-md" />
                    </a>
                </div>
            </div>
        </div>
    );
};
