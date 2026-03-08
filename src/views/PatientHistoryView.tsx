import { motion, AnimatePresence } from 'framer-motion';
import { LocateFixed, Clock, Award, Star, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { HistoryEvent } from '../types';

interface PatientHistoryViewProps {
    sendRating?: (targetId: string, eventId: string, rating: number) => void;
}

export const HistoryView = ({ sendRating }: PatientHistoryViewProps) => {
    const [history, setHistory] = useState<HistoryEvent[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadHistory = () => {
        const raw = localStorage.getItem('medem_history') || '[]';
        const parsed = JSON.parse(raw) as HistoryEvent[];
        setHistory(parsed.filter(h => h.userType === 'Patient'));
    };

    useEffect(() => {
        loadHistory();
        window.addEventListener('history_updated', loadHistory);
        return () => window.removeEventListener('history_updated', loadHistory);
    }, []);

    const handleRate = (targetId: string, eventId: string, star: number) => {
        const raw = localStorage.getItem('medem_history') || '[]';
        const parsed = JSON.parse(raw) as HistoryEvent[];
        const idx = parsed.findIndex(h => h.id === eventId);
        if (idx !== -1) {
            parsed[idx].rating = star;
            localStorage.setItem('medem_history', JSON.stringify(parsed));
            loadHistory();
        }
        if (sendRating) {
            sendRating(targetId, eventId, star);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-950 pb-24"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tracking History</h2>

            {history.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-500 font-medium tracking-wide">No history entries available.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                                    <LocateFixed size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Emergency Responded</h4>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">Dr. {item.targetName}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 font-medium">
                                        <Clock size={12} />
                                        <span>{new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100 dark:border-gray-800 pt-3 mt-1">
                                         {item.address && (
                                            <div className="flex items-start gap-2 mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                <MapPin className="mt-0.5 shrink-0" size={16} />
                                                <span>{item.address}</span>
                                            </div>
                                         )}
                                         <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                             <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex flex-col items-center">
                                                <Award size={20} className="text-amber-500 mb-1" />
                                                {item.rating ? 'You rated your experience:' : 'Rate your medical experience'}
                                             </span>
                                             <div className="flex gap-1">
                                                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                                                     <button 
                                                        key={star} 
                                                        disabled={item.rating !== null}
                                                        onClick={(e) => { e.stopPropagation(); handleRate(item.targetId, item.id, star); }}
                                                        className="p-0.5 transition-transform hover:scale-110 active:scale-95 disabled:hover:scale-100 disabled:opacity-80"
                                                     >
                                                         <Star size={18} fill={item.rating && star <= item.rating ? "#F59E0B" : "transparent"} stroke={item.rating && star <= item.rating ? "#F59E0B" : "#9CA3AF"} />
                                                     </button>
                                                 ))}
                                             </div>
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
