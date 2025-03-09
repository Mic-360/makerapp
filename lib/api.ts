import { MakerSpace } from "./constants";

const BASE_URL = 'http://localhost:5000';

export async function fetchMachines(): Promise<MakerSpace[]> {
    try {
        const response = await fetch('/api/machines');
        if (!response.ok) {
            throw new Error('Failed to fetch machines');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching makerspaces:', error);
        return [];
    }
}

export async function fetchCityData(city: string) {
    try {
        const response = await fetch(`/api/city/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching city data:', error);
        return { machines: [], events: [] };
    }
}

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
}

interface SignupData {
    email: string;
    password: string;
    name: string;
    number: string;
    usertype?: string;
    industry?: string;
    purpose?: string;
    role?: string;
}

export async function signupUser(data: SignupData) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create account');
        }

        return await response.json();
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid credentials');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function verifyEmailOrPhone(identifier: string) {
    try {
        if (identifier.includes('@')) {
            // For email, we'll check if the user exists via login attempt
            const response = await fetch(`${BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: identifier, password: '' }),
            });
            return { email: identifier, isValid: response.status !== 401 };
        } else {
            // For phone number, use the by-number endpoint
            const response = await fetch(`${BASE_URL}/api/users/by-number/${identifier}`);
            if (response.ok) {
                const data = await response.json();
                return { email: data.email, isValid: true };
            }
            return { email: '', isValid: false };
        }
    } catch (error) {
        console.error('Verification error:', error);
        return { email: '', isValid: false };
    }
}

export async function reauthorizeUser(token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/reauth`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Reauthorization failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Reauth error:', error);
        throw error;
    }
}
