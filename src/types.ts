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
    isActiveResponder?: boolean;
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

// ----------------------------------------------------
// Phase 2 Database & Authentication Schemas
// ----------------------------------------------------

export interface DatabaseProfile {
    profile_id: string; // Relational Primary Key (mapped to Auth Provider UUID)
    created_at: string;
    email: string;
    full_name: string;
    role: 'Doctor' | 'Patient';
    medical_license_number?: string; // For Doctor verification check
    is_verified: boolean;
}

export interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    profile: DatabaseProfile;
}
