import { useEffect, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, Minimize2, X, Locate, Moon, Sun, Navigation, NavigationOff, MapPin, List, CornerDownLeft, CornerDownRight, ArrowUp, RotateCw } from 'lucide-react';
import type { User, Location as UserLocation } from '../types';

// Create a custom hook to center the map on a location with a slight debounce
const MapController = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (!center) return;

        // Delay centering to smoothen out quick flickering from noisy live location pings
        const timeoutId = setTimeout(() => {
            map.flyTo(center, map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [center, map]);
    return null;
};

// Custom marker icon creation
const createCustomIcon = (color: string, label: string, isFlickering: boolean = false, type: 'Doctor' | 'Patient' | 'SOS' = 'Patient') => {
    if (type === 'SOS') {
        const customHtml = `
        <div class="custom-marker flicker">
          <div class="marker-pin" style="background-color: #EF4444;"></div>
        </div>
      `;
        return L.divIcon({
            html: customHtml,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    }

    const borderCol = type === 'Doctor' ? '#047857' : '#1D4ED8';
    
    const customHtml = `
    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; border: 3px solid ${borderCol}; box-shadow: 0 0 6px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 800; ${isFlickering ? 'animation: pulse 1.5s infinite;' : ''}">
        ${label}
    </div>
  `;

    return L.divIcon({
        html: customHtml,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

const createArrowIcon = (color: string, heading: number) => {
    return L.divIcon({
        html: `<div style="transform: rotate(${heading}deg); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
              <path d="M12 2L22 22L12 18L2 22L12 2Z"></path>
            </svg>
        </div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
    });
};

const getNavIconType = (modifier: string) => {
    switch (modifier) {
        case 'left': case 'slight-left': case 'sharp-left': return <CornerDownLeft size={20} strokeWidth={2.5} />;
        case 'right': case 'slight-right': case 'sharp-right': return <CornerDownRight size={20} strokeWidth={2.5} />;
        case 'uturn': return <RotateCw size={20} strokeWidth={2.5} />;
        default: return <ArrowUp size={20} strokeWidth={2.5} />;
    }
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
    fullscreenOverlay?: React.ReactNode;
    centerMapToMe?: () => void;
    onTargetReached?: (target: User, address: string | null) => void;
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
    acceptingPatientId,
    fullscreenOverlay,
    centerMapToMe,
    onTargetReached
}: LiveTrackingMapProps) => {
    type MapState = 'collapsed' | 'mini' | 'large';
    const [mapState, setMapState] = useState<MapState>('collapsed');
    const [isMapDark, setIsMapDark] = useState(false);
    
    // Navigation Features UI States
    const [isNavEnabled, setIsNavEnabled] = useState(false);
    const [navData, setNavData] = useState<any | null>(null);
    const [navAddress, setNavAddress] = useState<string | null>(null);
    const [navHeading, setNavHeading] = useState<number>(0);
    const [isNavAssistMinimized, setIsNavAssistMinimized] = useState(false);

    const prevLocationRef = useRef<UserLocation | null>(null);
    const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latestMyLocation = useRef(myLocation);
    useEffect(() => { latestMyLocation.current = myLocation; }, [myLocation]);

    // Track highest-priority target
    const activeTargetInfo = useMemo(() => {
        if (!myLocation) return null;
        const myLL = L.latLng(myLocation.lat, myLocation.lng);
        if (userType === 'Doctor') {
             if (acceptingPatientId) {
                  const u = Array.from(users.values()).find(u => u.id === acceptingPatientId);
                  if (u && u.location) return { user: u, distance: myLL.distanceTo(L.latLng(u.location.lat, u.location.lng)) };
                  return null;
             }
             if (nearbyPatients.length > 0) return nearbyPatients.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
             return null;
        } else {
             if (incomingDoctors.length > 0) return incomingDoctors.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
             return null;
        }
    }, [users, acceptingPatientId, nearbyPatients, incomingDoctors, userType, myLocation]);

    const activeTargetUser = activeTargetInfo?.user;
    const activeTargetDistance = activeTargetInfo?.distance;
    
    // Explicitly confirm emergency contexts to prevent random passersby triggering Arrival Banners
    const hasReachedTarget = activeTargetDistance !== undefined && activeTargetDistance <= 40 
        && (userType === 'Doctor' ? (acceptingPatientId === activeTargetUser?.id && activeTargetUser?.needsCare) : true);

    const targetLoc = activeTargetUser?.location;
    const targetId = activeTargetUser?.id;
    const latestTargetLoc = useRef(targetLoc);
    useEffect(() => { latestTargetLoc.current = targetLoc; }, [targetLoc]);

    // Shut off nav automatically if reached
    useEffect(() => {
        if (hasReachedTarget && isNavEnabled) setIsNavEnabled(false);
    }, [hasReachedTarget, isNavEnabled]);

    const reachEventFired = useRef<string | null>(null);
    useEffect(() => {
        if (hasReachedTarget && activeTargetUser && reachEventFired.current !== activeTargetUser.id) {
            reachEventFired.current = activeTargetUser.id;
            if (onTargetReached) {
                onTargetReached(activeTargetUser, navAddress);
            }
        } else if (!hasReachedTarget && activeTargetUser && reachEventFired.current === activeTargetUser.id) {
            reachEventFired.current = null; // Reset if they drift apart
        }
    }, [hasReachedTarget, activeTargetUser, navAddress, onTargetReached]);

    // Live Heading Compute
    useEffect(() => {
        if (myLocation && prevLocationRef.current) {
            const lat1 = prevLocationRef.current.lat;
            const lon1 = prevLocationRef.current.lng;
            const lat2 = myLocation.lat;
            const lon2 = myLocation.lng;
            if (lat1 !== lat2 || lon1 !== lon2) {
                const dy = lon2 - lon1;
                const y = Math.sin((dy * Math.PI)/180) * Math.cos((lat2 * Math.PI)/180);
                const x = Math.cos((lat1 * Math.PI)/180) * Math.sin((lat2 * Math.PI)/180) - Math.sin((lat1 * Math.PI)/180) * Math.cos((lat2 * Math.PI)/180) * Math.cos((dy * Math.PI)/180);
                const theta = Math.atan2(y, x);
                setNavHeading((theta * 180 / Math.PI + 360) % 360);
            }
        }
        prevLocationRef.current = myLocation;
    }, [myLocation?.lat, myLocation?.lng]);
    
    // Nearest Landmark Compute
    useEffect(() => {
        if (!isNavEnabled || !targetLoc || !targetId) return;
        let active = true;
        const fetchAddress = async () => {
             try {
                 const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLoc.lat}&lon=${targetLoc.lng}&zoom=18&addressdetails=1`);
                 const data = await res.json();
                 if (active && data?.display_name) {
                     const name = data.name || data.address?.road || data.display_name.split(',')[0];
                     setNavAddress(name);
                 }
             } catch(e) {}
        };
        fetchAddress();
        return () => { active = false; };
    }, [isNavEnabled, targetId]); 

    // Live Route Compute
    useEffect(() => {
         if (!isNavEnabled) {
             navTimeoutRef.current = setTimeout(() => {
                 setNavData(null);
                 setNavAddress(null);
             }, 30000);
             return;
         }
         
         if (navTimeoutRef.current) {
             clearTimeout(navTimeoutRef.current);
             navTimeoutRef.current = null;
         }
         
         let active = true;
         const fetchRoute = async () => {
              const myL = latestMyLocation.current;
              const trgL = latestTargetLoc.current;
              if (!myL || !trgL) return;
              try {
                  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${myL.lng},${myL.lat};${trgL.lng},${trgL.lat}?overview=full&geometries=geojson&steps=true`);
                  const data = await res.json();
                  if (active && data.routes && data.routes.length > 0) {
                      const route = data.routes[0];
                      const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
                      const durationMin = Math.ceil(route.duration / 60);
                      const steps = route.legs[0].steps;
                      setNavData({ routeCoords: coords, durationMin, steps });
                  }
              } catch(e){}
         };
         
         fetchRoute();
         const tId = setInterval(fetchRoute, 20000);
         return () => { active = false; clearInterval(tId); };
    }, [isNavEnabled, targetId]);

    const defaultCenter: [number, number] = useMemo(() => {
        return myLocation ? [myLocation.lat, myLocation.lng] : [51.505, -0.09];
    }, [myLocation]);

    const formatDist = (m: number) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

    const findClosestIndex = (coords: [number, number][], current: [number, number]) => {
        let minDistance = Infinity;
        let closestIndex = 0;
        const myLatL = L.latLng(current[0], current[1]);
        coords.forEach((c, idx) => {
            const dist = myLatL.distanceTo(L.latLng(c[0], c[1]));
            if (dist < minDistance) {
                minDistance = dist;
                closestIndex = idx;
            }
        });
        return closestIndex;
    };

    const renderMapElements = () => (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isMapDark
                    ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
            />

            {myLocation && <MapController center={[myLocation.lat, myLocation.lng]} />}

            {isNavEnabled && navData && (
                <Polyline 
                    positions={
                        myLocation 
                        ? [ [myLocation.lat, myLocation.lng] as [number, number], ...navData.routeCoords.slice(findClosestIndex(navData.routeCoords, [myLocation.lat, myLocation.lng])) ]
                        : navData.routeCoords
                    } 
                    color="#3B82F6" 
                    weight={7} 
                    opacity={0.85} 
                />
            )}

            {/* My Marker */}
            {myLocation && (
                <Marker
                    position={[myLocation.lat, myLocation.lng]}
                    icon={isNavEnabled ? createArrowIcon(myColor, navHeading) : createCustomIcon(myColor, name.charAt(0).toUpperCase(), false, userType === 'Doctor' ? 'Doctor' : (needsCare ? 'SOS' : 'Patient'))}
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

                let roleType: 'Doctor' | 'Patient' | 'SOS' = user.userType === 'Doctor' ? 'Doctor' : 'Patient';
                if (user.needsCare) roleType = 'SOS';

                return (
                    <Marker
                        key={user.id}
                        position={[user.location.lat, user.location.lng]}
                        icon={createCustomIcon(
                            user.color,
                            user.name.charAt(0).toUpperCase(),
                            isFlickering && (acceptingPatientId === null || acceptingPatientId === user.id),
                            roleType
                        )}
                    >
                        <Popup>
                            <strong>{user.name} ({user.userType}){distanceStr}</strong><br />
                            {user.needsCare ? "Needs Medical Care!" : (user.isAcceptingHelp && user.userType === 'Doctor' ? "On the way to help" : "User's location")}
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );

    const ReachedBanner = hasReachedTarget && activeTargetUser ? (
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4 rounded-xl shadow-2xl border-2 border-emerald-400 dark:border-emerald-500 animate-in fade-in zoom-in w-full max-w-sm mx-auto text-center font-bold relative z-[9999]">
            <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                <span className="text-sm tracking-wider uppercase">Emergency Reached</span>
            </div>
            {userType === 'Doctor' ? (
                <span>You have reached the patient.</span>
            ) : (
                <span>Dr. {activeTargetUser.name} has reached your place.</span>
            )}
        </div>
    ) : null;

    return (
        <div className="w-full relative flex flex-col pointer-events-none isolate">
            {mapState === 'collapsed' && (
                <div className="w-full flex flex-col items-center justify-center py-12 px-6 pointer-events-auto border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/20">
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
                            onClick={() => setMapState('mini')}
                            className="mt-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-6 py-3 font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            <svg className="w-5 h-5 text-med" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            View Live Map
                        </button>
                    </div>
                </div>
            )}

            {mapState === 'mini' && (
                <div className="w-full flex flex-col gap-2 pointer-events-auto">
                    <div className="w-full aspect-[4/5] min-h-[350px] max-h-[500px] bg-slate-200 dark:bg-slate-800 rounded-[2rem] shadow-xl border-[6px] border-white dark:border-slate-700 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 isolate">
                        <div className="absolute top-3 right-3 z-[2000] flex flex-col gap-2">
                            <button onClick={() => setMapState('large')} className="bg-white/95 dark:bg-slate-800/95 p-2.5 rounded-full shadow hover:scale-105 transition-transform text-slate-800 dark:text-slate-200 pointer-events-auto cursor-pointer border border-transparent dark:border-slate-600">
                                <Maximize2 size={18} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => setMapState('collapsed')} className="bg-white/95 dark:bg-slate-800/95 p-2.5 rounded-full shadow hover:scale-105 transition-transform text-danger pointer-events-auto cursor-pointer border border-transparent dark:border-slate-600">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => setIsMapDark(!isMapDark)} className="bg-white/95 dark:bg-slate-800/95 p-2.5 rounded-full shadow hover:scale-105 transition-transform text-slate-800 dark:text-slate-200 pointer-events-auto cursor-pointer border border-transparent dark:border-slate-600 mt-2">
                                {isMapDark ? <Sun size={18} strokeWidth={2.5} className="text-amber-500" /> : <Moon size={18} strokeWidth={2.5} />}
                            </button>
                            <button onClick={() => { if (activeTargetUser) setIsNavEnabled(!isNavEnabled); }} className={`bg-white/95 dark:bg-slate-800/95 p-2.5 rounded-full shadow transition-transform pointer-events-auto cursor-pointer border border-transparent dark:border-slate-600 ${isNavEnabled ? 'text-blue-500 hover:scale-105' : 'text-slate-400 dark:text-slate-500'} ${!activeTargetUser ? 'opacity-40 hover:scale-100' : 'hover:scale-105'}`}>
                                {isNavEnabled ? <Navigation size={18} strokeWidth={2.5} /> : <NavigationOff size={18} strokeWidth={2.5} />}
                            </button>
                        </div>
                        {isNavEnabled && navData && (
                            <div className="absolute bottom-4 left-4 z-[2000] bg-blue-600 font-bold text-white px-3.5 py-2 rounded-xl shadow-lg border border-blue-500/50 flex items-center gap-2 text-sm">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                                {navData.durationMin} min
                            </div>
                        )}
                        <div className="flex-1 w-full h-full relative z-0">
                            <MapContainer
                                center={defaultCenter}
                                zoom={15}
                                zoomControl={false}
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                            >
                                {renderMapElements()}
                            </MapContainer>
                        </div>
                    </div>
                    {hasReachedTarget && ReachedBanner}
                    {isNavEnabled && !hasReachedTarget && navAddress && (
                        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3 w-full">
                            <div className="bg-blue-50 dark:bg-blue-900/40 p-2.5 rounded-full shrink-0 border border-blue-100 dark:border-blue-800/60">
                                <MapPin size={22} className="text-blue-500" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[0.65rem] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-0.5">Dest. Landmark</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{navAddress}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {mapState === 'large' && createPortal(
                <div className="fixed inset-0 z-[5000] bg-slate-900 pointer-events-auto animate-in fade-in duration-300 flex flex-col">
                    <div className="absolute top-8 right-6 z-[6000] flex flex-col gap-3 pointer-events-auto items-center">
                        <button onClick={() => setMapState('mini')} className="bg-white/95 dark:bg-slate-800/95 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform text-slate-800 dark:text-slate-200 cursor-pointer">
                            <Minimize2 size={24} strokeWidth={2.5} />
                        </button>
                        {centerMapToMe && (
                            <button onClick={centerMapToMe} className="bg-white/95 dark:bg-slate-800/95 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform text-med cursor-pointer mb-2">
                                <Locate strokeWidth={2.5} size={24} />
                            </button>
                        )}
                        <button onClick={() => setIsMapDark(!isMapDark)} className="bg-white/95 dark:bg-slate-800/95 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform text-slate-800 dark:text-slate-200 cursor-pointer">
                            {isMapDark ? <Sun size={24} strokeWidth={2.5} className="text-amber-500" /> : <Moon size={24} strokeWidth={2.5} />}
                        </button>
                        <button onClick={() => { if (activeTargetUser && !hasReachedTarget) setIsNavEnabled(!isNavEnabled); }} className={`bg-white/95 dark:bg-slate-800/95 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-transform cursor-pointer ${isNavEnabled ? 'text-blue-500 hover:scale-105' : 'text-slate-400 dark:text-slate-500'} ${(!activeTargetUser || hasReachedTarget) ? 'opacity-40 hover:scale-100' : 'hover:scale-105'}`}>
                            {isNavEnabled ? <Navigation size={24} strokeWidth={2.5} /> : <NavigationOff size={24} strokeWidth={2.5} />}
                        </button>
                    </div>

                    {hasReachedTarget ? (
                        <div className="absolute top-8 left-6 z-[6000] pointer-events-auto">
                            {ReachedBanner}
                        </div>
                    ) : (isNavEnabled && navData && navData.steps && navData.steps.length > 0 ? (
                        <div className="absolute top-8 left-6 z-[6000] pointer-events-auto">
                            <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 flex flex-col ${isNavAssistMinimized ? 'w-14 h-14' : 'w-80'}`}>
                                {isNavAssistMinimized ? (
                                    <button 
                                      onClick={() => setIsNavAssistMinimized(false)}
                                      className="w-full h-full flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                        <List size={22} strokeWidth={2.5} />
                                    </button>
                                ) : (
                                    <>
                                        <div className="bg-blue-600 border-b border-blue-700/50 text-white flex items-center justify-between p-4 px-5">
                                            <span className="font-bold flex items-center gap-2.5 text-base shadow-sm">
                                               <Navigation size={18} strokeWidth={3} fill="currentColor" />
                                               {navData.durationMin} min away
                                            </span>
                                            <button onClick={() => setIsNavAssistMinimized(true)} className="text-blue-200 hover:text-white transition-colors bg-white/20 hover:bg-white/30 p-1.5 rounded-full">
                                               <Minimize2 size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <div className="max-h-[min(50vh,300px)] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                            {navData.steps.map((step: any, i: number) => {
                                                 if (!step.maneuver) return null;
                                                 return (
                                                     <div key={i} className="p-3 px-4 flex gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                                                         <div className="text-blue-600 dark:text-blue-500 shrink-0 bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                                                             {getNavIconType(step.maneuver.modifier || 'straight')}
                                                         </div>
                                                         <div className="flex flex-col">
                                                             <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{step.name ? `Turn on ${step.name}` : step.maneuver.instruction || 'Proceed straight'}</span>
                                                             {step.distance > 0 && <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">In {Math.round(step.distance)} m</span>}
                                                         </div>
                                                     </div>
                                                 );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : null)}

                    <MapContainer
                        center={defaultCenter}
                        zoom={15}
                        zoomControl={false}
                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                    >
                        {renderMapElements()}
                    </MapContainer>

                    {fullscreenOverlay && (
                        <div className="absolute bottom-10 left-0 w-full z-[6000] px-6 pointer-events-none flex justify-center">
                            <div className="w-full max-w-md flex flex-col gap-3 items-center">
                                {fullscreenOverlay}
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};
