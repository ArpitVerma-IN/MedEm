import { Info } from 'lucide-react';

export const AboutMedEm = () => (
    <div className="space-y-6">
        <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-16 h-16 bg-med-100 dark:bg-med-900/40 text-med dark:text-med-light rounded-[20px] flex items-center justify-center shadow-inner border border-med-200 dark:border-med/20 mb-4">
                <Info size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About MedEm</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Version 1.0.0</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Your Lifeline in Emergencies</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    MedEm is a high-performance, real-time emergency tracking application leveraging precise geolocation to instantly connect you with nearby medical responders.
                </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <span className="bg-med text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">?</span>
                    How to use MedEm
                </h5>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
                    <li><strong className="text-slate-700 dark:text-slate-300">Send an SOS:</strong> Tap the red emergency button on your home screen to instantly broadcast an SOS to all nearby active doctors.</li>
                    <li><strong className="text-slate-700 dark:text-slate-300">Stay Connected:</strong> Once a responder accepts, our live map streams your precise location exclusively to them.</li>
                    <li><strong className="text-slate-700 dark:text-slate-300">Communicate:</strong> Use the secure chat to exchange vital details with your incoming responder.</li>
                </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 mt-4">
                <h5 className="text-blue-800 dark:text-blue-300 font-bold mb-1">Coming Soon (Phase 2 & 3)</h5>
                <ul className="text-xs text-blue-700/80 dark:text-blue-300/80 list-disc pl-4 space-y-1">
                    <li>Secure authentication (Google & Email).</li>
                    <li>AI-summarized past medical records for emergency responders.</li>
                </ul>
            </div>
        </div>

        <div className="flex justify-center mt-8">
            <a href="https://github.com/ArpitVerma-IN/MedEm" target="_blank" rel="noopener noreferrer" className="text-med hover:text-med-dark dark:text-med-light dark:hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                View Project on GitHub
            </a>
        </div>
    </div>
);
