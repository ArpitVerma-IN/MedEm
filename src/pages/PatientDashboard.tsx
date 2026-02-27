import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useLiveTracker } from '../hooks/useLiveTracker';
import { BottomNav } from '../components/BottomNav';
import type { TabType } from '../components/BottomNav';

// Views
import { PatientHomeView } from '../views/PatientHomeView';
import { AIAssistView } from '../views/PatientAIAssistView';
import { HistoryView } from '../views/PatientHistoryView';
import { ProfileView } from '../views/PatientProfileView';

const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const PatientDashboard = () => {
    const routerState = useLocation().state as { name?: string } | null;
    const navigate = useNavigate();

    const [name] = useState(routerState?.name || '');
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
        triggerJoin,
        setMyLocation
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
                    <h2 className="text-2xl font-bold text-danger-DEFAULT mb-2">Connection Error</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">{error}</p>
                    <button className="w-full bg-danger-DEFAULT hover:bg-danger-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]" onClick={() => navigate('/')}>
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
                <AnimatePresence mode="popLayout" initial={false}>
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
                            centerMapToMe={centerMapToMe}
                        />
                    )}
                    {activeTab === 'ai' && <AIAssistView key="ai" />}
                    {activeTab === 'history' && <HistoryView key="history" />}
                    {activeTab === 'profile' && <ProfileView key="profile" name={name} />}
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
