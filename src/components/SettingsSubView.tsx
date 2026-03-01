import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export const SettingsSubView = ({ title, onBack, children }: { title: string, onBack: () => void, children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col absolute inset-0 z-40 bg-slate-50 dark:bg-slate-950 overflow-y-auto w-full h-full pb-24"
        >
            <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} className="text-slate-900 dark:text-white" />
                </button>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            <div className="p-4 flex flex-col gap-6">
                {children}
            </div>
        </motion.div>
    );
};
