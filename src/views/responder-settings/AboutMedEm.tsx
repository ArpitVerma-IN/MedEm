import { Info } from 'lucide-react';

export const AboutMedEm = () => (
    <div className="space-y-6">
        <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/40 text-success dark:text-success-light rounded-[20px] flex items-center justify-center shadow-inner border border-success-200 dark:border-success/20 mb-4">
                <Info size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About MedEm</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Responder Edition - v1.0.0</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Empowering Real-Time Rescues</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                MedEm functions as a high-frequency tracking network specifically designed for verified medical professionals to intercept emergency SOS beacons in their direct vicinity.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <h5 className="text-blue-800 dark:text-blue-300 font-bold mb-1">Coming Soon (Phase 2 & 3)</h5>
                <ul className="text-xs text-blue-700/80 dark:text-blue-300/80 list-disc pl-4 space-y-1">
                    <li>AI Vision-based verification of your uploaded medical credentials.</li>
                    <li>Live AI-Summaries of patient history generated the moment you accept an SOS.</li>
                </ul>
            </div>
        </div>

        <div className="flex justify-center mt-8">
            <a href="https://github.com/ArpitVerma-IN/MedEm" target="_blank" rel="noopener noreferrer" className="text-success hover:text-success-dark dark:text-success-light dark:hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                View Project on GitHub
            </a>
        </div>
    </div>
);
