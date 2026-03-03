import { motion, AnimatePresence } from 'framer-motion';
import { Settings, FileText, UserCog, LogOut, Moon, Sun, Bell, Monitor, ShieldAlert, Info, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SettingsSubView } from '../components/SettingsSubView';
import { useState } from 'react';
import { ProfileSettings } from './patient-settings/ProfileSettings';
import { UploadOptions } from './patient-settings/UploadOptions';
import { NotificationSettings } from './patient-settings/NotificationSettings';
import { AppSettings } from './patient-settings/AppSettings';
import { AccountSettings } from './patient-settings/AccountSettings';
import { AboutMedEm } from './patient-settings/AboutMedEm';
import { PrivacyPolicy } from './patient-settings/PrivacyPolicy';

export const ProfileView = ({ name }: { name: string }) => {
    const navigate = useNavigate();
    const { mode, cycleTheme } = useTheme();
    const [activePage, setActivePage] = useState<string | null>(null);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('medem_guest_name');
            localStorage.removeItem('medem_guest_type');
            navigate('/');
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 dark:bg-slate-950 pb-24 absolute inset-0 w-full"
            >
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-24 h-24 rounded-[28px] bg-med-100 dark:bg-med-900/40 flex items-center justify-center shadow-md border-4 border-white dark:border-slate-800 mb-4">
                        <span className="text-4xl font-extrabold text-med-DEFAULT dark:text-med-light">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{name.toLowerCase()}@medem.com</p>
                </div>

                <div className="space-y-3 mb-8">
                    {[
                        { label: 'Profile Settings', icon: UserCog, color: 'text-med-DEFAULT bg-med-50 dark:bg-med-900/30' },
                        { label: 'Report Upload Options', icon: FileText, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' },
                        { label: 'Notification Settings', icon: Bell, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30' },
                        { label: 'App Settings', icon: Settings, color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
                        { label: 'About MedEm', icon: Info, color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/30' },
                        { label: 'Privacy Policy', icon: Shield, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
                        { label: 'Account Settings', icon: ShieldAlert, color: 'text-danger-500 bg-danger-50 dark:bg-danger-900/30' },
                        {
                            label: `Theme: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
                            icon: mode === 'system' ? Monitor : mode === 'dark' ? Moon : Sun,
                            color: mode === 'system' ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : mode === 'dark' ? 'text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
                            action: cycleTheme
                        }
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => item.action ? item.action() : setActivePage(item.label)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                                        <Icon size={20} strokeWidth={2.5} />
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
                    className="w-full flex items-center justify-center gap-2 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-2xl border border-danger-200 dark:border-danger-800 text-danger-DEFAULT dark:text-danger-light hover:bg-danger-100 dark:hover:bg-danger-900/40 transition-colors shadow-sm"
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span className="font-bold">Log Out</span>
                </button>
            </motion.div>

            <AnimatePresence>
                {activePage === 'Profile Settings' && <SettingsSubView title="Profile Settings" onBack={() => setActivePage(null)}><ProfileSettings name={name} /></SettingsSubView>}
                {activePage === 'Report Upload Options' && <SettingsSubView title="Report Upload" onBack={() => setActivePage(null)}><UploadOptions /></SettingsSubView>}
                {activePage === 'Notification Settings' && <SettingsSubView title="Notifications" onBack={() => setActivePage(null)}><NotificationSettings /></SettingsSubView>}
                {activePage === 'App Settings' && <SettingsSubView title="App Settings" onBack={() => setActivePage(null)}><AppSettings /></SettingsSubView>}
                {activePage === 'About MedEm' && <SettingsSubView title="About MedEm" onBack={() => setActivePage(null)}><AboutMedEm /></SettingsSubView>}
                {activePage === 'Privacy Policy' && <SettingsSubView title="Privacy Policy" onBack={() => setActivePage(null)}><PrivacyPolicy /></SettingsSubView>}
                {activePage === 'Account Settings' && <SettingsSubView title="Account Settings" onBack={() => setActivePage(null)}><AccountSettings /></SettingsSubView>}
            </AnimatePresence>
        </>
    );
};
