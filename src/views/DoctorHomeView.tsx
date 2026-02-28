import { Locate, AlertTriangle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import type { User, Location as UserLocation } from '../types';

interface DoctorHomeViewProps {
    name: string;
    myColor: string;
    myLocation: UserLocation | null;
    users: Map<string, User>;
    incomingDoctors: { user: User, distance: number }[];
    nearbyPatients: { user: User, distance: number }[];
    acceptingPatientId: string | null;
    setIsAcceptingHelp: (val: boolean) => void;
    setAcceptingPatientId: (id: string | null) => void;
    centerMapToMe: () => void;
}

export const DoctorHomeView = ({
    name,
    myColor,
    myLocation,
    users,
    incomingDoctors,
    nearbyPatients,
    acceptingPatientId,
    setIsAcceptingHelp,
    setAcceptingPatientId,
    centerMapToMe
}: DoctorHomeViewProps) => {

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col w-full bg-[#064E3B] dark:bg-[#022C22] font-inter overflow-y-auto overflow-x-hidden scroll-smooth"
        >
            {/* Top Branded Section - Emerald/Teal Theme for Doctors */}
            <div className="w-full pt-12 pb-16 px-6 flex flex-col text-white z-0 relative shrink-0">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-xs font-bold opacity-80 tracking-widest uppercase text-emerald-100">Responder Active</span>
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
                        <span className="text-white text-xs font-black leading-none">DR</span>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight mb-1 relative z-10 drop-shadow-sm">Dr. {name}</h1>
                <p className="text-emerald-100/90 font-medium text-[1.05rem] max-w-[260px] leading-relaxed relative z-10">
                    Standing by for emergency tracking signals.
                </p>

                {/* Decoration Graphic */}
                <div className="absolute top-10 right-0 opacity-[0.15] transform translate-x-1/4 scale-125 z-0">
                    <Activity size={180} strokeWidth={1} />
                </div>
            </div>

            {/* Bottom White Container: Flow Layout */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-12px_30px_rgb(0,0,0,0.2)] relative z-10 -mt-6 p-6 flex flex-col items-center gap-6 min-h-[500px] w-full">

                {/* 1. Target Selection Box */}
                <AnimatePresence>
                    {nearbyPatients.length > 0 && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="w-full max-w-md pointer-events-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[1.5rem] p-4 shadow-xl border border-danger-DEFAULT/20 relative overflow-hidden shrink-0"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-danger-DEFAULT animate-pulse"></div>

                            <div className="flex items-center gap-2 mb-3 px-2">
                                <AlertTriangle className="text-danger-DEFAULT animate-bounce drop-shadow" size={20} />
                                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
                                    {nearbyPatients.length} EMERGENCY {nearbyPatients.length === 1 ? 'SIGNAL' : 'SIGNALS'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-danger-DEFAULT/50 transition-shadow drop-shadow-sm cursor-pointer"
                                        value={acceptingPatientId || ''}
                                        onChange={(e) => {
                                            const selected = e.target.value;
                                            if (selected) {
                                                setAcceptingPatientId(selected);
                                                setIsAcceptingHelp(true);
                                            } else {
                                                setAcceptingPatientId(null);
                                                setIsAcceptingHelp(false);
                                            }
                                        }}
                                    >
                                        <option value="" className="text-slate-500 font-medium select-none text-center">Tap to assign patient target...</option>
                                        {nearbyPatients.map(p => (
                                            <option key={p.user.id} value={p.user.id} className="font-bold py-2">
                                                🆘 {p.user.name} ({formatDist(p.distance)} away)
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>

                                {acceptingPatientId && nearbyPatients.find(p => p.user.id === acceptingPatientId) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-1 flex items-center justify-center gap-2 bg-success-DEFAULT/10 dark:bg-success-dark/20 text-success-DEFAULT dark:text-success-light py-2 rounded-xl border border-success-DEFAULT/20"
                                    >
                                        <Locate size={16} strokeWidth={3} className="animate-pulse" />
                                        <span className="text-[0.8rem] font-black uppercase tracking-wider">
                                            Tracking: {formatDist(nearbyPatients.find(p => p.user.id === acceptingPatientId)!.distance)}
                                        </span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. Map Box Container */}
                <div className="w-full max-w-md flex-1 relative shrink-0">
                    <LiveTrackingMap
                        myLocation={myLocation}
                        name={name}
                        userType="Doctor"
                        myColor={myColor}
                        needsCare={false}
                        users={users}
                        incomingDoctors={incomingDoctors}
                        nearbyPatients={nearbyPatients}
                        acceptingPatientId={acceptingPatientId}
                    />

                    {/* Floating Locate Button relative to Map boundaries */}
                    <div className="absolute -bottom-4 -right-2 z-[3000]">
                        <button
                            onClick={centerMapToMe}
                            className="bg-white/95 dark:bg-slate-800/95 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-full shadow-[0_8px_20px_rgb(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform backdrop-blur-md"
                        >
                            <Locate strokeWidth={2.5} size={28} />
                        </button>
                    </div>
                </div>

                <div className="h-24 w-full shrink-0"></div>
            </div>
        </motion.div>
    );
};
