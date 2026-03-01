import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, User as GuestIcon, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage = () => {
    const [name, setName] = useState('');
    const [userType, setUserType] = useState<'Doctor' | 'Patient'>('Patient');
    const [showGuestForm, setShowGuestForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem('medem_guest_name');
        const storedType = localStorage.getItem('medem_guest_type');

        if (storedName && storedType) {
            navigate(`/${storedType.toLowerCase()}`, {
                state: { name: storedName }
            });
        }
    }, [navigate]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = name.trim();
        if (!finalName) return;

        localStorage.setItem('medem_guest_name', finalName);
        localStorage.setItem('medem_guest_type', userType);

        navigate(`/${userType.toLowerCase()}`, {
            state: { name: finalName }
        });
    };

    const handlePhase2Click = () => {
        alert("This authentication method will be available in Phase 2.");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-inter overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-med-DEFAULT/10 dark:bg-med-DEFAULT/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-success-DEFAULT/10 dark:bg-success-dark/10 blur-3xl rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 text-center z-10 relative"
            >
                {/* Logo & Headline */}
                <div className="flex flex-col items-center mb-2">
                    <div className="w-20 h-20 bg-med-100 dark:bg-med-900/40 text-med-DEFAULT dark:text-med-light rounded-[24px] flex items-center justify-center shadow-inner border border-med-200 dark:border-med-DEFAULT/20 mb-6 relative overflow-hidden">
                        <Map size={36} strokeWidth={2.5} className="relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Med<span className="text-med-DEFAULT">Em</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-4">Instant connection to the emergency responder network.</p>
                </div>

                {/* Authentication Buttons Workflow */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Next Phase OAuth Buttons */}
                    <button
                        onClick={handlePhase2Click}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        {/* Google G Logo SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={handlePhase2Click}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        Continue with Email
                    </button>

                    <div className="flex items-center gap-4 my-2">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                    </div>

                    <button
                        onClick={() => setShowGuestForm(!showGuestForm)}
                        className={`w-full flex items-center justify-center gap-3 font-bold py-3.5 rounded-2xl transition-all active:scale-95 ${showGuestForm ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'}`}
                    >
                        <GuestIcon className="w-5 h-5" />
                        Continue as Guest
                    </button>
                </div>

                {/* Collapsible Guest Form */}
                <AnimatePresence>
                    {showGuestForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <form onSubmit={handleJoin} className="flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-med-DEFAULT focus:ring-2 focus:ring-med-DEFAULT/20 transition-all"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                    maxLength={15}
                                    required
                                />

                                <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full">
                                    <button
                                        type="button"
                                        onClick={() => setUserType('Patient')}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${userType === 'Patient' ? 'bg-white dark:bg-slate-700 text-med-DEFAULT shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserType('Doctor')}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${userType === 'Doctor' ? 'bg-white dark:bg-slate-700 text-success-DEFAULT shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Responder
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-1 w-full bg-med-DEFAULT hover:bg-med-dark text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-med-DEFAULT/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!name.trim()}
                                >
                                    Enter Network
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Anchored Footer (Netlify Badge) */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-0">
                <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform opacity-60 hover:opacity-100">
                    <img src="https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg" alt="Deploys by Netlify" className="h-8 shadow-sm rounded drop-shadow-md" />
                </a>
            </div>
        </div>
    );
};
