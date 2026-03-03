export const AppSettings = () => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="English (US)">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
            </select>
        </div>
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Precise Location Tracking</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Allow MedEm to trace location pings</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-med-DEFAULT cursor-pointer" />
        </div>
    </div>
);
