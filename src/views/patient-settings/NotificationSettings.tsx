export const NotificationSettings = () => (
    <div className="space-y-4">
        {['Emergency Alerts', 'Responder ETA Updates', 'Nearby SOS Requests (Volunteer)'].map((label, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <input type="checkbox" defaultChecked={i !== 2} className="w-5 h-5 accent-med-DEFAULT cursor-pointer" />
            </div>
        ))}
    </div>
);
