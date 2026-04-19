import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User as UserIcon, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase, signInWithGoogle } from '../core/api/supabaseClient';

export const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState<'Doctor' | 'Patient'>('Patient');
    const [medicalLicense, setMedicalLicense] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(false);

        try {
            // Register explicitly through Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: userType,
                        medical_license_number: medicalLicense || null,
                    }
                }
            });

            if (error) throw error;
            
            // Registration requires Email Confirmation by default in Supabase (Highly Recommended Workflow)
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                throw new Error("This email is already registered. Please Log In.");
            }

            setSuccessMsg(true);
            
        } catch (error: any) {
            setErrorMsg(error.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            setIsLoading(true);
            setErrorMsg(null);
            await signInWithGoogle();
        } catch (error: any) {
            setErrorMsg(error.message || 'Google registration failed');
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
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Registration Complete!</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                        We have sent a secure verification link to <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>. 
                        Please click the link in that email to fully activate your account.
                    </p>
                    <Link to="/login" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-3.5 rounded-2xl transition-all block max-w-xs mx-auto">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-10 px-4 relative font-inter overflow-y-auto">
            <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-900/50 p-3 rounded-full backdrop-blur z-20">
                <ArrowLeft size={24} />
            </button>

            <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[32px] p-8 flex flex-col gap-6 z-10 my-auto">
                <div className="flex flex-col items-center mb-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Join the MedEm Emergency Network</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold flex items-start gap-3 border border-red-100 dark:border-red-800/30">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
                    {/* Role Selector */}
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
                            Medical Responder
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

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

                    {userType === 'Doctor' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Medical License Number (Optional for Demo)</label>
                            <input
                                type="text"
                                value={medicalLicense}
                                onChange={(e) => setMedicalLicense(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-success focus:ring-2 focus:ring-success/20 transition-all outline-none"
                                placeholder="e.g. MD-123456"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:border-med focus:ring-2 focus:ring-med/20 transition-all outline-none"
                            placeholder="Create a strong password"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full bg-med hover:bg-med-dark text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 'Register Securely'}
                    </button>
                    
                    <div className="flex items-center gap-4 w-full">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or</span>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-3.5 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                        By registering, you agree to our Terms of Service and HIPAA Privacy Guidelines.
                    </p>
                </form>

                <div className="text-center font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
                    Already have an account? <Link to="/login" className="text-med hover:text-med-dark font-bold ml-1">Log in here</Link>
                </div>
            </div>
        </div>
    );
};
