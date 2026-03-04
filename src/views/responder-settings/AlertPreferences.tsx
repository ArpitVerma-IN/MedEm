export const AlertPreferences = () => (
    <div className="space-y-4">
        {['Critical SOS Overrides (Bypass DND)', 'Passive Assistance Requests', 'In-App Sound Pings'].map((label, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <input type="checkbox" defaultChecked={i !== 1} className="w-5 h-5 accent-success cursor-pointer" />
            </div>
        ))}
    </div>
);
