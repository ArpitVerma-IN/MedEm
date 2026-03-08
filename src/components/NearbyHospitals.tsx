import { useState, useEffect } from 'react';
import { Building2, X, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from '../types';

interface Facility {
    id: number;
    name: string;
    road?: string;
    suburb?: string;
    city?: string;
    distance: number; // approximate meters
}

export const NearbyHospitals = ({ 
    location, 
    mode 
}: { 
    location: Location | null; 
    mode: 'connecting' | 'minimized' | 'standby'
}) => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (!location || hasFetched) return;
        if (mode !== 'connecting' && !isOpen) return;

        setHasFetched(true);
        setLoading(true);
        // Using Overpass API to find nearest hospitals and clinics relative to the location
        const query = `
            [out:json];
            (
              node["amenity"~"hospital|clinic"](around:20000, ${location.lat}, ${location.lng});
              way["amenity"~"hospital|clinic"](around:20000, ${location.lat}, ${location.lng});
            );
            out center 50;
        `;
        fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.elements) {
                const parsed = data.elements
                    .filter((el: any) => el.tags?.name) // Best results: Must have a verified name
                    .map((el: any) => {
                        const lat = el.lat || el.center?.lat;
                        const lon = el.lon || el.center?.lon;
                        let dist = 0;
                        if (lat && lon) {
                            const R = 6371e3;
                            const φ1 = location.lat * Math.PI/180;
                            const φ2 = lat * Math.PI/180;
                            const Δφ = (lat - location.lat) * Math.PI/180;
                            const Δλ = (lon - location.lng) * Math.PI/180;
                            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            dist = R * c;
                        }

                        return {
                            id: el.id,
                            name: el.tags?.name,
                            road: el.tags?.["addr:street"] || el.tags?.["addr:full"] || null,
                            suburb: el.tags?.["addr:suburb"] || null,
                            city: el.tags?.["addr:city"] || null,
                            distance: dist
                        };
                    }).sort((a: Facility, b: Facility) => a.distance - b.distance).slice(0, 3);
                setFacilities(parsed);
            }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [location, isOpen, mode, hasFetched]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    const openMaps = (f: Facility) => {
        const q = `${f.name} ${f.road || ''} ${f.city || ''}`;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
    };

    const handleClose = () => {
        setIsOpen(false);
        setHasFetched(false);
    };

    const detailsView = (
        <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 pointer-events-auto">
            <h3 className="text-[0.95rem] font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Building2 size={18} strokeWidth={2.5} />
                    Nearest Medical Centers
                </span>
                {mode !== 'connecting' && (
                    <button onClick={handleClose} className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                )}
            </h3>
            
            {loading ? (
                <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Scanning local area...</span>
                </div>
            ) : facilities.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center text-sm font-medium text-slate-500">
                    No verified hospitals or clinics found within 20km radius.
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {facilities.map(f => (
                        <button 
                            key={f.id} 
                            onClick={() => openMaps(f)}
                            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3 text-left transition-colors group cursor-pointer"
                        >
                            <div className="flex-1 flex flex-col min-w-0">
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate text-[0.95rem] leading-tight mb-1">{f.name}</span>
                                <div className="flex items-start gap-1 text-slate-500 dark:text-slate-400 text-[13px] leading-tight mb-1 font-medium">
                                    <MapPin size={12} className="shrink-0 mt-[2px] opacity-70" />
                                    <span className="truncate">{[f.road, f.suburb, f.city].filter(Boolean).join(', ') || 'Address not listed'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                                       {formatDist(f.distance)} away
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors shrink-0" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    if (!location) return null;

    if (mode === 'connecting') {
        return (
            <div className="w-full mt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
                {detailsView}
            </div>
        );
    }

    if (mode === 'standby') {
        if (!isOpen) {
            return (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-full max-w-md mt-6 bg-white dark:bg-slate-800 py-3.5 px-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-bold hover:scale-[1.02] transition-transform pointer-events-auto cursor-pointer"
                >
                    <Building2 size={18} className="text-blue-500" />
                    Browse Nearby Clinics
                </button>
            );
        }
        return (
            <div className="w-full max-w-md mt-6 bg-white dark:bg-slate-800/95 p-5 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 relative z-20 pointer-events-auto">
                {detailsView}
            </div>
        );
    }

    if (mode === 'minimized') {
        return (
            <AnimatePresence>
                {isOpen ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-24 left-4 right-4 z-[9000] p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto pointer-events-auto"
                    >
                        {detailsView}
                    </motion.div>
                ) : (
                    <div className="absolute top-28 right-4 z-[5000] pointer-events-auto">
                        <button 
                            onClick={() => setIsOpen(true)}
                            className="bg-white/95 dark:bg-slate-800/95 p-3.5 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform text-blue-500 dark:text-blue-400"
                        >
                            <Building2 size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </AnimatePresence>
        );
    }

    return null;
};
