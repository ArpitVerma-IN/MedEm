import { useState, useEffect } from 'react';
import { PhoneCall, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '../types';
import localHelplinesData from '../data/emergencyHelplines.json';

interface Helpline {
    service: string;
    number: string;
}

export const LocalHelplines = ({ 
    location, 
    mode 
}: { 
    location: Location | null; 
    mode: 'connecting' | 'minimized' | 'standby'
}) => {
    const [helplines, setHelplines] = useState<Helpline[]>([]);
    const [loading, setLoading] = useState(false);
    const [resolvedRegion, setResolvedRegion] = useState<string | null>(null);

    useEffect(() => {
        // Only run when location is valid and we haven't loaded numbers yet
        if (!location || helplines.length > 0) return;

        setLoading(true);
        // Using Nominatim API natively
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=10`)
            .then(res => res.json())
            .then(data => {
                if (data && data.address) {
                    const country = data.address.country_code?.toLowerCase();
                    const state = data.address.state?.toLowerCase();

                    // @ts-ignore - Indexing JSON
                    const countryData = localHelplinesData[country];
                    
                    if (countryData) {
                        let availableNumbers = [...countryData.default];
                        
                        if (state && countryData.states && countryData.states[state]) {
                            availableNumbers = [...countryData.states[state], ...availableNumbers];
                        }
                        
                        setHelplines(availableNumbers);
                        setResolvedRegion(`${state ? data.address.state + ', ' : ''}${data.address.country || country.toUpperCase()}`);
                    } else {
                        // Fallback globally
                        setHelplines([{ service: "Global Default (Varies)", number: "112 / 911 / 999" }]);
                    }
                }
                setLoading(false);
            })
            .catch(() => {
                // Network fail state
                setHelplines([{ service: "Network Offline (Default)", number: "112" }]);
                setLoading(false);
            });
    }, [location]);

    if (!location) return null;

    // We do not render in minimized popup, only inline in standby/connecting phases
    if (mode === 'minimized') return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-3xl p-5 shadow-sm mt-4 pointer-events-auto flex flex-col gap-3 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-rose-600 dark:text-rose-400">
                    <PhoneCall size={80} />
                </div>
                
                <h3 className="text-[0.95rem] font-bold text-rose-900 dark:text-rose-100 flex items-center gap-2 relative z-10">
                    <div className="bg-rose-200 dark:bg-rose-800/50 p-1.5 rounded-full text-rose-700 dark:text-rose-300">
                        <PhoneCall size={16} strokeWidth={2.5} />
                    </div>
                    Local Emergency Helplines
                </h3>

                {resolvedRegion && (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400/80 uppercase tracking-wider relative z-10 -mt-2 ml-10">
                        {resolvedRegion}
                    </span>
                )}

                {loading ? (
                    <div className="flex items-center gap-3 text-sm text-rose-600 dark:text-rose-500 font-medium py-2 relative z-10">
                        <Loader2 size={16} className="animate-spin" />
                        Resolving locality numbers...
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 relative z-10">
                        {helplines.map((h, i) => (
                            <a 
                                key={i} 
                                href={`tel:${h.number.replace(/\D/g, '')}`} 
                                className="flex items-center justify-between p-3.5 bg-white dark:bg-rose-950/40 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-100 dark:border-rose-800/20 transition-all active:scale-95 shadow-sm group"
                            >
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{h.service}</span>
                                <span className="font-black text-rose-600 dark:text-rose-400 tracking-wider text-base group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                                    {h.number}
                                </span>
                            </a>
                        ))}
                    </div>
                )}

                <div className="text-[11px] font-medium text-rose-500/70 dark:text-rose-400/60 leading-tight mt-1 relative z-10 flex items-start gap-1">
                    <AlertCircle size={12} className="shrink-0 mt-[1px]" />
                    <span>Tap any number to instantly open your phone dialer. Use only in severe emergencies.</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
