import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { supabase } from '../core/api/supabaseClient';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);

    const navigate = useNavigate();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            // Note: Set 'redirectTo' to the exact production/local URL where ResetPasswordPage is hosted
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setIsSent(true);
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to request password reset');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-med/10 text-med rounded-full flex items-center justify-center border border-med/20 mb-6">
                        <CheckCircle size={40} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Reset Email Sent</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                        If an account exists for <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>, we have sent instructions to reset your password.
                    </p>
                    <Link to="/login" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-3.5 rounded-2xl transition-all block max-w-xs mx-auto shadow-md">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative font-inter overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-med/10 dark:bg-med/5 blur-3xl rounded-full pointer-events-none" />
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-900/50 p-3 rounded-full backdrop-blur z-20">
                <ArrowLeft size={24} />
            </button>

            <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 z-10 relative">
                <div className="flex flex-col items-center mb-2 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[24px] flex items-center justify-center border border-slate-200 dark:border-slate-700 mb-4 opacity-90 shadow-sm">
                        <KeyRound size={36} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-2">
                        Enter your verified email address and we'll send you a secure recovery link.
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold flex items-start gap-3 border border-red-100 dark:border-red-800/30">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleResetRequest} className="flex flex-col gap-5 w-full">
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

                    <button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="mt-2 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 border-t-transparent animate-spin" /> : 'Send Recovery Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};
