export const ResponderSettings = () => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Response Vehicle Mode</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="Personal Vehicle">
                <option>Walking / Running</option>
                <option>Bicycle</option>
                <option>Personal Vehicle</option>
                <option>Registered Ambulance</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Notification Radius</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" defaultValue="5 km">
                <option>1 km</option>
                <option>5 km</option>
                <option>10 km</option>
                <option>Region Wide</option>
            </select>
        </div>
        <button className="w-full bg-success-DEFAULT text-white font-bold py-3.5 rounded-xl hover:bg-success-dark transition-colors active:scale-95 shadow-md">Update Preferences</button>
    </div>
);
