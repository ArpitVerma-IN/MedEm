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
