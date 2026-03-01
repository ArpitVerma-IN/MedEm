import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useLiveTracker } from '../hooks/useLiveTracker';
import { BottomNav } from '../components/BottomNav';
import type { TabType } from '../components/BottomNav';

// Views
import { DoctorHomeView } from '../views/DoctorHomeView';
import { DoctorHistoryView } from '../views/DoctorHistoryView';
import { DoctorProfileView } from '../views/DoctorProfileView';

const colors = ['#059669', '#10B981', '#34D399', '#047857'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const DoctorDashboard = () => {
    const routerState = useLocation().state as { name?: string } | null;
    const navigate = useNavigate();

    const [name] = useState(routerState?.name || localStorage.getItem('medem_guest_name') || '');
    const [myColor] = useState(getRandomColor());
    const [error, setError] = useState<string | null>(null);

    const [isJoined, setIsJoined] = useState(false);
    const [isAcceptingHelp, setIsAcceptingHelp] = useState(false);
    const [acceptingPatientId, setAcceptingPatientId] = useState<string | null>(null);
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
        userType: 'Doctor',
        myColor,
        isJoined,
        needsCare: false,
        isAcceptingHelp,
        acceptingPatientId,
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
        return <div className="flex justify-center items-center h-screen w-screen bg-slate-900 text-white font-medium tracking-wide">Connecting to emergency network...</div>;
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[24px] p-8 shadow-2xl border border-white/10 text-center">
                    <h2 className="text-2xl font-bold text-danger-DEFAULT mb-2">Connection Error</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{error}</p>
                    <button className="w-full bg-danger-DEFAULT hover:bg-danger-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]" onClick={() => navigate('/')}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#064E3B] dark:bg-[#022C22] font-inter overflow-hidden relative">
            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col w-full h-full overflow-hidden shrink-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {activeTab === 'home' && (
                        <DoctorHomeView
                            key="home"
                            name={name}
                            myColor={myColor}
                            myLocation={myLocation}
                            users={users}
                            incomingDoctors={incomingDoctors}
                            nearbyPatients={nearbyPatients}
                            acceptingPatientId={acceptingPatientId}
                            setAcceptingPatientId={setAcceptingPatientId}
                            setIsAcceptingHelp={setIsAcceptingHelp}
                            centerMapToMe={centerMapToMe}
                        />
                    )}
                    {activeTab === 'history' && <DoctorHistoryView key="history" />}
                    {activeTab === 'profile' && <DoctorProfileView key="profile" name={name} />}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <BottomNav
                activeTab={activeTab}
                onChange={setActiveTab}
                userType="Doctor"
            />
        </div>
    );
};
