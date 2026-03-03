import { motion, AnimatePresence } from 'framer-motion';
import { Settings, FileText, UserCog, LogOut, Moon, Sun, Bell, Monitor, ShieldAlert, Upload, Info, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SettingsSubView } from '../components/SettingsSubView';
import { useState } from 'react';

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

    const renderProfileSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" defaultValue={name} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address (Phase 2)</label>
                <input type="email" disabled defaultValue={`${name.toLowerCase()}@example.com`} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="Unknown">
                    <option>Unknown</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                </select>
            </div>
            <button className="w-full bg-med-DEFAULT text-white font-bold py-3.5 rounded-xl hover:bg-med-dark transition-colors active:scale-95 shadow-md">Save Changes</button>
        </div>
    );

    const renderUploadOptions = () => (
        <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload your current medical reports or list of ongoing medications for emergency responders to see instantly when you ping for help.</p>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-3">
                <div className="w-12 h-12 bg-med-100 dark:bg-med-900/40 text-med-DEFAULT flex items-center justify-center rounded-xl shadow-sm">
                    <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to browse files</p>
                <p className="text-xs font-medium text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium tracking-wide">Note: Full document hosting and verification is a Phase 3 feature.</p>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-4">
            {['Emergency Alerts', 'Responder ETA Updates', 'Nearby SOS Requests (Volunteer)'].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    <input type="checkbox" defaultChecked={i !== 2} className="w-5 h-5 accent-med-DEFAULT cursor-pointer" />
                </div>
            ))}
        </div>
    );

    const renderAppSettings = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="English (US)">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Precise Location Tracking</span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">Allow MedEm to trace location pings</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-med-DEFAULT cursor-pointer" />
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Account Export</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">Download a copy of your encrypted medical history and location ping records.</p>
                <button className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors active:scale-95">Request Data Archive</button>
            </div>

            <div className="bg-danger-50 dark:bg-danger-900/10 p-5 rounded-2xl border border-danger-200 dark:border-danger-900/30">
                <h3 className="text-sm font-bold text-danger-DEFAULT dark:text-danger-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-danger-800/80 dark:text-danger-400/80 mb-4 leading-relaxed font-medium">Permanently delete your account and wipe all history from our secure MedEm servers.</p>
                <button className="w-full bg-danger-DEFAULT text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-danger-dark transition-colors active:scale-95">Delete Account</button>
            </div>
        </div>
    );

    const renderAboutMedEm = () => (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-16 h-16 bg-med-100 dark:bg-med-900/40 text-med-DEFAULT dark:text-med-light rounded-[20px] flex items-center justify-center shadow-inner border border-med-200 dark:border-med-DEFAULT/20 mb-4">
                    <Info size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">About MedEm</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Version 1.0.0</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Your Lifeline in Emergencies</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    MedEm is a high-performance, real-time emergency tracking application leveraging precise geolocation to instantly connect you with nearby medical responders through an interactive live map.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                    <h5 className="text-blue-800 dark:text-blue-300 font-bold mb-1">Coming Soon (Phase 2 & 3)</h5>
                    <ul className="text-xs text-blue-700/80 dark:text-blue-300/80 list-disc pl-4 space-y-1">
                        <li>Google and Direct Email Authentication.</li>
                        <li>AI-Summarized Medical Profiles for emergency personnel.</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <a href="https://github.com/ArpitVerma-IN/MedEm" target="_blank" rel="noopener noreferrer" className="text-med-DEFAULT hover:text-med-dark dark:text-med-light dark:hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                    View Project on GitHub
                </a>
            </div>
        </div>
    );

    const renderPrivacyPolicy = () => (
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Our Commitment</h4>
                <p>We respect your privacy and are deeply committed to protecting your personal data and medical information. When you request help, your location is shared exclusively with verified responders in your immediate radius to facilitate rapid medical intervention.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Data Protection</h4>
                <p className="mb-3">We securely protect all data utilizing standard network protocols. In upcoming updates, additional AI verification and end-to-end medical history safeguards will be implemented.</p>
                <p className="text-med-DEFAULT dark:text-med-light font-bold">The feature is releasing soon, please check the about section to know more.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                Please refer to the complete privacy_policy.txt file in our root repository for all legal disclosures.
            </div>
        </div>
    );

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
                {activePage === 'Profile Settings' && <SettingsSubView title="Profile Settings" onBack={() => setActivePage(null)}>{renderProfileSettings()}</SettingsSubView>}
                {activePage === 'Report Upload Options' && <SettingsSubView title="Report Upload" onBack={() => setActivePage(null)}>{renderUploadOptions()}</SettingsSubView>}
                {activePage === 'Notification Settings' && <SettingsSubView title="Notifications" onBack={() => setActivePage(null)}>{renderNotificationSettings()}</SettingsSubView>}
                {activePage === 'App Settings' && <SettingsSubView title="App Settings" onBack={() => setActivePage(null)}>{renderAppSettings()}</SettingsSubView>}
                {activePage === 'About MedEm' && <SettingsSubView title="About MedEm" onBack={() => setActivePage(null)}>{renderAboutMedEm()}</SettingsSubView>}
                {activePage === 'Privacy Policy' && <SettingsSubView title="Privacy Policy" onBack={() => setActivePage(null)}>{renderPrivacyPolicy()}</SettingsSubView>}
                {activePage === 'Account Settings' && <SettingsSubView title="Account Settings" onBack={() => setActivePage(null)}>{renderAccountSettings()}</SettingsSubView>}
            </AnimatePresence>
        </>
    );
};
