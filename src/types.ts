export interface Location {
    lat: number;
    lng: number;
}

export interface User {
    id: string;
    name: string;
    location: Location;
    color: string;
    userType: 'Doctor' | 'Patient';
    needsCare: boolean;
    isAcceptingHelp?: boolean;
    acceptingPatientId?: string | null;
}

export interface ChatMessage {
    senderId: string;
    message: string;
    timestamp: string;
}

export interface HistoryEvent {
    id: string;
    targetId: string;
    targetName: string;
    timestamp: string;
    location: Location;
    address: string | null;
    userType: 'Doctor' | 'Patient';
    rating: number | null;
}
