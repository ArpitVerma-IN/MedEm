import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useLiveTracker } from '../hooks/useLiveTracker';
import { BottomNav } from '../components/BottomNav';
import type { TabType } from '../components/BottomNav';
import { ErrorBoundary } from '../core/error/ErrorBoundary';

// Views
import { PatientHomeView } from '../views/PatientHomeView';
import { Suspense, lazy } from 'react';

// Lazy loaded views for Phase 2/3 performance
const AIAssistView = lazy(() => import('../views/PatientAIAssistView').then(m => ({ default: m.AIAssistView })));
const HistoryView = lazy(() => import('../views/PatientHistoryView').then(m => ({ default: m.HistoryView })));
const ProfileView = lazy(() => import('../views/PatientProfileView').then(m => ({ default: m.ProfileView })));

const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const PatientDashboard = () => {
    const routerState = useLocation().state as { name?: string } | null;
    const navigate = useNavigate();

    const [name] = useState(routerState?.name || localStorage.getItem('medem_guest_name') || '');
    const [myColor] = useState(getRandomColor());
    const [error, setError] = useState<string | null>(null);

    const [isJoined, setIsJoined] = useState(false);
    const [needsCare, setNeedsCare] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('home');

    const {
        myLocation,
        users,
        nearbyPatients,
        incomingDoctors,
        messages,
        sendMessage,
        sendRating,
        triggerJoin,
        setMyLocation,
        nearbyDoctorsCount
    } = useLiveTracker({
        name,
        userType: 'Patient',
        myColor,
        isJoined,
        needsCare,
        onError: setError,
        onJoinSuccess: () => setIsJoined(true)
    });

    useEffect(() => {
        if (!name) {
            navigate('/');
        } else if (!isJoined) {
            triggerJoin();
        }
    }, [name, isJoined, triggerJoin, navigate]);

    const centerMapToMe = () => {
        if (myLocation) {
            setMyLocation({ ...myLocation });
        }
    };

    if (!isJoined && !error) {
        return <div className="flex justify-center items-center h-screen w-screen bg-gray-900 text-white font-medium tracking-wide">Connecting to network...</div>;
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[24px] p-8 shadow-2xl border border-white/20 text-center">
                    <h2 className="text-2xl font-bold text-danger mb-2">Connection Error</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">{error}</p>
                    <button className="w-full bg-danger hover:bg-danger-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]" onClick={() => navigate('/')}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-gray-50 dark:bg-gray-950 overflow-hidden font-inter text-gray-900 dark:text-gray-100">
            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col w-full h-full overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {activeTab === 'home' && (
                        <PatientHomeView
                            key="home"
                            name={name}
                            myColor={myColor}
                            myLocation={myLocation}
                            users={users}
                            incomingDoctors={incomingDoctors}
                            nearbyPatients={nearbyPatients}
                            needsCare={needsCare}
                            setNeedsCare={setNeedsCare}
                            messages={messages}
                            sendMessage={sendMessage}
                            centerMapToMe={centerMapToMe}
                            nearbyDoctorsCount={nearbyDoctorsCount}
                        />
                    )}
                    {activeTab === 'ai' && (
                        <motion.div key="ai" className="flex-1 flex flex-col h-full w-full" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                            <ErrorBoundary>
                                <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-med animate-spin"></div></div>}>
                                    <AIAssistView />
                                </Suspense>
                            </ErrorBoundary>
                        </motion.div>
                    )}
                    {activeTab === 'history' && (
                        <motion.div key="history" className="flex-1 flex flex-col h-full w-full" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                            <ErrorBoundary>
                                <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-med animate-spin"></div></div>}>
                                    <HistoryView sendRating={sendRating} />
                                </Suspense>
                            </ErrorBoundary>
                        </motion.div>
                    )}
                    {activeTab === 'profile' && (
                        <motion.div key="profile" className="flex-1 flex flex-col h-full w-full" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                            <ErrorBoundary>
                                <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-med animate-spin"></div></div>}>
                                    <ProfileView name={name} />
                                </Suspense>
                            </ErrorBoundary>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <BottomNav
                activeTab={activeTab}
                onChange={setActiveTab}
                userType="Patient"
            />
        </div>
    );
};
