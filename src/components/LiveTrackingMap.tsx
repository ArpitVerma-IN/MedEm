import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { User, Location as UserLocation } from '../types';

// Create a custom hook to center the map on a location
const MapController = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, map]);
    return null;
};

// Custom marker icon creation
const createCustomIcon = (color: string, label: string, isFlickering: boolean = false) => {
    const customHtml = `
    <div class="custom-marker ${isFlickering ? 'flicker' : ''}">
      <div class="marker-pin" style="background-color: ${color};"></div>
      <div class="marker-icon">${label}</div>
    </div>
  `;

    return L.divIcon({
        html: customHtml,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

interface LiveTrackingMapProps {
    myLocation: UserLocation | null;
    name: string;
    userType: 'Doctor' | 'Patient';
    myColor: string;
    needsCare: boolean;
    users: Map<string, User>;
    incomingDoctors: { user: User, distance: number }[];
    nearbyPatients: { user: User, distance: number }[];
    acceptingPatientId: string | null;
}

export const LiveTrackingMap = ({
    myLocation,
    name,
    userType,
    myColor,
    needsCare,
    users,
    incomingDoctors,
    nearbyPatients,
    acceptingPatientId
}: LiveTrackingMapProps) => {
    const [isMapVisible, setIsMapVisible] = useState(false);

    const defaultCenter: [number, number] = useMemo(() => {
        return myLocation ? [myLocation.lat, myLocation.lng] : [51.505, -0.09];
    }, [myLocation]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    return (
        <div className="w-full h-full flex-1 flex flex-col relative bg-transparent overflow-hidden border-t border-transparent">
            {!isMapVisible ? (
                <div className="w-full h-full flex flex-col items-center justify-center pt-24 pb-8 px-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 shadow-inner">
                            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-[250px]">
                            Live tracking map is collapsed to save battery and network data while on standby.
                        </p>
                        <button
                            onClick={() => setIsMapVisible(true)}
                            className="mt-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-6 py-3 font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            <svg className="w-5 h-5 text-med-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            View Live Map
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative z-0 flex-1 animate-in fade-in zoom-in-95 duration-300">
                    <MapContainer
                        center={defaultCenter}
                        zoom={15}
                        zoomControl={false}
                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {myLocation && <MapController center={[myLocation.lat, myLocation.lng]} />}

                        {/* My Marker */}
                        {myLocation && (
                            <Marker
                                position={[myLocation.lat, myLocation.lng]}
                                icon={createCustomIcon(myColor, name.charAt(0).toUpperCase())}
                            >
                                <Popup>
                                    <strong>{name} ({userType} - You)</strong><br />
                                    {needsCare ? "Needs Medical Care!" : "Current location"}
                                </Popup>
                            </Marker>
                        )}

                        {/* Other Users' Markers */}
                        {Array.from(users.values()).map(user => {
                            if (!user.location || !user.location.lat || !user.location.lng) return null;

                            if (userType === 'Patient' && user.userType === 'Doctor') {
                                const isIncoming = incomingDoctors.some(d => d.user.id === user.id);
                                if (!isIncoming) return null; // hide doctor's location
                            }

                            let isFlickering = false;
                            let distanceStr = '';

                            if (userType === 'Doctor') {
                                const match = nearbyPatients.find(p => p.user.id === user.id);
                                if (match) {
                                    isFlickering = true;
                                    distanceStr = ` (${formatDist(match.distance)})`;
                                }
                            }

                            return (
                                <Marker
                                    key={user.id}
                                    position={[user.location.lat, user.location.lng]}
                                    icon={createCustomIcon(
                                        user.color,
                                        user.name.charAt(0).toUpperCase(),
                                        isFlickering && (acceptingPatientId === null || acceptingPatientId === user.id)
                                    )}
                                >
                                    <Popup>
                                        <strong>{user.name} ({user.userType}){distanceStr}</strong><br />
                                        {user.needsCare ? "Needs Medical Care!" : (user.isAcceptingHelp && user.userType === 'Doctor' ? "On the way to help" : "User's location")}
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};
