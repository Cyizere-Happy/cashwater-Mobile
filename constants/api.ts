import { Platform } from 'react-native';

// IMPORTANT: If testing on a PHYSICAL DEVICE (not emulator):
// 1. Find your computer's local IP (e.g., 192.168.1.10)
// 2. Replace 'localhost' or '10.0.2.2' with that IP address below
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3005' : 'http://localhost:3005';
// export const API_URL = 'http://192.168.x.x:3005'; // Example for physical device

export const endpoints = {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    registerDevice: `${API_URL}/devices/register`,
    myDevices: `${API_URL}/devices/my-devices`,
};
