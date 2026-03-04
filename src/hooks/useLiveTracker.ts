import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import L from 'leaflet';
import type { User, Location as UserLocation, ChatMessage } from '../types';

// Web Crypto API Setup for AES-GCM End-to-End Encryption
const ENCRYPTION_SECRET = "medem-secure-e2ee-secret-key-2026";
const getFixedKey = async () => {
    const enc = new TextEncoder();
    const keyMaterial = enc.encode(ENCRYPTION_SECRET.padEnd(32, '0').slice(0, 32));
    return await window.crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
};

// Utility to convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Utility to convert Base64 to ArrayBuffer
const base64ToBuffer = (base64: string) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

// Web Crypto API Setup for AES-GCM End-to-End Encryption
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

        newSocket.on('receive_message', async (data: { senderId: string, payload: { ciphertext: string, iv: string }, timestamp: string }) => {
            try {
                const key = await getFixedKey();
                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    {
                        name: "AES-GCM",
                        iv: new Uint8Array(base64ToBuffer(data.payload.iv))
                    },
                    key,
                    base64ToBuffer(data.payload.ciphertext)
                );

                const dec = new TextDecoder();
                const decryptedMessage = dec.decode(decryptedBuffer);

                if (decryptedMessage) {
                    setMessages(prev => [...prev, {
                        senderId: data.senderId,
                        message: decryptedMessage,
                        timestamp: data.timestamp
                    }]);
                }
            } catch (err) {
                console.error("Failed to decrypt secure message (WebCrypto)", err);
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

    const sendMessage = async (targetId: string, message: string) => {
        if (socket && isJoined) {
            try {
                const enc = new TextEncoder();
                const key = await getFixedKey();
                const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

                const encryptedBuffer = await window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    key,
                    enc.encode(message)
                );

                const encryptedPayload = {
                    ciphertext: bufferToBase64(encryptedBuffer),
                    iv: bufferToBase64(iv.buffer)
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
