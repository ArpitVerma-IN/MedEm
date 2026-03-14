import { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, X } from 'lucide-react';

export const AccountSettings = () => {
    const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('medem_ai_provider') || 'gemini');
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('medem_ai_api_key') || '');
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        localStorage.setItem('medem_ai_provider', aiProvider);
    }, [aiProvider]);

    useEffect(() => {
        localStorage.setItem('medem_ai_api_key', apiKey);
    }, [apiKey]);

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <KeyRound size={80} />
                </div>
                
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-med" />
                    AI Assistant Provider (Demo Mode)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed font-medium pr-8">
                    Configure your personal LLM API keys for the Phase 3 Medical Summarization Engine. Keys are stored locally and completely encrypted in transit.
                </p>

                <div className="space-y-4 relative z-10">
                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">Select Provider</label>
                        <select 
                            value={aiProvider}
                            onChange={(e) => setAiProvider(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-med"
                        >
                            <option value="gemini">Google Gemini (Recommended)</option>
                            <option value="openai">OpenAI (GPT-4o)</option>
                            <option value="claude">Anthropic (Claude 3.5 Sonnet)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">Encrypted API Key</label>
                        <div className="relative flex items-center">
                            <input 
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder={`Enter your ${aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)} API Key...`}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-med pr-24 transition-all placeholder:text-slate-400"
                            />
                            <div className="absolute right-2 flex items-center gap-1">
                                {apiKey && (
                                    <button 
                                        onClick={() => setApiKey('')}
                                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                                        title="Clear Key"
                                    >
                                        <X size={16} strokeWidth={3} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                                >
                                    {showKey ? 'HIDE' : 'SHOW'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <a 
                        href="https://github.com/ArpitVerma-IN/MedEm#ai-assist-api-keys--phase-3" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-block mt-2 text-xs font-semibold text-med hover:text-med-dark dark:hover:text-med-light transition-colors underline underline-offset-2"
                    >
                        Click here to read how to safely generate your own API key.
                    </a>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Account Export</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">Download a copy of your encrypted medical history and location ping records.</p>
                <button className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors active:scale-95">Request Data Archive</button>
            </div>

            <div className="bg-danger-50 dark:bg-danger-900/10 p-5 rounded-2xl border border-danger-200 dark:border-danger-900/30">
                <h3 className="text-sm font-bold text-danger dark:text-danger-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-danger-800/80 dark:text-danger-400/80 mb-4 leading-relaxed font-medium">Permanently delete your account and wipe all history from our secure MedEm servers.</p>
                <button className="w-full bg-danger text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-danger-dark transition-colors active:scale-95">Delete Account</button>
            </div>
        </div>
    );
};
