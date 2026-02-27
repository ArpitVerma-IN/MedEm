import { Home, Bot, History, UserCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'ai' | 'history' | 'profile';

interface BottomNavProps {
    activeTab: TabType;
    onChange: (tab: TabType) => void;
    userType: 'Patient' | 'Doctor';
}

export const BottomNav = ({ activeTab, onChange, userType }: BottomNavProps) => {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'ai', label: 'AI Assist', icon: Bot },
        { id: 'history', label: 'History', icon: History },
        { id: 'profile', label: 'Profile', icon: UserCircle2 },
    ];

    // Specific accent coloring based on role and tab
    const getTabColor = (isActive: boolean) => {
        if (!isActive) return 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400';
        return userType === 'Patient' ? 'text-med-DEFAULT' : 'text-success-DEFAULT';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id as TabType)}
                            className={clsx(
                                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                getTabColor(isActive)
                            )}
                        >
                            <div className="relative">
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className={clsx(
                                            "absolute -bottom-2 w-1 h-1 rounded-full left-1/2 -translate-x-1/2",
                                            userType === 'Patient' ? 'bg-med-DEFAULT' : 'bg-success-DEFAULT'
                                        )}
                                    />
                                )}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
