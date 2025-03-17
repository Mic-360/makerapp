import { MakerSpace } from "./constants";

export interface Machine {
    id: string;
    name: string;
    imagelink: string;
    makerspacename: string;
    location: string;
    rating: number;
    categories: string[];
    description: string;
    price: number;
    time: {
        start: string;
        end: string;
    };
    status: string;
}

export interface Event {
    category: string;
    // Add other event properties as needed
}

const BASE_URL = 'http://localhost:5000';

export async function fetchMachines(): Promise<MakerSpace[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/machines`);
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
        const response = await fetch(`${BASE_URL}/api/city/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching city data:', error);
        return { machines: [], events: [] };
    }
}

export async function fetchMachinesByLocation(location: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/machines/by-location/${encodeURIComponent(location)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch machines for location');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching machines by location:', error);
        return [];
    }
}

export async function fetchEventsByLocation(location: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/events/by-location/${encodeURIComponent(location)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events for location');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching events by location:', error);
        return [];
    }
}

export async function fetchMachinesByMakerspace(makerspaceName: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/machines/by-makerspace/${encodeURIComponent(makerspaceName)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch machines for makerspace');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching machines by makerspace:', error);
        return [];
    }
}

export async function fetchEventsByMakerspace(makerspaceName: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/events/by-makerspace/${encodeURIComponent(makerspaceName)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events for makerspace');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching events by makerspace:', error);
        return [];
    }
}

export async function fetchMakerspaceByName(name: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/makerspace/by-name/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch makerspace details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching makerspace:', error);
        return null;
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
    usertype: string[];
    industry: string;
    purpose: string[];
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

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to create account');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to create account');
    }
}

interface LoginResponse {
    user: User;
    token: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An error occurred during login');
    }
}

export async function verifyEmailOrPhone(identifier: string) {
    try {
        if (identifier.includes('@')) {
            // For email verification
            const response = await fetch(`${BASE_URL}/api/users/by-email/${identifier}`);
            return { email: identifier, isValid: response.ok };
        } else {
            // For phone number verification
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
