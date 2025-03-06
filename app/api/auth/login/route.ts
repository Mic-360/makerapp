import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123', // In a real app, this would be hashed
        image: 'https://st1.bollywoodlife.com/wp-content/uploads/2019/01/don-shah-rukh-khan-1.jpg',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        password: 'password456', // In a real app, this would be hashed
        image: 'https://st1.bollywoodlife.com/wp-content/uploads/2019/01/jane-smith-image.jpg', // Updated Jane's image URL
    }
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;


        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Simulate database lookup delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Don't send password in response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            token: `mock-jwt-token-${user.id}-${Date.now()}`
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}