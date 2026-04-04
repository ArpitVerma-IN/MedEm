import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as GuestIcon, Mail } from 'lucide-react';
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

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-inter overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-med/10 dark:bg-med/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-success/10 dark:bg-success-dark/10 blur-3xl rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 text-center z-10 relative"
            >
                {/* Logo & Headline */}
                <div className="flex flex-col items-center mb-2">
                    <div className="w-24 h-24 bg-med-50/50 dark:bg-med-900/20 text-med dark:text-med-light rounded-[28px] flex items-center justify-center shadow-inner border border-med-200 dark:border-med/20 mb-6 relative overflow-hidden">
                        <img src="/logo.svg" alt="MedEm Logo" className="w-16 h-16 relative z-10 drop-shadow-md" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 drop-shadow-sm">Med<span className="text-med">Em</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-4">Instant connection to the emergency responder network.</p>
                </div>

                {/* Authentication Buttons Workflow */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Primary Secure Action */}
                    <button
                        onClick={handleLoginClick}
                        className="w-full flex items-center justify-center gap-3 bg-med hover:bg-med-dark text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-md shadow-med/20"
                    >
                        <Mail className="w-5 h-5 opacity-90" />
                        Log In with MedEm
                    </button>

                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        Join Emergency Network
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
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-med focus:ring-2 focus:ring-med/20 transition-all"
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
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${userType === 'Patient' ? 'bg-white dark:bg-slate-700 text-med shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Patient
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserType('Doctor')}
                                        className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${userType === 'Doctor' ? 'bg-white dark:bg-slate-700 text-success shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Responder
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-1 w-full bg-med hover:bg-med-dark text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-med/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
