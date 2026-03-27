import { Download, Trash2, Shield, Eye, Cookie } from 'lucide-react';

/**
 * Common Data Privacy UI Placeholder (Phase 2 Integration)
 * Can be rendered inside 'About MedEm' or a dedicated 'Privacy & Security' tab
 */

export const PrivacyDashboard = ({ isGuest = false }: { isGuest?: boolean }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield className="text-med" /> Privacy & Data Hub
            </h3>

            {/* GDPR & CCPA Data Tooling */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-700 dark:text-slate-200">Data Visibility (GDPR / CCPA)</h4>
                
                <button 
                    disabled={isGuest} // Data export makes no sense for an anonymous temp guest
                    className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-med hover:text-white dark:hover:bg-med transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-3"><Download size={18} /> Export Health Data & Logs</span>
                    <span className="text-xs text-slate-400 group-hover:text-white/80">(JSON/CSV)</span>
                </button>

                <button 
                    disabled={isGuest}
                    className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold bg-danger-50 dark:bg-danger-900/20 text-danger border border-danger-200 dark:border-danger-800/40 hover:bg-danger hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-3"><Trash2 size={18} /> Process Right to Erasure</span>
                    <span className="text-xs opacity-70">Permanent</span>
                </button>
            </div>

            {/* HIPAA / ISO 27001 Access Port */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-700 dark:text-slate-200">HIPAA Security Audit</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    According to HIPAA compliance rules, you have the right to request an accounting of disclosures of your Protected Health Information (PHI).
                </p>
                
                <button 
                    disabled={isGuest}
                    className="w-full flex items-center p-3 rounded-lg text-sm font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Eye size={18} className="mr-3" /> Request PHI Access Audit Log
                </button>
            </div>

            {/* Cookie & Advertising Options */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center"><Cookie size={18} className="mr-2 text-yellow-500" /> Web & Cookie Preferences</h4>
                
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Strictly Necessary Cookies</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md font-bold">Always On</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Analytics & Marketing Analytics</span>
                    <input type="checkbox" className="toggle-checkbox bg-slate-300 dark:bg-slate-600" />
                </div>
                <p className="text-xs text-slate-400 mt-2 italic px-1">Changes are synced to your browser globally across devices.</p>
            </div>
            
            {isGuest && (
                <div className="text-xs text-center text-slate-400 mt-4">
                    NOTE: Privacy tools execute automatically on logout or are restricted because you are using a secure Ephemeral Guest Session.
                </div>
            )}
        </div>
    );
};
