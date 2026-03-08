import { motion, AnimatePresence } from 'framer-motion';
import { LocateFixed, Clock, Award, Star, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { HistoryEvent } from '../types';

export const DoctorHistoryView = () => {
    const [history, setHistory] = useState<HistoryEvent[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadHistory = () => {
        const raw = localStorage.getItem('medem_history') || '[]';
        const parsed = JSON.parse(raw) as HistoryEvent[];
        setHistory(parsed.filter(h => h.userType === 'Doctor'));
    };

    useEffect(() => {
        loadHistory();
        window.addEventListener('history_updated', loadHistory);
        return () => window.removeEventListener('history_updated', loadHistory);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 dark:bg-slate-900 pb-24 absolute inset-0 w-full"
        >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pt-4">Rescue History</h2>

            {history.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-gray-500 font-medium tracking-wide">No rescue history available yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                            <div className="flex items-start gap-4">
                                <div className="bg-success-100 dark:bg-success-900/40 p-3 rounded-full flex-shrink-0 border border-success-200 dark:border-success-800">
                                    <LocateFixed className="text-success dark:text-success-light" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Responded to SOS</h4>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient: {item.targetName}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">
                                        <Clock size={12} />
                                        <span>{new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100 dark:border-slate-700 pt-3 mt-1">
                                         {item.address && (
                                            <div className="flex items-start gap-2 mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                <MapPin className="mt-0.5 shrink-0 text-slate-500" size={16} />
                                                <span>{item.address}</span>
                                            </div>
                                         )}
                                         <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                             <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex flex-col items-center text-center">
                                                <Award size={20} className="text-emerald-500 mb-1" />
                                                {item.rating ? "The patient rated your care:" : `The patient ${item.targetName} hasn't rated you`}
                                             </span>
                                             {item.rating && (
                                                 <div className="flex gap-1.5 mt-1">
                                                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                                                         <Star key={star} size={18} fill={star <= (item.rating || 0) ? "#10B981" : "transparent"} stroke={star <= (item.rating || 0) ? "#10B981" : "#64748B"} />
                                                     ))}
                                                 </div>
                                             )}
                                         </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
