import { motion } from 'framer-motion';
import { Settings, FileText, UserCog, LogOut, Moon, Sun, Bell, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export const ProfileView = ({ name }: { name: string }) => {
    const navigate = useNavigate();
    const { mode, cycleTheme } = useTheme();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-950 pb-24"
        >
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-med-light dark:bg-med-dark flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 mb-4">
                    <span className="text-4xl font-bold text-med-dark dark:text-med-light">
                        {name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">{name.toLowerCase()}@example.com</p>
            </div>

            <div className="space-y-3 mb-8">
                {[
                    { label: 'Profile Settings', icon: UserCog, color: 'text-med-DEFAULT' },
                    { label: 'Report Upload Options', icon: FileText, color: 'text-indigo-500' },
                    { label: 'Notification Settings', icon: Bell, color: 'text-orange-500' },
                    { label: 'App Settings', icon: Settings, color: 'text-gray-500 dark:text-gray-400' },
                    {
                        label: `Theme: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
                        icon: mode === 'system' ? Monitor : mode === 'dark' ? Moon : Sun,
                        color: mode === 'system' ? 'text-blue-500 dark:text-blue-400' : mode === 'dark' ? 'text-indigo-400' : 'text-amber-500',
                        action: cycleTheme
                    }
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:scale-95 transition-transform"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 ${item.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">❯</span>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-danger-light/20 dark:bg-danger-dark/30 rounded-2xl border border-danger-DEFAULT/30 text-danger-DEFAULT hover:bg-danger-DEFAULT/20 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-bold">Log Out</span>
            </button>
        </motion.div>
    );
};
