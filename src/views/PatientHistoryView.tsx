import { motion } from 'framer-motion';
import { LocateFixed, Clock } from 'lucide-react';

export const HistoryView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-950 pb-24"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tracking History</h2>

            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full flex-shrink-0">
                            <LocateFixed className="text-med-DEFAULT" size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Emergency Call Log</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Responded by Dr. Smith</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 font-medium">
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
