import { io } from 'socket.io-client';

const run = () => {
    console.log("Connecting patient...");
    const patientSocket = io('http://localhost:3001', { auth: { token: 'medem-secure-client-2026' } });
    
    patientSocket.on('connect', () => {
        console.log('Patient connected.', patientSocket.id);
        patientSocket.emit('join', {
            name: 'Patient Test',
            location: { lat: 28.1, lng: 77.1 },
            userType: 'Patient',
            needsCare: true
        });
        
        patientSocket.on('nearby_doctors_count', (count) => {
            console.log('Patient nearby_doctors_count:', count);
        });
        
        setTimeout(() => {
            console.log("Connecting doctor...");
            const docSocket = io('http://localhost:3001', { auth: { token: 'medem-secure-client-2026' } });
            
            docSocket.on('connect', () => {
                console.log('Doctor connected.', docSocket.id);
                docSocket.emit('join', {
                    name: 'Doctor Test',
                    location: { lat: 28.1, lng: 77.1 },
                    userType: 'Doctor',
                    geofenceRadius: 2000
                });
                
                docSocket.on('users', (users) => {
                    console.log('Doctor initial users:', users.length);
                });
                docSocket.on('user_joined', (user) => {
                    console.log('Doctor user_joined:', user.name);
                });
                docSocket.on('user_updated', (user) => {
                    console.log('Doctor user_updated:', user.name);
                });
                
                setTimeout(() => {
                    console.log("Patient updating track...");
                    patientSocket.emit('update_location', { location: { lat: 28.101, lng: 77.101 } });
                }, 1000);
                
                setTimeout(() => {
                    process.exit(0);
                }, 2000);
            });
        }, 1000);
    });
};
run();
