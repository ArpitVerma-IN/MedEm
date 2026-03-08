import { Locate, AlertTriangle, Activity, Send, MessageCircle, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import clsx from 'clsx';
import type { User, Location as UserLocation, ChatMessage } from '../types';

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
    messages: ChatMessage[];
    sendMessage: (targetId: string, message: string) => void;
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
    messages,
    sendMessage,
    centerMapToMe
}: DoctorHomeViewProps) => {

    const [msgInput, setMsgInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isChatOpen]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    const handleSendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (msgInput.trim() && acceptingPatientId) {
            sendMessage(acceptingPatientId, msgInput);
            setMsgInput('');
        }
    };

    // Filter relevant messages
    const chatMessages = messages.filter(m => m.senderId === 'me' || m.senderId === acceptingPatientId);

    // Unread logic
    const lastMsgCount = useRef(chatMessages.length);

    useEffect(() => {
        const currentCount = chatMessages.length;
        if (currentCount > lastMsgCount.current) {
            const lastMsg = chatMessages[currentCount - 1];
            if (lastMsg.senderId !== 'me' && !isChatOpen) {
                setHasUnread(true);
            }
        }
        lastMsgCount.current = currentCount;
    }, [chatMessages]);

    useEffect(() => {
        if (isChatOpen) {
            setHasUnread(false);
        }
    }, [isChatOpen]);

    // If no target accepted, close chat
    useEffect(() => {
        if (!acceptingPatientId) setIsChatOpen(false);
    }, [acceptingPatientId]);

    const disengageRescue = (targetPatient?: User, navAddress?: string | null) => {
        if (!acceptingPatientId) return;
        const patient = targetPatient || users.get(acceptingPatientId);
        if (patient) {
            const historyStr = localStorage.getItem('medem_history') || '[]';
            const history = JSON.parse(historyStr);
            if (!history.find((h: any) => h.id === "event-" + patient.id && Date.now() - new Date(h.timestamp).getTime() < 300000)) {
                history.unshift({
                    id: Date.now().toString(),
                    targetId: patient.id,
                    targetName: patient.name,
                    timestamp: new Date().toISOString(),
                    location: patient.location,
                    address: navAddress || null,
                    userType: 'Doctor',
                    rating: null
                });
                localStorage.setItem('medem_history', JSON.stringify(history));
                window.dispatchEvent(new Event('history_updated'));
            }
        }
        setAcceptingPatientId(null);
        setIsAcceptingHelp(false);
    };

    const handleTargetReached = (target: User, address: string | null) => {
        disengageRescue(target, address);
    };

    useEffect(() => {
        // Did the active patient abort SOS manually?
        if (acceptingPatientId) {
            const p = users.get(acceptingPatientId);
            // If user disappears or drops NeedsCare, conclude it.
            // But wait! When users disconnect, they might just lose internet. But let's act on needsCare explicit drop.
            if (p && !p.needsCare) {
                disengageRescue(p, null);
            }
        }
    }, [users, acceptingPatientId]);

    const TargetSelectionBox = nearbyPatients.length > 0 ? (
        <AnimatePresence>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="w-full max-w-md pointer-events-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[1.5rem] p-4 shadow-xl border border-danger/20 relative overflow-hidden shrink-0"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-danger animate-pulse"></div>

                <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-danger animate-bounce drop-shadow" size={20} />
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
                            {nearbyPatients.length} EMERGENCY {nearbyPatients.length === 1 ? 'SIGNAL' : 'SIGNALS'}
                        </span>
                    </div>
                    {acceptingPatientId && (
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="bg-slate-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-slate-600 p-2 rounded-full transition-colors relative"
                        >
                            <MessageCircle size={20} />
                            {hasUnread && !isChatOpen && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="relative pointer-events-auto">
                        <select
                            className="w-full appearance-none bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-danger/50 transition-shadow drop-shadow-sm cursor-pointer pointer-events-auto"
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
                            className="mt-1 flex items-center justify-center gap-2 bg-success/10 dark:bg-success-dark/20 text-success dark:text-success-light py-2 rounded-xl border border-success/20 pointer-events-auto"
                        >
                            <Locate size={16} strokeWidth={3} className="animate-pulse" />
                            <span className="text-[0.8rem] font-black uppercase tracking-wider">
                                Tracking: {formatDist(nearbyPatients.find(p => p.user.id === acceptingPatientId)!.distance)}
                            </span>
                        </motion.div>
                    )}

                    {/* Expandable Chat Area */}
                    {isChatOpen && acceptingPatientId && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 mt-2 flex flex-col gap-3 relative z-10 h-48 pointer-events-auto"
                        >
                            <div className="flex-1 overflow-y-auto pr-2 space-y-2 text-sm flex flex-col pointer-events-auto">
                                {chatMessages.length === 0 ? (
                                    <div className="text-slate-500 text-center text-xs italic my-auto">
                                        Send a reassurement message to the patient.
                                    </div>
                                ) : (
                                    chatMessages.map((msg, i) => (
                                        <div key={i} className={clsx("flex flex-col max-w-[85%] rounded-lg p-2", msg.senderId === 'me' ? 'self-end bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 items-end' : 'self-start bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 items-start')}>
                                            <span className="font-medium text-[13px]">{msg.message}</span>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMsg} className="flex gap-2 pointer-events-auto">
                                <input
                                    type="text"
                                    value={msgInput}
                                    onChange={e => setMsgInput(e.target.value)}
                                    placeholder="Quick message..."
                                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-lg px-3 py-2 text-sm outline-none border border-slate-200 dark:border-slate-600 focus:border-emerald-500 transition-colors pointer-events-auto"
                                />
                                <button type="submit" disabled={!msgInput.trim()} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors pointer-events-auto">
                                    <Send size={16} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </AnimatePresence>
    ) : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#064E3B] dark:bg-[#022C22] font-inter overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col"
        >
            {/* Dynamic Sticky Background Brand Layer */}
            <div className="sticky top-0 left-0 w-full pt-12 px-6 pb-20 flex flex-col text-white pointer-events-none z-0">
                <div className="flex items-center justify-between mb-4 pointer-events-auto relative z-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold opacity-90 tracking-widest uppercase text-emerald-100 drop-shadow-sm">Responder Active</span>
                        <img src="/logo.svg" alt="MedEm" className="w-12 h-12 drop-shadow-md mt-1" />
                    </div>
                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm mt-1">
                        <span className="text-white text-xs font-black leading-none px-1 drop-shadow-sm">DR</span>
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight mb-2 relative z-10 drop-shadow-md">Dr. {name}</h1>
                <p className="text-emerald-100/95 font-medium text-[1.1rem] max-w-[280px] leading-relaxed relative z-10 drop-shadow-sm">
                    Standing by for emergency tracking signals.
                </p>

                {/* SystemAnnouncementPlaceholder Frame */}
                <div id="SystemAnnouncementPlaceholder" className="w-full empty:hidden mt-4 relative z-10 pointer-events-auto flex flex-col transition-all duration-300">
                    {/* Placeholder content goes here in the future - currently empty */}
                </div>

                {/* Decoration Graphic */}
                <div className="absolute top-10 right-0 opacity-[0.10] transform translate-x-1/4 scale-125 pointer-events-none z-0">
                    <Activity size={180} strokeWidth={1} />
                </div>
            </div>

            {/* Main Content Card Layer */}
            <div className="relative z-10 w-full -mt-10 px-0 flex flex-col shrink-0 flex-1">
                {/* Responsive White/Dark Card */}
                <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-[0_-12px_30px_rgb(0,0,0,0.18)] p-6 min-h-[500px] flex flex-col items-center gap-6 pointer-events-auto border-t border-emerald-500/10 flex-1 relative z-20">

                    {/* 1. Target Selection Box */}
                    {/* 1. Target Selection Box */}
                    {TargetSelectionBox}

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
                            onTargetReached={handleTargetReached}
                            fullscreenOverlay={TargetSelectionBox}
                            centerMapToMe={centerMapToMe}
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

                </div>

                {/* Footer Section revealing the fixed background */}
                <div className="w-full pt-8 pb-32 mt-2 flex items-center justify-center text-emerald-100/80 font-medium tracking-wide">
                    Built with <HeartPulse size={20} className="mx-2 text-danger animate-pulse" /> to help
                </div>
            </div>
        </motion.div>
    );
};
