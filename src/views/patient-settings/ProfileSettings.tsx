import { useState, useEffect } from 'react';
import { Plus, X, Lock, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export const ProfileSettings = ({ name }: { name: string }) => {
    const [dob, setDob] = useState('');
    const [age, setAge] = useState<number | null>(null);
    const [conditions, setConditions] = useState<string[]>(['']);
    const [consent, setConsent] = useState(false);

    // Calculate age automatically whenever DOB changes
    useEffect(() => {
        if (!dob) {
            setAge(null);
            return;
        }
        const birthDate = new Date(dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        setAge(calculatedAge >= 0 ? calculatedAge : null);
    }, [dob]);

    const handleAddCondition = () => {
        if (conditions.length < 10) {
            setConditions([...conditions, '']);
        }
    };

    const handleRemoveCondition = (index: number) => {
        const newArr = [...conditions];
        newArr.splice(index, 1);
        setConditions(newArr.length === 0 ? [''] : newArr);
    };

    const handleConditionChange = (text: string, index: number) => {
        // Enforce max 20 chars per box as requested
        if (text.length <= 20) {
            const newArr = [...conditions];
            newArr[index] = text;
            setConditions(newArr);
        }
    };

    return (
        <div className="space-y-6 pb-6">
            
            {/* Core Identity Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-med" /> Official Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Official Full Name</label>
                        <input type="text" defaultValue={name} className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-med/20 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                            Date of Birth
                            {age !== null && <span className="text-xs font-black text-med bg-med-50 dark:bg-med-900/30 px-2 rounded-md">{age} yrs old</span>}
                        </label>
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-med/20 outline-none transition-all" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                        <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-med/20 outline-none transition-all">
                            <option value="">Select Gender...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not">Prefer not to say</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group (Critical)</label>
                        <select className="w-full px-4 py-3 text-sm rounded-xl border border-danger-200 dark:border-danger-900/30 bg-danger-50 flex items-center dark:bg-danger-950/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-danger/20 outline-none transition-all font-bold" defaultValue="Unknown">
                            <option value="Unknown">Unknown</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Medical History Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Medical History
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">List prior known conditions or severe allergies.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {conditions.map((cond, idx) => (
                        <div key={idx} className="flex flex-col gap-1 items-end relative w-full">
                            <div className="flex w-full items-center gap-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Asthma, Penicillin Allergic"
                                    value={cond}
                                    onChange={(e) => handleConditionChange(e.target.value, idx)}
                                    className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-med outline-none transition-colors"
                                />
                                {conditions.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveCondition(idx)}
                                        className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-xl transition-colors shrink-0"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            <span className={clsx("text-[10px] font-bold px-2", cond.length === 20 ? "text-danger" : "text-slate-400")}>
                                {cond.length}/20 chars
                            </span>
                        </div>
                    ))}
                    
                    <button 
                        onClick={handleAddCondition}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                        <Plus size={16} /> Add Another Prior Condition
                    </button>
                </div>
            </div>

            {/* Encrypted IDs & Phase 3 Placholder */}
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-indigo-500">
                    <Lock size={64} />
                </div>
                
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    <Lock size={18} className="text-indigo-500" /> Secure Identifiers
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300/80 leading-relaxed max-w-[90%]">
                    <b>Phase 3 Notice:</b> ABHA integrations are currently inactive pending full Supabase Row-Level Security integration. Entering data here will map strictly to encrypted DB schemas when live.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[13px] font-bold text-indigo-900 dark:text-indigo-200 mb-1.5 flex items-center justify-between">
                            ABHA Address (Health ID)
                            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">AES-256 Encrypted</span>
                        </label>
                        <input type="text" placeholder="yourname@abdm" disabled className="w-full px-4 py-3 text-sm rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-mono tracking-wide cursor-not-allowed" />
                    </div>
                </div>
            </div>

            {/* Responder Medical Consent */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-5 rounded-2xl shadow-sm space-y-4 text-sm">
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        <input 
                            type="checkbox" 
                            id="consentCheck"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 bg-white border-amber-300 dark:border-amber-700 dark:bg-slate-900 cursor-pointer"
                        />
                    </div>
                    <div>
                        <label htmlFor="consentCheck" className="font-bold text-amber-900 dark:text-amber-100 block mb-1 cursor-pointer">
                            Emergency Rescue Data Consent
                        </label>
                        <p className="text-amber-700/80 dark:text-amber-200/70 text-xs leading-relaxed font-medium">
                            I consent to securely unlocking and transmitting my physical age, blood group, and listed prior medical conditions exclusively to my locally verified **Emergency Responder** the moment a rescue attempt is formally accepted. This assists in providing accurate first-aid before they reach me.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />
            
            <button className="w-full bg-med text-white font-bold py-4 rounded-xl hover:bg-med-dark transition-colors active:scale-95 shadow-lg shadow-med/20 flex flex-col items-center justify-center gap-0.5 relative">
                <span className="text-[15px]">Save Medical Profile</span>
                <span className="text-[10px] font-medium opacity-80 flex items-center gap-1"><ShieldCheck size={10} /> Protected locally, pending Phase 3 DB merge</span>
            </button>
        </div>
    );
};
