import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../core/api/supabaseClient';
import { useAuth } from '../core/auth/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    // Already logged in? Send back to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            const dest = location.state?.from?.pathname || (user?.userType === 'Doctor' ? '/doctor' : '/patient');
            navigate(dest, { replace: true });
        }
    }, [isAuthenticated, navigate, location, user]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            // The AuthContext will catch the session change and trigger the dashboard redirect inherently!
            
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to authenticate');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-inter overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-med/10 dark:bg-med/5 blur-3xl rounded-full pointer-events-none" />
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-900/50 p-3 rounded-full backdrop-blur z-20">
                <ArrowLeft size={24} />
            </button>

            <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 z-10 relative">
                
                <div className="flex flex-col items-center mb-2">
                    <div className="w-20 h-20 bg-med-50/50 dark:bg-med-900/20 text-med rounded-[24px] flex items-center justify-center border border-med-200 dark:border-med/20 mb-4 opacity-90">
                        <Lock size={36} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Log in to reconnect with MedEm.</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold flex items-start gap-3 border border-red-100 dark:border-red-800/30">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Account Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end ml-1 mr-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-med hover:text-med-dark transition-colors">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 border-t-transparent animate-spin" /> : 'Log In Securely'}
                    </button>
                </form>

                <div className="text-center font-medium text-slate-500 dark:text-slate-400 mt-2">
                    New to MedEm? <Link to="/signup" className="text-med hover:text-med-dark font-bold ml-1">Create an account</Link>
                </div>
            </div>
        </div>
    );
};
