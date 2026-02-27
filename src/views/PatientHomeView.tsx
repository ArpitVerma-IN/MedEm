import { Navigation, Locate, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import type { User, Location as UserLocation } from '../types';

interface PatientHomeViewProps {
    name: string;
    myColor: string;
    myLocation: UserLocation | null;
    users: Map<string, User>;
    incomingDoctors: { user: User, distance: number }[];
    nearbyPatients: { user: User, distance: number }[];
    needsCare: boolean;
    setNeedsCare: (val: boolean) => void;
    centerMapToMe: () => void;
}

export const PatientHomeView = ({
    name,
    myColor,
    myLocation,
    users,
    incomingDoctors,
    nearbyPatients,
    needsCare,
    setNeedsCare,
    centerMapToMe
}: PatientHomeViewProps) => {

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col w-full h-full bg-[#3B3B7A] dark:bg-[#1E1E3F] transition-colors relative"
        >
            {/* Top Branded Section (Purple/Blue base matching reference illustration) */}
            <div className="w-full pt-12 pb-16 px-6 flex flex-col text-white z-0">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium opacity-80 tracking-wide uppercase">MedEm Network</span>
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <span className="text-white text-xs font-bold leading-none">{name.charAt(0).toUpperCase()}</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-1">Hi, {name}</h1>
                <p className="text-[#C1C1F8] font-medium text-lg max-w-[240px] leading-snug">
                    Your emergency responder map is active.
                </p>

                {/* Decoration Graphic */}
                <div className="absolute top-12 right-0 opacity-20 transform translate-x-1/4">
                    <HeartPulse size={160} strokeWidth={1} />
                </div>
            </div>

            {/* Bottom Floating White Container with massive border radius */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-12px_30px_rgb(0,0,0,0.15)] overflow-hidden relative z-10 -mt-6">

                {/* SOS Checkbox Alert Box strictly placed over map inside rounded container */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] pointer-events-auto">
                    <div className="w-full bg-white dark:bg-gray-800/90 backdrop-blur-xl px-5 py-4 rounded-3xl shadow-[0_12px_40px_rgba(239,68,68,0.2)] dark:shadow-none border border-danger-DEFAULT/20 flex justify-center">
                        <label className="flex items-center gap-3 cursor-pointer group w-full justify-center">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={needsCare}
                                    onChange={(e) => setNeedsCare(e.target.checked)}
                                    className="peer appearance-none w-7 h-7 border-[2.5px] border-danger-DEFAULT rounded-lg checked:bg-danger-DEFAULT checked:border-danger-DEFAULT transition-all shadow-sm"
                                />
                                <svg className="absolute w-7 h-7 p-1 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-danger-DEFAULT font-bold text-[1.1rem] tracking-wide group-hover:text-danger-dark transition-colors drop-shadow-sm">
                                I Need Medical Care!
                            </span>
                        </label>
                    </div>

                    {/* Incoming Doctor Notification Box */}
                    {incomingDoctors.length > 0 && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-3 w-full bg-success-DEFAULT dark:bg-success-dark text-white px-5 py-4 rounded-[1.5rem] shadow-xl border border-success-light/30 flex flex-col gap-2 relative overflow-hidden"
                        >
                            {/* Animated background glow */}
                            <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>

                            <div className="flex items-center gap-2 mb-1 relative z-10">
                                <Navigation className="animate-bounce drop-shadow-md" size={24} />
                                <span className="font-extrabold text-[0.95rem] uppercase tracking-wider drop-shadow-sm">
                                    Doctor Approaching
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 ml-8 relative z-10">
                                {incomingDoctors.map(d => (
                                    <span key={d.user.id} className="font-semibold text-base drop-shadow-sm">
                                        Dr. {d.user.name} is <span className="font-black bg-white/30 px-2 py-0.5 rounded-md inline-block">{formatDist(d.distance)}</span> away
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Floating Locate Button Bottom Right, shifted up for navbar */}
                <div className="absolute bottom-[5.5rem] right-4 z-[1000] pointer-events-auto">
                    <button
                        onClick={centerMapToMe}
                        className="bg-white/95 dark:bg-gray-800/95 text-[#3B3B7A] dark:text-med-light p-3.5 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform backdrop-blur-md"
                    >
                        <Locate strokeWidth={2.5} size={28} />
                    </button>
                </div>

                <LiveTrackingMap
                    myLocation={myLocation}
                    name={name}
                    userType="Patient"
                    myColor={myColor}
                    needsCare={needsCare}
                    users={users}
                    incomingDoctors={incomingDoctors}
                    nearbyPatients={nearbyPatients}
                    acceptingPatientId={null}
                />
            </div>
        </motion.div>
    );
};
