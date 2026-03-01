import { motion, AnimatePresence } from 'framer-motion';
import { Settings, FileCheck, UserCog, LogOut, Moon, Sun, Bell, Monitor, ShieldAlert, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SettingsSubView } from '../components/SettingsSubView';
import { useState } from 'react';

export const DoctorProfileView = ({ name }: { name: string }) => {
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

    const renderUploadCertifications = () => (
        <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload your government-issued medical license or responder certification to verify your account and access live patient SOS requests.</p>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-3">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/40 text-success-DEFAULT flex items-center justify-center rounded-xl shadow-sm">
                    <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to upload proof of certification</p>
                <p className="text-xs font-medium text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium tracking-wide">Note: Automated AI Vision Verification is rolling out in Phase 3.</p>
            </div>
        </div>
    );

    const renderResponderSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Response Vehicle Mode</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="Personal Vehicle">
                    <option>Walking / Running</option>
                    <option>Bicycle</option>
                    <option>Personal Vehicle</option>
                    <option>Registered Ambulance</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Notification Radius</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="5 km">
                    <option>1 km</option>
                    <option>5 km</option>
                    <option>10 km</option>
                    <option>Region Wide</option>
                </select>
            </div>
            <button className="w-full bg-success-DEFAULT text-white font-bold py-3.5 rounded-xl hover:bg-success-dark transition-colors active:scale-95 shadow-md">Update Preferences</button>
        </div>
    );

    const renderAlertPreferences = () => (
        <div className="space-y-4">
            {['Critical SOS Overrides (Bypass DND)', 'Passive Assistance Requests', 'In-App Sound Pings'].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    <input type="checkbox" defaultChecked={i !== 1} className="w-5 h-5 accent-success-DEFAULT cursor-pointer" />
                </div>
            ))}
        </div>
    );

    const renderAppSettings = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Continuous Location Broadcasting</span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">Required for accurately dispatching nearby SOS</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-success-DEFAULT cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Background App Refresh</span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">Keep MedEm alive while in pocket</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-success-DEFAULT cursor-pointer" />
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Account Export</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">Download a copy of your responder activity logs and verification traces.</p>
                <button className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors active:scale-95">Request Data Archive</button>
            </div>

            <div className="bg-danger-50 dark:bg-danger-900/10 p-5 rounded-2xl border border-danger-200 dark:border-danger-900/30">
                <h3 className="text-sm font-bold text-danger-DEFAULT dark:text-danger-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-danger-800/80 dark:text-danger-400/80 mb-4 leading-relaxed font-medium">Permanently delete your account and wipe all history from our secure MedEm servers.</p>
                <button className="w-full bg-danger-DEFAULT text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-danger-dark transition-colors active:scale-95">Delete Account</button>
            </div>
        </div>
    );

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
                    className="w-full flex items-center justify-center gap-2 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-2xl border border-danger-200 dark:border-danger-800 text-danger-DEFAULT dark:text-danger-light hover:bg-danger-100 dark:hover:bg-danger-900/40 transition-colors shadow-sm"
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span className="font-bold">Log Out</span>
                </button>
            </motion.div>

            <AnimatePresence>
                {activePage === 'Upload Medical Certifications' && <SettingsSubView title="Verification" onBack={() => setActivePage(null)}>{renderUploadCertifications()}</SettingsSubView>}
                {activePage === 'Responder Settings' && <SettingsSubView title="Responder Profile" onBack={() => setActivePage(null)}>{renderResponderSettings()}</SettingsSubView>}
                {activePage === 'Alert Preferences' && <SettingsSubView title="Notifications" onBack={() => setActivePage(null)}>{renderAlertPreferences()}</SettingsSubView>}
                {activePage === 'App Settings' && <SettingsSubView title="App Settings" onBack={() => setActivePage(null)}>{renderAppSettings()}</SettingsSubView>}
                {activePage === 'Account Settings' && <SettingsSubView title="Account Settings" onBack={() => setActivePage(null)}>{renderAccountSettings()}</SettingsSubView>}
            </AnimatePresence>
        </>
    );
};
