import { useState } from 'react';

export const ResponderSettings = () => {
    const [radius, setRadius] = useState(() => localStorage.getItem('medem_geofence_radius') || '2000');
    const [vehicle, setVehicle] = useState('Personal Vehicle');
    const [saved, setSaved] = useState(false);

    const handleUpdate = () => {
        localStorage.setItem('medem_geofence_radius', radius);
        window.dispatchEvent(new Event('geofence_changed'));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Response Vehicle Mode</label>
                <select value={vehicle} onChange={e => setVehicle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option>Walking / Running</option>
                    <option>Bicycle</option>
                    <option>Personal Vehicle</option>
                    <option>Registered Ambulance</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Notification Radius</label>
                <select value={radius} onChange={e => setRadius(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    <option value="500">500 meters (Urban areas)</option>
                    <option value="1000">1 km (Semi-Urban areas)</option>
                    <option value="2000">2 km (Rural areas)</option>
                </select>
            </div>
            <button onClick={handleUpdate} className="w-full bg-success text-white font-bold py-3.5 rounded-xl hover:bg-success-dark transition-colors active:scale-95 shadow-md">
                {saved ? 'Preferences Updated!' : 'Update Preferences'}
            </button>
        </div>
    );
};
