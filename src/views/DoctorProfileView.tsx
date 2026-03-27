import { motion, AnimatePresence } from 'framer-motion';
import { Settings, FileCheck, UserCog, LogOut, Moon, Sun, Bell, Monitor, ShieldAlert, Info, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SettingsSubView } from '../components/SettingsSubView';
import { useState } from 'react';
import { UploadCertifications } from './responder-settings/UploadCertifications';
import { ResponderSettings } from './responder-settings/ResponderSettings';
import { AlertPreferences } from './responder-settings/AlertPreferences';
import { AppSettings } from './responder-settings/AppSettings';
import { AccountSettings } from './responder-settings/AccountSettings';
import { AboutMedEm } from './responder-settings/AboutMedEm';
import { PrivacyPolicy } from './responder-settings/PrivacyPolicy';
import { PrivacyDashboard } from '../features/settings/ui/PrivacyDashboard';

export const DoctorProfileView = ({ name }: { name: string }) => {
    const navigate = useNavigate();
    const { mode, cycleTheme } = useTheme();
    const [activePage, setActivePage] = useState<string | null>(null);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            // Completely wipe all sensitive guest session data to protect privacy across shared devices
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('medem_')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
            navigate('/');
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 overflow-y-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 pb-24 absolute inset-0 w-full"
            >
                <div className="flex flex-col items-center justify-center mb-8 pt-4">
                    <div className="w-24 h-24 rounded-[28px] bg-success-100 dark:bg-success-900/40 flex items-center justify-center shadow-md border-4 border-white dark:border-slate-800 mb-4">
                        <span className="text-4xl font-extrabold text-success dark:text-success-light">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dr. {name}</h2>
                        <FileCheck size={20} className="text-success" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Verified Responder</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-2">dr.{name.toLowerCase()}@medem.com</p>
                </div>

                <div className="space-y-3 mb-8">
                    {[
                        { label: 'Upload Medical Certifications', icon: FileCheck, color: 'text-success dark:text-success-light bg-success-50 dark:bg-success-900/30' },
                        { label: 'Responder Settings', icon: UserCog, color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' },
                        { label: 'Alert Preferences', icon: Bell, color: 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30' },
                        { label: 'App Settings', icon: Settings, color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
                        { label: 'Privacy & Security Data', icon: Shield, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
                        { label: 'About MedEm', icon: Info, color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/30' },
                        { label: 'Compliance Policies', icon: ShieldAlert, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
                        { label: 'Account Settings', icon: UserCog, color: 'text-danger-500 bg-danger-50 dark:bg-danger-900/30' },
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
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-transform hover:shadow-md"
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
                    className="w-full flex items-center justify-center gap-2 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-2xl border border-danger-200 dark:border-danger-800 text-danger dark:text-danger-light hover:bg-danger-100 dark:hover:bg-danger-900/40 transition-colors shadow-sm"
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span className="font-bold">Log Out</span>
                </button>
            </motion.div>

            <AnimatePresence>
                {activePage === 'Upload Medical Certifications' && <SettingsSubView title="Verification" onBack={() => setActivePage(null)}><UploadCertifications /></SettingsSubView>}
                {activePage === 'Responder Settings' && <SettingsSubView title="Responder Profile" onBack={() => setActivePage(null)}><ResponderSettings /></SettingsSubView>}
                {activePage === 'Alert Preferences' && <SettingsSubView title="Notifications" onBack={() => setActivePage(null)}><AlertPreferences /></SettingsSubView>}
                {activePage === 'App Settings' && <SettingsSubView title="App Settings" onBack={() => setActivePage(null)}><AppSettings /></SettingsSubView>}
                { activePage === 'About MedEm' && <SettingsSubView title="About MedEm" onBack={() => setActivePage(null)}><AboutMedEm /></SettingsSubView> }
                { activePage === 'Compliance Policies' && <SettingsSubView title="Compliance Policies" onBack={() => setActivePage(null)}><PrivacyPolicy /></SettingsSubView> }
                { activePage === 'Privacy & Security Data' && <SettingsSubView title="Data & Security" onBack={() => setActivePage(null)}><PrivacyDashboard isGuest={true} /></SettingsSubView> }
                { activePage === 'Account Settings' && <SettingsSubView title="Account Settings" onBack={() => setActivePage(null)}><AccountSettings /></SettingsSubView> }
            </AnimatePresence>
        </>
    );
};
