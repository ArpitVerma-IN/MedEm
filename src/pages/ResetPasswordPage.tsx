import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../core/api/supabaseClient';

export const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Supabase specifically adds #access_token=... to the URL hash when redirecting from the recovery email.
    // If there's no hash, this page was hit directly without a token.
    useEffect(() => {
        if (!location.hash.includes('access_token')) {
            setErrorMsg("Invalid or missing recovery token. Please request a new password reset link.");
        }
    }, [location]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        try {
            // Push the new explicit password payload to the active session via Supabase 
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            setSuccessMsg(true);

            // Give them 3 seconds to see the success before safely bouncing to login.
            setTimeout(() => navigate('/login'), 3000);

        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (successMsg) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center border border-success/20 mb-6">
                        <ShieldCheck size={40} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Password Updated!</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">
                        Your account has been secured under the new password.
                    </p>
                    <p className="text-xs text-slate-400 font-bold mb-4">Redirecting you to Login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-inter overflow-hidden">
            <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 z-10 relative">
                <div className="flex flex-col items-center mb-2 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Create New Password</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-2">
                        Choose a strong, unique password to secure your MedEm account.
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold flex items-start gap-3 border border-red-100 dark:border-red-800/30">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || errorMsg?.includes('token')} // Disable if token is inherently invalid
                        className="mt-2 w-full bg-med hover:bg-med-dark text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 'Update Securely'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm mt-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};
