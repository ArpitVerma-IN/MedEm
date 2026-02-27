import { Navigation, Locate } from 'lucide-react';
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
            className="flex-1 relative pb-16" // pb-16 to leave space for Bottom Nav
        >
            {/* Floating UI Overlay layer */}
            <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none p-4 safe-top flex flex-col gap-4">
                {/* Header Title Layer */}
                <div className="pointer-events-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 flex items-center gap-3 w-full self-center">
                    <div className="bg-med-DEFAULT p-2 rounded-xl text-white shadow-sm">
                        <Navigation size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Home Tracking</h1>
                        <span className="text-xs font-semibold text-med-DEFAULT uppercase tracking-wider">MedEm Portal</span>
                    </div>
                </div>

                {/* SOS Checkbox Alert Box */}
                <div className="pointer-events-auto w-full max-w-sm mx-auto bg-danger-light/10 dark:bg-danger-dark/20 backdrop-blur-md px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-danger-DEFAULT/30 flex justify-center">
                    <label className="flex items-center gap-3 cursor-pointer group w-full justify-center">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={needsCare}
                                onChange={(e) => setNeedsCare(e.target.checked)}
                                className="peer appearance-none w-6 h-6 border-2 border-danger-DEFAULT rounded-md checked:bg-danger-DEFAULT checked:border-danger-DEFAULT transition-all"
                            />
                            <svg className="absolute w-6 h-6 p-1 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-danger-DEFAULT font-bold text-lg tracking-wide group-hover:text-danger-dark transition-colors">
                            I Need Medical Care!
                        </span>
                    </label>
                </div>

                {/* Incoming Doctor Notification Box */}
                {incomingDoctors.length > 0 && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="pointer-events-auto w-full max-w-sm mx-auto bg-success-light/20 dark:bg-success-dark/30 backdrop-blur-md px-5 py-4 rounded-2xl border border-success-DEFAULT shadow-lg flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Navigation className="text-success-DEFAULT animate-pulse" size={24} />
                            <span className="text-success-dark dark:text-success-light font-bold text-sm uppercase tracking-wide">
                                Doctors Approaching
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 ml-8">
                            {incomingDoctors.map(d => (
                                <span key={d.user.id} className="text-gray-900 dark:text-white font-semibold text-base">
                                    Dr. {d.user.name} is <span className="text-success-DEFAULT font-bold">{formatDist(d.distance)}</span> away
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Floating Locate Button Bottom Right above Nav */}
            <div className="absolute bottom-20 right-4 z-[1000] pointer-events-auto">
                <button
                    onClick={centerMapToMe}
                    className="bg-white dark:bg-gray-800 text-med-DEFAULT p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform"
                >
                    <Locate size={28} />
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
        </motion.div>
    );
};
