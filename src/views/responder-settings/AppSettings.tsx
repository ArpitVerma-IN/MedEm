export const AppSettings = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Continuous Location Broadcasting</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Required for accurately dispatching nearby SOS</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-success-DEFAULT cursor-pointer" />
        </div>
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Background App Refresh</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Keep MedEm alive while in pocket</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-success-DEFAULT cursor-pointer" />
        </div>
    </div>
);
