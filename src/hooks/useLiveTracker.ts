import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import L from 'leaflet';
import crypto from 'crypto';
import type { User, Location as UserLocation, ChatMessage } from '../types';

// Native NodeJS Crypto API Setup for AES-256-CBC End-to-End Encryption
const ENCRYPTION_SECRET = "medem-secure-e2ee-secret-key-2026-must-be-32-bytes";
const ALGORITHM = 'aes-256-cbc';

// Generate exactly a 32 byte key from the secret string
const KEY = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest('base64').substring(0, 32);
interface UseLiveTrackerProps {
    name: string;
    userType: 'Doctor' | 'Patient';
    myColor: string;
    isJoined: boolean;
    needsCare: boolean;
    isAcceptingHelp?: boolean;
    acceptingPatientId?: string | null;
    geofenceRadius?: number;
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
    geofenceRadius = 2000,
    onError,
    onJoinSuccess
}: UseLiveTrackerProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [myLocation, setMyLocation] = useState<UserLocation | null>(null);
    const [users, setUsers] = useState<Map<string, User>>(new Map());
    const [nearbyPatients, setNearbyPatients] = useState<{ user: User, distance: number }[]>([]);
    const [incomingDoctors, setIncomingDoctors] = useState<{ user: User, distance: number }[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
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

        newSocket.on('receive_message', (data: { senderId: string, payload: { ciphertext: string, iv: string }, timestamp: string }) => {
            try {
                const ivBuffer = Buffer.from(data.payload.iv, 'hex');
                const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), ivBuffer);

                let decryptedMessage = decipher.update(data.payload.ciphertext, 'hex', 'utf8');
                decryptedMessage += decipher.final('utf8');

                if (decryptedMessage) {
                    setMessages(prev => [...prev, {
                        senderId: data.senderId,
                        message: decryptedMessage,
                        timestamp: data.timestamp
                    }]);
                }
            } catch (err) {
                console.error("Failed to decrypt secure message (NodeCrypto)", err);
            }
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
                    if (distance <= geofenceRadius) nearby.push({ user, distance });
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
    }, [users, myLocation, isJoined, userType, needsCare, acceptingPatientId, socket, geofenceRadius]);

    useEffect(() => {
        if (socket && isJoined) {
            socket.emit('update_status', { isAcceptingHelp, needsCare, acceptingPatientId });
        }
    }, [isAcceptingHelp, needsCare, acceptingPatientId, socket, isJoined]);

    const sendMessage = (targetId: string, message: string) => {
        if (socket && isJoined) {
            try {
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);

                let encrypted = cipher.update(message, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                const encryptedPayload = {
                    ciphertext: encrypted,
                    iv: iv.toString('hex')
                };

                const msgObj: ChatMessage = { senderId: 'me', message, timestamp: new Date().toISOString() };
                socket.emit('send_message', { targetId, payload: encryptedPayload });
                setMessages(prev => [...prev, msgObj]);
            } catch (err) {
                console.error("Encryption failed:", err);
            }
        }
    };

    return {
        socket,
        myLocation,
        users,
        nearbyPatients,
        incomingDoctors,
        messages,
        sendMessage,
        triggerJoin,
        setMyLocation
    };
};
