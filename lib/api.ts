import { MakerSpace } from "./constants";

export interface Machine {
    id: string;
    category: string;
    brand: string;
    model: string;
    price: number;
    time: {
        start: string;
        end: string;
    };
    imageLinks?: string[];
    description: string;
    location: string;
    instruction?: string | null;
    inCharge?: Array<{
        name: string;
        number: string;
    }>;
    makerSpace: string;
    status?: 'active' | 'inactive';
    rating?: number;
}

export interface Event {
    id: string;
    name: string;
    category: string;
    date: {
        start: string;
        end: string;
    };
    time: {
        start: string;
        end: string;
    };
    ticket: {
        type: string;
        price: number;
    };
    ticketLimit: number;
    imageLinks?: string[];
    description: string;
    agenda?: string;
    location: string;
    experts: Array<{
        name: string;
        number: string;
    }>;
    makerSpace: string;
    status?: 'active' | 'inactive';
}

export interface Makerspace {
    id: string;
    type: string;
    usage: string[];
    name: string;
    description: string;
    email: string;
    number: string;
    inChargeName: string;
    websiteLink: string;
    timings: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    city: string;
    state: string;
    address: string;
    zipcode: string;
    country: string;
    organizationName: string;
    organizationEmail: string;
    imageLinks: string[];
    logoImageLinks: string[];
    googleMapLink: string;
    howToReach: string[];
    amenities: string[];
    mentors: Array<{
        name: string;
        designation: string;
        linkedin: string;
        image: string;
    }>;
    instructions: string;
    additionalInformation: string;
    rating: number;
    status: string;
}

export const BASE_URL = 'http://localhost:8080';

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

// export async function fetchMachinesByLocation(location: string) {
//     try {
//         const response = await fetch(`${BASE_URL}/api/machines/by-location/${encodeURIComponent(location)}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch machines for location');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching machines by location:', error);
//         return [];
//     }
// }

// export async function fetchEventsByLocation(location: string) {
//     try {
//         const response = await fetch(`${BASE_URL}/api/events/by-location/${encodeURIComponent(location)}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch events for location');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching events by location:', error);
//         return [];
//     }
// }

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

export async function fetchMakerspaces(city: string): Promise<string[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/makerspace/by-city/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch makerspaces');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching makerspaces:', error);
        return [];
    }
}

export async function fetchMachinesByMakerspaces(makerSpaces: string[]) {
    try {
        const response = await fetch(`${BASE_URL}/api/machines/by-makerspaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ makerSpaces }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch machines');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching machines:', error);
        return [];
    }
}

export async function fetchEventsByMakerspaces(makerSpaces: string[]) {
    try {
        const response = await fetch(`${BASE_URL}/api/events/by-makerspaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ makerSpaces }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
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
    industry: string[];
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
        let queryParam = '';
        if (identifier.includes('@')) {
            queryParam = `email=${encodeURIComponent(identifier)}`;
        } else {
            queryParam = `number=${encodeURIComponent(identifier)}`;
        }

        const response = await fetch(`${BASE_URL}/api/users/by-contact?${queryParam}`);
        const data = await response.json();

        if (!response.ok) {
            return { email: '', isValid: false };
        }

        return { email: data.email, isValid: true };
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

export async function forgotPassword(email: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to process forgot password request');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to process forgot password request');
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to reset password');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to reset password');
    }
}

export interface VerifyTokenResponse {
    isValid: boolean;
    email?: string;
    message: string;
}

export async function verifyMakerspaceToken(token: string): Promise<VerifyTokenResponse> {
    try {
        const response = await fetch(`${BASE_URL}/api/makerspaces/verify/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                isValid: false,
                message: data.message || 'Token verification failed'
            };
        }

        return data;
    } catch (error) {
        console.error('Token verification error:', error);
        return {
            isValid: false,
            message: 'Error verifying token'
        };
    }
}

interface MakerspaceFormData {
    type: string;
    usage: string[];
    name: string;
    email: string;
    number: string;
    inChargeName: string;
    websiteLink: string;
    timings: Record<string, string>;
    city: string;
    state: string;
    address: string;
    zipcode: string;
    country: string;
    organizationName?: string;
    organizationEmail?: string;
    imageLinks?: string[];
    logoImageLinks?: string[];
}

export async function createMakerspace(token: string, data: MakerspaceFormData) {
    try {
        const response = await fetch(`${BASE_URL}/api/makerspaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to create makerspace');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to create makerspace');
    }
}

export async function updateMakerspace(id: string, data: Partial<Makerspace>, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/api/makerspaces/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update makerspace');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to update makerspace');
    }
}
