import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Get the API base URL based on environment and platform
 * 
 * Priority:
 * 1. Environment variable from app.json (production)
 * 2. Development mode detection
 * 3. Fallback to localhost
 */
const getApiUrl = (): string => {
    // For production - set in app.json extra.apiUrl
    if (Constants.expoConfig?.extra?.apiUrl) {
        return Constants.expoConfig.extra.apiUrl;
    }

    // For development
    if (__DEV__) {
        if (Platform.OS === 'web') {
            // Web can use localhost
            return 'http://localhost:5000';
        }

        // Mobile needs your computer's local IP
        // TODO: Replace with your actual local IP address
        // Find it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
        const LOCAL_IP = '192.168.1.100'; // CHANGE THIS TO YOUR IP
        return `http://${LOCAL_IP}:5000`;
    }

    // Fallback
    return 'http://localhost:5000';
};

export const API_URL = getApiUrl();

/**
 * API Endpoints
 * All endpoints are defined here for easy maintenance
 */
export const API_ENDPOINTS = {
    // Interview endpoints
    uploadContext: `${API_URL}/interview/upload-context`,
    transcribeAudio: `${API_URL}/interview/transcribe-audio`,
    getAnswer: `${API_URL}/interview/get-answer`,
    testUpload: `${API_URL}/interview/test-upload`,

    // Auth endpoints (TODO: implement)
    signup: `${API_URL}/auth/signup`,
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    refreshToken: `${API_URL}/auth/refresh`,
    getCurrentUser: `${API_URL}/auth/me`,

    // User endpoints (TODO: implement)
    getUserProfile: `${API_URL}/users/profile`,
    updateUserProfile: `${API_URL}/users/profile`,
    deleteAccount: `${API_URL}/users/account`,

    // Session endpoints (TODO: implement)
    createSession: `${API_URL}/sessions`,
    getSessions: `${API_URL}/sessions`,
    getSession: (id: string) => `${API_URL}/sessions/${id}`,
    updateSession: (id: string) => `${API_URL}/sessions/${id}`,
    deleteSession: (id: string) => `${API_URL}/sessions/${id}`,

    // History endpoints (TODO: implement)
    getHistory: `${API_URL}/history`,
    getSessionHistory: (sessionId: string) => `${API_URL}/history/session/${sessionId}`,
    saveQA: `${API_URL}/history`,
    deleteHistory: (id: string) => `${API_URL}/history/${id}`,
};

/**
 * API Configuration
 */
export const API_CONFIG = {
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
};

/**
 * Helper function to log API calls in development
 */
export const logApiCall = (endpoint: string, method: string, data?: any) => {
    if (__DEV__) {
        console.log(`[API] ${method} ${endpoint}`, data || '');
    }
};
