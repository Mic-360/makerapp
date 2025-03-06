import { MakerSpace } from "./constants";

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

// Mock user database
const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        image: 'https://ui-avatars.com/api/?name=John+Doe',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        image: 'https://ui-avatars.com/api/?name=Jane+Smith',
    }
];

export async function verifyEmailOrPhone(identifier: string): Promise<{ email: string; isValid: boolean }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // This could be a real API endpoint in production
    const mockUsers = [
        { email: 'john@example.com', phone: '1234567890' },
        { email: 'jane@example.com', phone: '9876543210' },
    ];

    if (identifier.includes('@')) {
        const user = mockUsers.find(u => u.email === identifier);
        return { email: identifier, isValid: !!user };
    } else {
        const user = mockUsers.find(u => u.phone === identifier);
        return { email: user?.email || '', isValid: !!user };
    }
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}
