import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import L from 'leaflet';
import type { User, Location as UserLocation } from '../types';

interface UseLiveTrackerProps {
    name: string;
    userType: 'Doctor' | 'Patient';
    myColor: string;
    isJoined: boolean;
    needsCare: boolean;
    isAcceptingHelp?: boolean;
    acceptingPatientId?: string | null;
    onError: (err: string) => void;
    onJoinSuccess: (loc: UserLocation) => void;
}

export const useLiveTracker = ({
    name,
    userType,
    myColor,
    isJoined,
    needsCare,
    isAcceptingHelp = false,
    acceptingPatientId = null,
    onError,
    onJoinSuccess
}: UseLiveTrackerProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [myLocation, setMyLocation] = useState<UserLocation | null>(null);
    const [users, setUsers] = useState<Map<string, User>>(new Map());
    const [nearbyPatients, setNearbyPatients] = useState<{ user: User, distance: number }[]>([]);
    const [incomingDoctors, setIncomingDoctors] = useState<{ user: User, distance: number }[]>([]);
    const watchId = useRef<number | null>(null);

    const stateRef = useRef({ isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp, acceptingPatientId });
    useEffect(() => {
        stateRef.current = { isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp, acceptingPatientId };
    }, [isJoined, myLocation, name, myColor, userType, needsCare, isAcceptingHelp, acceptingPatientId]);

    useEffect(() => {
        const getBackendUrl = () => {
            if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
            if (window.location.hostname === 'localhost') return 'http://localhost:3001';
            return `http://${window.location.hostname}:3001`;
        };

        const newSocket = io(getBackendUrl());
        setSocket(newSocket);

        newSocket.on('users', (existingUsers: User[]) => {
            const filtered = existingUsers.filter(u => u.id !== newSocket.id);
            setUsers(new Map(filtered.map(u => [u.id, u])));
        });

        newSocket.on('user_joined', (user: User) => {
            if (user.id === newSocket.id) return;
            setUsers(prev => {
                const next = new Map(prev);
                next.set(user.id, user);
                return next;
            });
        });

        newSocket.on('user_updated', (user: User) => {
            if (user.id === newSocket.id) return;
            setUsers(prev => {
                const next = new Map(prev);
                next.set(user.id, user);
                return next;
            });
        });

        newSocket.on('user_left', (id: string) => {
            setUsers(prev => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        });

        newSocket.on('connect', () => {
            const state = stateRef.current;
            if (state.isJoined && state.myLocation && state.name) {
                newSocket.emit('join', {
                    name: state.name.trim(),
                    location: state.myLocation,
                    color: state.myColor,
                    userType: state.userType,
                    needsCare: state.needsCare,
                    isAcceptingHelp: state.isAcceptingHelp,
                    acceptingPatientId: state.acceptingPatientId
                });
            }
        });

        return () => {
            newSocket.disconnect();
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    const triggerJoin = () => {
        if (!navigator.geolocation) {
            onError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                setMyLocation(location);
                onJoinSuccess(location);

                if (socket) {
                    socket.emit('join', { name: name.trim(), location, color: myColor, userType, needsCare, isAcceptingHelp, acceptingPatientId });

                    watchId.current = navigator.geolocation.watchPosition(
                        (pos) => {
                            const newLocation = {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude
                            };
                            setMyLocation(newLocation);
                            socket.emit('update_location', { location: newLocation });
                        },
                        (err) => console.error(err),
                        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                    );
                }
            },
            (err) => {
                onError('Please allow location access to use the app.');
                console.error(err);
            }
        );
    };

    useEffect(() => {
        if (!isJoined || !myLocation) return;
        const myLatLng = L.latLng(myLocation.lat, myLocation.lng);

        if (userType === 'Doctor') {
            const nearby: { user: User, distance: number }[] = [];
            Array.from(users.values()).forEach(user => {
                if (user.userType === 'Patient' && user.needsCare && user.location) {
                    const userLatLng = L.latLng(user.location.lat, user.location.lng);
                    const distance = myLatLng.distanceTo(userLatLng);
                    if (distance <= 500) nearby.push({ user, distance });
                }
            });
            setNearbyPatients(nearby);
            setIncomingDoctors([]);
        } else if (userType === 'Patient') {
            if (needsCare) {
                const doctors: { user: User, distance: number }[] = [];
                Array.from(users.values()).forEach(user => {
                    if (user.userType === 'Doctor' && user.acceptingPatientId === socket?.id && user.location) {
                        const userLatLng = L.latLng(user.location.lat, user.location.lng);
                        const distance = myLatLng.distanceTo(userLatLng);
                        doctors.push({ user, distance });
                    }
                });
                setIncomingDoctors(doctors);
            } else {
                setIncomingDoctors([]);
            }
            setNearbyPatients([]);
        }
    }, [users, myLocation, isJoined, userType, needsCare, acceptingPatientId, socket]);

    useEffect(() => {
        if (socket && isJoined) {
            socket.emit('update_status', { isAcceptingHelp, needsCare, acceptingPatientId });
        }
    }, [isAcceptingHelp, needsCare, acceptingPatientId, socket, isJoined]);

    return {
        socket,
        myLocation,
        users,
        nearbyPatients,
        incomingDoctors,
        triggerJoin,
        setMyLocation
    };
};
