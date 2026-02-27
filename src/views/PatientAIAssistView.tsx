import { motion } from 'framer-motion';

export const AIAssistView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-gray-950 pb-24"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Assist</h2>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
                <h3 className="font-semibold text-lg text-med-DEFAULT mb-2">Generate Reports Summary</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    Upload your past medical records to generate a clear, 3-point emergency briefing for any incoming paramedic or doctor. Our AI models will parse and simplify complex medical histories securely.
                </p>
                <button className="w-full bg-med-DEFAULT text-white font-medium py-3 rounded-xl shadow-md hover:bg-med-dark transition-colors">
                    Upload New Record
                </button>
            </div>

            <div className="bg-med-light/20 dark:bg-med-dark/30 rounded-2xl p-5 border border-med-light/30 dark:border-med-dark mb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-med-DEFAULT animate-pulse" />
                    <h4 className="font-semibold text-med-dark dark:text-med-light">Pending Report Analysis</h4>
                </div>
                <p className="text-xs text-med-DEFAULT dark:text-med-light font-medium tracking-wide">
                    Bloodwork_2025.pdf is currently being analyzed by Gemini Vision AI...
                </p>
            </div>
        </motion.div>
    );
};
