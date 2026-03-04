import { Navigation, Locate, HeartPulse, CheckCircle, AlertCircle, Loader2, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import clsx from 'clsx';
import type { User, Location as UserLocation, ChatMessage } from '../types';

interface PatientHomeViewProps {
    name: string;
    myColor: string;
    myLocation: UserLocation | null;
    users: Map<string, User>;
    incomingDoctors: { user: User, distance: number }[];
    nearbyPatients: { user: User, distance: number }[];
    needsCare: boolean;
    setNeedsCare: (val: boolean) => void;
    messages: ChatMessage[];
    sendMessage: (targetId: string, message: string) => void;
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
    messages,
    sendMessage,
    centerMapToMe
}: PatientHomeViewProps) => {

    const [isTimeout, setIsTimeout] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Timeout Logic
    useEffect(() => {
        let timer: any;
        if (needsCare && incomingDoctors.length === 0) {
            if (!isTimeout) {
                timer = setTimeout(() => {
                    setIsTimeout(true);
                }, 120000); // 120 seconds
            }
        } else {
            setIsTimeout(false);
        }
        return () => clearTimeout(timer);
    }, [needsCare, incomingDoctors.length, isTimeout]);

    // Auto-scroll chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isChatOpen]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    const handleSendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (msgInput.trim() && incomingDoctors.length > 0) {
            sendMessage(incomingDoctors[0].user.id, msgInput);
            setMsgInput('');
        }
    };

    // Filter relevant messages
    const activeDoctorId = incomingDoctors.length > 0 ? incomingDoctors[0].user.id : null;
    const chatMessages = messages.filter(m => m.senderId === 'me' || m.senderId === activeDoctorId);

    // Unread logic
    useEffect(() => {
        if (chatMessages.length > 0) {
            const lastMsg = chatMessages[chatMessages.length - 1];
            if (lastMsg.senderId !== 'me' && !isChatOpen) {
                setHasUnread(true);
            }
        }
    }, [chatMessages, isChatOpen]);

    useEffect(() => {
        if (isChatOpen) {
            setHasUnread(false);
        }
    }, [isChatOpen]);

    const isConnecting = needsCare && incomingDoctors.length === 0 && !isTimeout;
    const isTimeoutReached = needsCare && incomingDoctors.length === 0 && isTimeout;
    const showMap = !needsCare || incomingDoctors.length > 0;

    const SOSButton = (
        <button
            onClick={() => setNeedsCare(!needsCare)}
            className={clsx(
                "w-full max-w-md font-bold text-[1.1rem] py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 shrink-0 relative z-20 active:scale-95",
                needsCare
                    ? "bg-success text-white hover:bg-success-dark shadow-success/30"
                    : "bg-danger text-white hover:bg-danger-dark shadow-danger/30"
            )}
        >
            {needsCare ? (
                <>
                    <CheckCircle size={24} />
                    I Don't Need Medical Care
                </>
            ) : (
                <>
                    <AlertCircle size={24} />
                    I Need Medical Care!
                </>
            )}
        </button>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col w-full bg-[#3B3B7A] dark:bg-[#1E1E3F] transition-colors overflow-hidden"
        >
            {/* Top Branded Section - Fixed Background */}
            <div className="w-full pt-12 pb-16 px-6 flex flex-col text-white shrink-0 relative z-0">
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

            {/* Scrollable Bottom Theme Canvas */}
            <div className="flex-1 w-full relative z-10 -mt-6 overflow-y-auto w-full">
                <div className="bg-gray-50 dark:bg-gray-900 min-h-full rounded-t-[2.5rem] shadow-[0_-12px_30px_rgb(0,0,0,0.15)] p-6 flex flex-col items-center gap-6 pb-32">

                    {/* 1. Interactive Panic Button */}
                    {SOSButton}

                    {/* 2. Map OR Loading OR Error States */}
                    <AnimatePresence mode="wait">
                        {showMap && (
                            <motion.div
                                key="map"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md relative shrink-0"
                            >
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
                                    fullscreenOverlay={SOSButton}
                                />
                                {/* Floating Locate Button */}
                                <div className="absolute -bottom-4 -right-2 z-[3000]">
                                    <button
                                        onClick={centerMapToMe}
                                        className="bg-white/95 dark:bg-gray-800/95 text-[#3B3B7A] dark:text-med-light p-3.5 rounded-full shadow-[0_8px_20px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform backdrop-blur-md"
                                    >
                                        <Locate strokeWidth={2.5} size={28} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {isConnecting && (
                            <motion.div
                                key="connecting"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
                            >
                                <Loader2 className="animate-spin text-med mb-4" size={48} />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connecting to Responder</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Please wait a moment while we dispatch your exact coordinates to the nearest verified medical professional...</p>
                            </motion.div>
                        )}

                        {isTimeoutReached && (
                            <motion.div
                                key="timeout"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl border border-danger-200 dark:border-danger-900/30 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
                            >
                                <div className="w-16 h-16 bg-danger-50 dark:bg-danger-900/20 text-danger rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Responders Found</h3>
                                <p className="text-gray-600 dark:text-gray-300 font-medium">
                                    Seems like there are no responders nearby on the MedEm network. Please contact regular rescue/medical authorities for help immediately.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 3. Incoming Doctor Notifications & Messaging */}
                    {incomingDoctors.length > 0 && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-2 w-full max-w-md bg-success dark:bg-success-dark text-white p-5 rounded-[1.5rem] shadow-xl border border-success-light/30 flex flex-col gap-3 relative overflow-hidden shrink-0"
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse mix-blend-overlay pointer-events-none"></div>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <Navigation className="animate-bounce drop-shadow-md" size={24} />
                                    <span className="font-extrabold text-[0.95rem] uppercase tracking-wider drop-shadow-sm">
                                        Doctor Approaching
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors relative"
                                >
                                    <MessageCircle size={20} />
                                    {hasUnread && !isChatOpen && (
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-danger border-2 border-success dark:border-success-dark rounded-full animate-pulse"></span>
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 relative z-10 px-2">
                                {incomingDoctors.map(d => (
                                    <span key={d.user.id} className="font-semibold text-base drop-shadow-sm">
                                        Dr. {d.user.name} is <span className="font-black bg-white/30 px-2 py-0.5 rounded-md inline-block">{formatDist(d.distance)}</span> away
                                    </span>
                                ))}
                            </div>

                            {/* Expandable Chat Area */}
                            {isChatOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="bg-white/10 rounded-xl p-3 mt-2 flex flex-col gap-3 relative z-10 h-48"
                                >
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 text-sm flex flex-col">
                                        {chatMessages.length === 0 ? (
                                            <div className="text-white/60 text-center text-xs italic my-auto">
                                                Send a message to your responder.
                                            </div>
                                        ) : (
                                            chatMessages.map((msg, i) => (
                                                <div key={i} className={clsx("flex flex-col max-w-[85%] rounded-lg p-2", msg.senderId === 'me' ? 'self-end bg-white/20 items-end' : 'self-start bg-success-700 items-start')}>
                                                    <span className="font-medium text-[13px]">{msg.message}</span>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <form onSubmit={handleSendMsg} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={msgInput}
                                            onChange={e => setMsgInput(e.target.value)}
                                            placeholder="Quick message..."
                                            className="w-full bg-white/20 text-white placeholder:text-white/50 rounded-lg px-3 py-2 text-sm outline-none border border-white/10 focus:border-white/30 transition-colors"
                                        />
                                        <button type="submit" disabled={!msgInput.trim()} className="bg-white/20 hover:bg-white/30 disabled:opacity-50 p-2 rounded-lg transition-colors">
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                </div>
            </div>
        </motion.div>
    );
};
