import { motion } from 'framer-motion';
import { LocateFixed, Clock } from 'lucide-react';

export const DoctorHistoryView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 dark:bg-slate-900 pb-24 absolute inset-0 w-full"
        >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pt-4">Rescue History</h2>

            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="bg-success-100 dark:bg-success-900/40 p-3 rounded-full flex-shrink-0 border border-success-200 dark:border-success-800">
                            <LocateFixed className="text-success-DEFAULT dark:text-success-light" size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Responded to SOS</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient: John Doe</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">
                                <Clock size={12} />
                                <span>October 12, 2025 • 14:32</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
