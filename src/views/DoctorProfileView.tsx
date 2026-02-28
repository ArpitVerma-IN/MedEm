import { motion } from 'framer-motion';
import { Settings, FileCheck, UserCog, LogOut, Moon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorProfileView = ({ name }: { name: string }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 pb-24 absolute inset-0 w-full"
        >
            <div className="flex flex-col items-center justify-center mb-8 pt-4">
                <div className="w-24 h-24 rounded-full bg-success-100 dark:bg-success-900/40 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 mb-4">
                    <span className="text-4xl font-extrabold text-success-DEFAULT dark:text-success-light">
                        {name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dr. {name}</h2>
                    <FileCheck size={20} className="text-success-DEFAULT" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Verified Responder</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-2">dr.{name.toLowerCase()}@medem.com</p>
            </div>

            <div className="space-y-3 mb-8">
                {[
                    { label: 'Upload Medical Certifications', icon: FileCheck, color: 'text-success-DEFAULT dark:text-success-light bg-success-50 dark:bg-success-900/30' },
                    { label: 'Responder Settings', icon: UserCog, color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'Alert Preferences', icon: Bell, color: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30' },
                    { label: 'App Settings', icon: Settings, color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
                    { label: 'Toggle Dark Mode', icon: Moon, color: 'text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700', action: () => document.documentElement.classList.toggle('dark') }
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${item.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-base font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-600">❯</span>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-2xl border border-danger-200 dark:border-danger-800 text-danger-DEFAULT dark:text-danger-light hover:bg-danger-100 dark:hover:bg-danger-900/40 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-bold">Log Out</span>
            </button>
        </motion.div>
    );
};
